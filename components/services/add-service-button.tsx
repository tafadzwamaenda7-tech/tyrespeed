"use client";

import { useApp } from "@/components/providers/app-provider";
import type { Service } from "@/lib/types";

export function AddServiceButton({ service }: { service: Pick<Service, "slug" | "title" | "durationMin" | "priceFrom"> }) {
  const { addToQuote } = useApp();

  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={() => addToQuote({
        key: `service:${service.slug}`,
        kind: "service",
        ref: service.slug,
        label: service.title,
        meta: `${service.durationMin} min at the workshop`,
        price: service.priceFrom,
        minutes: service.durationMin,
      })}
    >
      Add to quote
    </button>
  );
}
