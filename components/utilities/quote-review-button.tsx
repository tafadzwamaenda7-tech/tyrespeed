"use client";

import { useApp } from "@/components/providers/app-provider";

export function QuoteReviewButton({ large = false }: { large?: boolean }) {
  const { openDrawer, quoteCount } = useApp();
  const label = quoteCount === 1 ? "1 item" : `${quoteCount} items`;

  return (
    <button
      type="button"
      className={`btn btn-outline quote-review${large ? " btn-lg" : ""}`}
      onClick={openDrawer}
      aria-label={`Review quote, ${label}`}
    >
      Review quote <span className="data">{quoteCount}</span>
    </button>
  );
}
