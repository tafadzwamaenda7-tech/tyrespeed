"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { trackEvent } from "@/lib/analytics";
import { dateLabel, usd } from "@/lib/format";
import { getService, services } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import type { Slot } from "@/lib/types";

const stepLabels = ["Service", "Vehicle", "Slot", "Contact"];

// Kept in step with the booking API schema so a valid wizard never fails at the server.
const phonePattern = /^[+\d][\d\s()-]{6,19}$/;

type FieldName = "service" | "vehicle" | "registration" | "slot" | "name" | "phone" | "notes" | "consent";
type FieldErrors = Partial<Record<FieldName, string>>;

function fieldMessage(errors: FieldErrors): string {
  return Object.values(errors)[0] ?? "";
}

export function BookingForm({
  slots,
  initialService = "",
  initialVehicle = "",
  initialDay = "",
  initialSlot = "",
}: {
  slots: Slot[];
  initialService?: string;
  initialVehicle?: string;
  initialDay?: string;
  initialSlot?: string;
}) {
  const { toast } = useApp();
  const days = useMemo(() => Array.from(new Set(slots.map((slot) => slot.date))), [slots]);
  const [presetDate, presetTime] = initialSlot.split("|");

  const [step, setStep] = useState(0);
  const [service, setService] = useState(
    services.some((item) => item.slug === initialService) ? initialService : services[0].slug,
  );
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [registration, setRegistration] = useState("");
  const [day, setDay] = useState(presetDate || initialDay || days[0] || "");
  const [time, setTime] = useState(presetTime || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    whatsappHref: string;
    notified: boolean;
  } | null>(null);
  const started = useRef(false);

  const selectedService = getService(service);
  const daySlots = slots.filter((slot) => slot.date === day);

  function validate(current: number): FieldErrors {
    const errors: FieldErrors = {};
    if (current === 0 && !service) errors.service = "Choose a service to continue.";
    if (current === 1) {
      if (vehicle.trim().length < 2 || vehicle.trim().length > 80) errors.vehicle = "Add the vehicle, between 2 and 80 characters.";
      else if (registration.trim().length < 2 || registration.trim().length > 24) errors.registration = "Add its registration, between 2 and 24 characters.";
    }
    if (current === 2 && (!day || !time)) errors.slot = "Pick a day and an available time.";
    if (current === 3) {
      if (name.trim().length < 2 || name.trim().length > 80) errors.name = "Add your name, between 2 and 80 characters.";
      else if (!phonePattern.test(phone.trim()) || phone.trim().length > 24) errors.phone = "Use a reachable phone number, for example 0773 646 6184.";
      else if (notes.trim().length > 1200) errors.notes = "Keep notes under 1200 characters.";
      else if (!consent) errors.consent = "Tick the consent box to continue.";
    }
    return errors;
  }

  function next() {
    if (!started.current) {
      started.current = true;
      trackEvent("booking_start");
    }
    const errors = validate(step);
    const message = fieldMessage(errors);
    setFieldErrors(errors);
    setError(message);
    if (!message) setStep((current) => Math.min(current + 1, 3));
  }

  async function submit() {
    const errors = validate(3);
    const message = fieldMessage(errors);
    setFieldErrors(errors);
    setError(message);
    if (message) return;

    const chosen = slots.find((slot) => slot.date === day && slot.time === time);
    if (!chosen?.available) {
      setError("That slot is no longer open. Pick another time.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          vehicle: vehicle.trim(),
          registration: registration.trim(),
          slot: { date: day, time },
          name: name.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          consent,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const text =
          typeof result === "object" && result !== null && "error" in result
            ? String((result as { error: unknown }).error)
            : "The booking could not be saved. Call the workshop.";
        setError(text);
        return;
      }
      const responseData = result as {
        reference?: unknown;
        whatsappHref?: unknown;
        notified?: unknown;
      };
      const ref = responseData.reference ? String(responseData.reference) : "booking";
      const whatsappHref =
        typeof responseData.whatsappHref === "string" && responseData.whatsappHref.startsWith("https://wa.me/")
          ? responseData.whatsappHref
          : whatsappLink(`Hello tyrespeed, I am following up on booking ${ref}.`);
      setConfirmation({
        reference: ref,
        whatsappHref,
        notified: responseData.notified === true,
      });
      trackEvent("booking_submit");
      toast(`Slot booked under ${ref}`);
    } catch {
      setError("The booking could not be saved. Check your connection or call the workshop.");
    } finally {
      setSending(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) next();
    else void submit();
  }

  if (confirmation) {
    return (
      <div className="success-box" role="status">
        <h2>Booking saved</h2>
        <p className="success-detail">Your reference is <strong className="data">{confirmation.reference}</strong>.</p>
        <p className="success-detail">
          {selectedService?.title}, {vehicle}, {day} at {time}, bay {slots.find((slot) => slot.date === day && slot.time === time)?.bay}.
        </p>
        <p className="success-detail">
          Come to 20 McChlery Road, Eastlea and park in the first marked bay. Someone will come out within five minutes.
        </p>
        <p className="success-detail">
          {confirmation.notified
            ? "The workshop has been notified. Keep the reference for your records."
            : "The request is saved at the workshop. Send the reference on WhatsApp so we can reply quickly."}
        </p>
        <div className="row success-actions">
          <a
            href={confirmation.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-accent"
          >
            Confirm on WhatsApp
          </a>
          <Link href="/workshop" className="btn btn-outline">What happens on arrival</Link>
          <Link href="/" className="btn btn-outline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="panel booking-panel" onSubmit={handleFormSubmit} noValidate>
      <div className="panel-head">
        <h2>Book a workshop slot</h2>
        <span className="count">14-day schedule</span>
      </div>

      <div className="panel-body">
        <ol className="booking-progress" aria-label="Booking progress">
          {stepLabels.map((label, index) => (
            <li key={label} data-state={index === step ? "current" : index < step ? "done" : "todo"}>
              {label}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div>
            <h3 className="booking-section-title">Choose the service</h3>
            <label className="field-label" htmlFor="book-service">Service</label>
            <select
              id="book-service"
              className="field"
              value={service}
              onChange={(event) => setService(event.target.value)}
              aria-invalid={Boolean(fieldErrors.service) || undefined}
              aria-describedby={fieldErrors.service ? "book-service-error" : undefined}
            >
              {services.map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}, {item.durationMin} min, from {usd(item.priceFrom)}</option>
              ))}
            </select>
            {fieldErrors.service && <p className="field-error" id="book-service-error">{fieldErrors.service}</p>}
            {selectedService && (
              <div className="booking-soft">
                <p className="booking-summary">{selectedService.summary}</p>
                <p className="tiny">
                  {selectedService.durationMin} min, from {usd(selectedService.priceFrom)}, {selectedService.category}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="booking-section-title">Vehicle details</h3>
            <div className="field-group">
              <label className="field-label" htmlFor="book-vehicle">Vehicle</label>
              <input
                id="book-vehicle"
                className="field"
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
                placeholder="2018 Toyota RAV4"
                aria-invalid={Boolean(fieldErrors.vehicle) || undefined}
                aria-describedby={fieldErrors.vehicle ? "book-vehicle-error" : undefined}
              />
              {fieldErrors.vehicle && <p className="field-error" id="book-vehicle-error">{fieldErrors.vehicle}</p>}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="book-reg">Registration</label>
              <input
                id="book-reg"
                className="field data"
                value={registration}
                onChange={(event) => setRegistration(event.target.value)}
                placeholder="ABC 1234"
                aria-invalid={Boolean(fieldErrors.registration) || undefined}
                aria-describedby={fieldErrors.registration ? "book-reg-error" : undefined}
              />
              {fieldErrors.registration && <p className="field-error" id="book-reg-error">{fieldErrors.registration}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="booking-section-title">Pick a day and time</h3>
            <p className="booking-hint">Next 14 days. Closed Sundays.</p>
            <div
              className="row booking-days"
              role="group"
              aria-label="Choose a day"
              aria-describedby={fieldErrors.slot ? "book-slot-error" : undefined}
            >
              {days.map((date) => {
                const open = slots.filter((slot) => slot.date === date && slot.available).length;
                return (
                  <button
                    key={date}
                    type="button"
                    className="chip chip-slot"
                    aria-pressed={day === date}
                    disabled={open === 0}
                    onClick={() => { setDay(date); setTime(""); }}
                  >
                    {dateLabel(date)} <span className="data tiny">{open}</span>
                  </button>
                );
              })}
            </div>

            <p className="slot-day">Times on {dateLabel(day)}</p>
            <div
              className="slot-grid"
              role="group"
              aria-label="Available times"
              aria-describedby={fieldErrors.slot ? "book-slot-error" : undefined}
            >
              {daySlots.map((slot) => (
                <button
                  key={`${slot.date}-${slot.time}`}
                  type="button"
                  className="chip chip-slot"
                  aria-pressed={time === slot.time && day === slot.date}
                  disabled={!slot.available}
                  onClick={() => setTime(slot.time)}
                  title={slot.available ? `Bay ${slot.bay}` : "Booked"}
                >
                  <span className="data">{slot.time}</span>
                  {!slot.available && <span className="tiny">Booked</span>}
                </button>
              ))}
            </div>
            {fieldErrors.slot && <p className="field-error" id="book-slot-error">{fieldErrors.slot}</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="booking-section-title">Contact and consent</h3>
            <div className="field-group">
              <label className="field-label" htmlFor="book-name">Name</label>
              <input
                id="book-name"
                className="field"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name) || undefined}
                aria-describedby={fieldErrors.name ? "book-name-error" : undefined}
              />
              {fieldErrors.name && <p className="field-error" id="book-name-error">{fieldErrors.name}</p>}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="book-phone">Phone or WhatsApp</label>
              <input
                id="book-phone"
                className="field"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                aria-invalid={Boolean(fieldErrors.phone) || undefined}
                aria-describedby={fieldErrors.phone ? "book-phone-error" : undefined}
              />
              {fieldErrors.phone && <p className="field-error" id="book-phone-error">{fieldErrors.phone}</p>}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="book-notes">Notes (optional)</label>
              <textarea
                id="book-notes"
                className="field"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Reported noise, parts already fitted, anything we should check first"
                aria-invalid={Boolean(fieldErrors.notes) || undefined}
                aria-describedby={fieldErrors.notes ? "book-notes-error" : undefined}
              />
              {fieldErrors.notes && <p className="field-error" id="book-notes-error">{fieldErrors.notes}</p>}
            </div>
            <label className="checkbox-row booking-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                aria-invalid={Boolean(fieldErrors.consent) || undefined}
                aria-describedby={fieldErrors.consent ? "book-consent-error" : undefined}
              />
              <span>I agree that tyrespeed may use these details to confirm and manage this booking.</span>
            </label>
            {fieldErrors.consent && <p className="field-error" id="book-consent-error">{fieldErrors.consent}</p>}

            <div className="summary-list">
              <div className="status-item">
                <span className="muted">Service</span><span>{selectedService?.title}</span>
              </div>
              <div className="status-item">
                <span className="muted">Vehicle</span><span>{vehicle}, {registration}</span>
              </div>
              <div className="status-item">
                <span className="muted">Slot</span><span className="data">{day} {time}</span>
              </div>
            </div>
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="row booking-actions">
          {step > 0 && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setStep((current) => current - 1); setError(""); setFieldErrors({}); }}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
          )}
          {step < 3 ? (
            <button type="submit" className="btn btn-accent">
              Continue <ArrowRight size={14} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-accent" disabled={sending}>
              {sending ? "Saving…" : "Confirm booking"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
