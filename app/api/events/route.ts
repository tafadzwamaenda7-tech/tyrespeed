import { NextResponse } from "next/server";
import { z } from "zod";
import { appendRecord, resolveDataFile } from "@/lib/persistence";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const eventSchema = z.object({
  name: z.enum([
    "quote_open",
    "quote_add",
    "quote_submit",
    "booking_start",
    "booking_submit",
    "call",
    "whatsapp",
    "palette_open",
  ]),
  path: z.string().regex(/^\/[^\s]{0,199}$/, "Use a local path."),
  sessionId: z.string().regex(/^[A-Za-z0-9-]{1,80}$/, "Invalid session."),
  timestamp: z.string().datetime(),
});

type EventRecord = z.infer<typeof eventSchema> & { receivedAt: string };

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  if (isRateLimited(request, { namespace: "events", maxPerWindow: 60 })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send a valid event." }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Send a valid event." }, { status: 400 });
  }

  const record: EventRecord = { ...parsed.data, receivedAt: new Date().toISOString() };

  try {
    await appendRecord(
      resolveDataFile(process.env.EVENT_DATA_FILE, "events.jsonl"),
      record,
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Event could not be stored." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
