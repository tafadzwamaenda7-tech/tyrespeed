"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Delegated tracking for call and WhatsApp links anywhere in the document. */
export function AnalyticsClicks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("call");
      else if (href.startsWith("https://wa.me/")) trackEvent("whatsapp");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
