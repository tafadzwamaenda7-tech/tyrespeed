"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { minutes, usd } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import type { QuoteItem } from "@/lib/types";
import { useFocusTrap } from "./use-focus-trap";

const validityCopy =
  "Prices are indicative. The workshop confirms stock, fitment and the final total before work starts.";

export function QuoteDrawer({
  open,
  onClose,
  items,
  setQty,
  remove,
  clear,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  items: QuoteItem[];
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  onSubmitted: (message: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, dialogRef, onClose);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    whatsappHref: string;
    notified: boolean;
  } | null>(null);

  useEffect(() => {
    if (open) trackEvent("quote_open");
    else setConfirmation(null);
  }, [open]);

  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const workshopMinutes = items.reduce(
    (total, item) => total + item.minutes * item.qty,
    0,
  );

  async function submit() {
    setError("");
    if (!items.length) {
      setError("Add at least one line to the quote.");
      return;
    }
    if (name.trim().length < 2 || phone.trim().length < 7 || !consent) {
      setError("Add your name, a reachable phone number and tick the consent box.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            ref: item.ref,
            kind: item.kind,
            label: item.label,
            qty: item.qty,
            price: item.price,
          })),
          name: name.trim(),
          phone: phone.trim(),
          vehicle: vehicle.trim() || "Not supplied",
          notes: notes.trim(),
          consent,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" && result !== null && "error" in result
            ? String((result as { error: unknown }).error)
            : "The quote could not be sent. Call the workshop.";
        setError(message);
        return;
      }

      const responseData = result as {
        reference?: unknown;
        whatsappHref?: unknown;
        notified?: unknown;
      };
      const reference = responseData.reference ? String(responseData.reference) : "quote";
      const whatsappHref =
        typeof responseData.whatsappHref === "string" &&
        responseData.whatsappHref.startsWith("https://wa.me/")
          ? responseData.whatsappHref
          : whatsappLink(
              `Hello tyrespeed, I am following up on quote ${reference}. Please confirm stock and the final price.`,
            );

      setConfirmation({
        reference,
        whatsappHref,
        notified: responseData.notified === true,
      });
      trackEvent("quote_submit");
      clear();
      setName("");
      setPhone("");
      setVehicle("");
      setNotes("");
      setConsent(false);
      onSubmitted(`Quote ${reference} saved.`);
    } catch {
      setError("The quote could not be sent. Check your connection or call the workshop.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div
        className={`overlay${open ? " is-open" : ""}`}
        data-open={open}
        onMouseDown={open ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="drawer"
        data-open={open}
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Quote"
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="drawer-head">
          <div className="row-between">
            <div>
              <h2>Quote</h2>
              <p>Parts and labour, before you commit.</p>
            </div>
            <button type="button" className="btn btn-outline drawer-close" onClick={onClose} aria-label="Close quote">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {confirmation ? (
            <div className="success-box" role="status">
              <h2>Quote saved</h2>
              <p className="success-detail">
                Your reference is <strong className="data">{confirmation.reference}</strong>.
              </p>
              <p className="success-detail">
                {confirmation.notified
                  ? "The workshop has been notified. Keep the reference for your records."
                  : "The request is saved at the workshop. Send it on WhatsApp so we can confirm stock and reply quickly."}
              </p>
              <p className="success-detail">{validityCopy}</p>
              <div className="row success-actions">
                <a
                  href={confirmation.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-accent"
                >
                  Confirm on WhatsApp
                </a>
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="modal-soft">
              <p>
                Nothing in the quote yet. Add a tyre size from the inventory or a service from the work table, then come
                back here to send the list.
              </p>
              <p className="small">{validityCopy}</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="quote-line" key={item.key}>
                <div>
                  <p className="quote-line-title">{item.label}</p>
                  <p className="quote-line-meta">{item.meta}</p>
                  <div className="qty-control" aria-label={`Quantity for ${item.label}`}>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty - 1)}
                      aria-label={`Decrease quantity of ${item.label}`}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.label}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="quote-line-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => remove(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="quote-line-price">{usd(item.price * item.qty)}</p>
              </div>
            ))
          )}

          {!confirmation && (
            <div className="panel drawer-form">
              <div className="panel-body">
                <div className="field-group">
                  <label className="field-label" htmlFor="quote-name">Name</label>
                  <input id="quote-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="quote-phone">Phone or WhatsApp</label>
                  <input id="quote-phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="quote-vehicle">Vehicle (optional)</label>
                  <input id="quote-vehicle" className="field" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="2018 Toyota RAV4" />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="quote-notes">Notes (optional)</label>
                  <textarea id="quote-notes" className="field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Registration, preferred day, anything we should check" />
                </div>
                <label className="checkbox-row">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I agree that tyrespeed may use these details to reply to this quote request.</span>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="drawer-foot">
          <div className="status-item">
            <span className="muted">Estimated workshop time</span>
            <span className="status-value">{minutes(workshopMinutes)}</span>
          </div>
          <div className="status-item">
            <span className="muted">Indicative subtotal</span>
            <span className="status-value drawer-total" aria-live="polite">
              {usd(subtotal)}
            </span>
          </div>
          {!confirmation && (
            <button
              type="button"
              className="btn btn-accent btn-block drawer-submit"
              onClick={submit}
              disabled={sending || items.length === 0}
            >
              {sending ? "Sending…" : "Send quote request"}
            </button>
          )}
          <p className="drawer-note">{validityCopy}</p>
        </div>
      </div>
    </>
  );
}
