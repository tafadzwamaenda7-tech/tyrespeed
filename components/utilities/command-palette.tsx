"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { faqs } from "@/lib/faqs";
import { inventory, vehicles } from "@/lib/inventory";
import { services } from "@/lib/services";
import { trackEvent } from "@/lib/analytics";
import { usd } from "@/lib/format";
import { useFocusTrap } from "./use-focus-trap";

type PaletteItem = {
  id: string;
  group: string;
  label: string;
  meta: string;
  keywords: string;
  action: () => void;
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useFocusTrap(open, dialogRef, onClose);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    } else {
      trackEvent("palette_open");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo<PaletteItem[]>(() => {
    const goTo: PaletteItem[] = [
      { id: "home", group: "Go to", label: "Home", meta: "/", keywords: "home find tyres", action: () => router.push("/") },
      { id: "inventory", group: "Go to", label: "Full tyre inventory", meta: "/tyres", keywords: "tyres stock sizes sku", action: () => router.push("/tyres") },
      { id: "services", group: "Go to", label: "Service list", meta: "/services", keywords: "services work prices", action: () => router.push("/services") },
      { id: "workshop", group: "Go to", label: "Workshop details", meta: "/workshop", keywords: "workshop address hours equipment", action: () => router.push("/workshop") },
      { id: "book", group: "Go to", label: "Book a slot", meta: "/book", keywords: "booking slot appointment time", action: () => router.push("/book") },
      { id: "faq", group: "Go to", label: "Frequently asked questions", meta: "/faq", keywords: "faq questions help", action: () => router.push("/faq") },
    ];

    const serviceItems: PaletteItem[] = services.map((service) => ({
      id: `service-${service.slug}`,
      group: "Services",
      label: service.title,
      meta: `${service.durationMin} min, ${usd(service.priceFrom)}`,
      keywords: `${service.title} ${service.symptom} ${service.category}`,
      action: () => router.push(`/services/${service.slug}`),
    }));

    const tyreItems: PaletteItem[] = inventory.map((tyre) => ({
      id: `tyre-${tyre.sku}`,
      group: "Tyres",
      label: `${tyre.size} ${tyre.loadSpeed}, ${tyre.brand} ${tyre.pattern}`,
      meta: `${tyre.sku}, ${usd(tyre.price)}`,
      keywords: `${tyre.size} ${tyre.sku} ${tyre.brand} ${tyre.pattern} ${tyre.vehicleType}`,
      action: () => router.push(`/tyres?size=${encodeURIComponent(tyre.size)}`),
    }));

    const vehicleItems: PaletteItem[] = vehicles.map((vehicle) => ({
      id: `vehicle-${vehicle.id}`,
      group: "Vehicles",
      label: vehicle.label,
      meta: vehicle.sizes.join(", "),
      keywords: `${vehicle.label} ${vehicle.years} ${vehicle.sizes.join(" ")} fitment`,
      action: () => router.push(`/tyres?vehicle=${vehicle.id}`),
    }));

    const faqItems: PaletteItem[] = faqs.map((faq, index) => ({
      id: `faq-${index}`,
      group: "FAQ",
      label: faq.question,
      meta: faq.category,
      keywords: `${faq.question} ${faq.answer} ${faq.category}`,
      action: () => router.push(`/faq?q=${encodeURIComponent(faq.question)}`),
    }));

    return [...goTo, ...serviceItems, ...tyreItems, ...vehicleItems, ...faqItems];
  }, [router]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items.slice(0, 12);
    return items
      .filter((item) => item.keywords.toLowerCase().includes(needle))
      .slice(0, 20);
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function runItem(item: PaletteItem) {
    item.action();
    onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (filtered.length ? (index + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (filtered.length ? (index - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[active];
      if (item) runItem(item);
    }
  }

  let lastGroup = "";

  return (
    <div
      className={`palette-wrap${open ? " is-open" : ""}`}
      aria-hidden={!open}
      onMouseDown={open ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search tyrespeed"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="palette-input-row">
          <Search size={18} aria-hidden="true" className="muted" />
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search size, service or SKU"
            aria-label="Search size, service or SKU"
            aria-controls="palette-results"
            autoComplete="off"
          />
          <kbd>esc</kbd>
        </div>

        <div id="palette-results" className="palette-list" role="listbox" aria-label="Search results">
          {filtered.length === 0 && (
            <p className="modal-soft">No match for “{query}”. Try a size like 205/55 R16 or a service name.</p>
          )}
          {filtered.map((item, index) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {showGroup && <div className="palette-group">{item.group}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  data-active={index === active}
                  className="palette-item"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => runItem(item)}
                >
                  <span className="palette-item-label">{item.label}</span>
                  <span className="palette-item-meta">{item.meta}</span>
                  <ArrowRight size={13} className="muted" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="palette-foot">
          <span><kbd>↑</kbd> <kbd>↓</kbd> move</span>
          <span><CornerDownLeft size={11} aria-hidden="true" /> open</span>
          <span><kbd>esc</kbd> close</span>
          <span className="palette-count">{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
