const defaultWindowMs = 10 * 60 * 1000;
const defaultMaxPerWindow = 5;
const stores = new Map<string, Map<string, number[]>>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return candidate.slice(0, 64);
}

export type RateLimitOptions = {
  namespace?: string;
  maxPerWindow?: number;
  windowMs?: number;
};

/** In-memory sliding window per IP and namespace. No PII is stored or logged. */
export function isRateLimited(request: Request, options: RateLimitOptions = {}): boolean {
  const namespace = options.namespace ?? "intake";
  const windowMs = options.windowMs ?? defaultWindowMs;
  const maxPerWindow = options.maxPerWindow ?? defaultMaxPerWindow;
  const store = stores.get(namespace) ?? new Map<string, number[]>();
  stores.set(namespace, store);

  const key = clientKey(request);
  const now = Date.now();

  if (store.size > 500) {
    for (const [storedKey, timestamps] of store) {
      if (timestamps.every((time) => now - time >= windowMs)) store.delete(storedKey);
    }
  }

  const recent = (store.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= maxPerWindow) {
    store.set(key, recent);
    return true;
  }

  recent.push(now);
  store.set(key, recent);
  return false;
}
