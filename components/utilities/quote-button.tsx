"use client";

import { useApp } from "@/components/providers/app-provider";

export function QuoteButton({
  className = "btn btn-outline",
  children = "Get a quote",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openDrawer, quoteCount } = useApp();

  return (
    <button type="button" className={className} onClick={openDrawer} aria-label={`Get a quote, ${quoteCount} items`}>
      {children}
    </button>
  );
}
