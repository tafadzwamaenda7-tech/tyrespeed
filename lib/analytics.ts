/**
 * Privacy-friendly, first-party events. Disabled by default. No cookies,
 * no personal data, no external service. Only an event name, the path,
 * a random per-session id and a timestamp are sent.
 */

export type AnalyticsEventName =
  | "quote_open"
  | "quote_add"
  | "quote_submit"
  | "booking_start"
  | "booking_submit"
  | "call"
  | "whatsapp"
  | "palette_open";

const SESSION_KEY = "tyrespeed-analytics-session";

function sessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, generated);
    return generated;
  } catch {
    return "ephemeral";
  }
}

export function trackEvent(name: AnalyticsEventName): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
  if (typeof window === "undefined") return;

  const payload = {
    name,
    path: window.location.pathname,
    sessionId: sessionId(),
    timestamp: new Date().toISOString(),
  };

  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Measurement must never interrupt a task.
  }
}
