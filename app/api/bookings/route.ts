import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { notifySubmission } from "@/lib/notify";
import { appendRecord, resolveDataFile } from "@/lib/persistence";
import { isRateLimited } from "@/lib/rate-limit";
import { getService, serviceOptions } from "@/lib/services";
import { whatsappLink } from "@/lib/site";

export const runtime = "nodejs";

const allowedServices = new Set(serviceOptions.map((option) => option.value));

const bookingSchema = z.object({
  service: z.string().trim().refine((value) => allowedServices.has(value), "Choose a listed service."),
  vehicle: z.string().trim().min(2).max(80),
  registration: z.string().trim().min(2).max(24),
  slot: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Use a 24-hour time."),
  }),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(24).regex(/^[+\d][\d\s()-]{6,19}$/),
  notes: z.string().trim().max(1200),
  consent: z.literal(true),
});

type BookingRecord = z.infer<typeof bookingSchema> & {
  reference: string;
  createdAt: string;
};

export async function POST(request: Request) {
  if (isRateLimited(request, { namespace: "bookings" })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Wait a few minutes or call the workshop." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send valid booking details." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Check the booking details and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const record: BookingRecord = {
    ...parsed.data,
    reference: `TS-B${randomUUID().slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    await appendRecord(
      resolveDataFile(process.env.BOOKING_DATA_FILE, "bookings.jsonl"),
      record,
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save the booking. Call the workshop." },
      { status: 500 },
    );
  }

  const serviceTitle = getService(record.service)?.title ?? "Workshop service";
  const { notified } = await notifySubmission({
    kind: "booking",
    reference: record.reference,
    receivedAt: record.createdAt,
    summary: `Service: ${serviceTitle}. Slot: ${record.slot.date} ${record.slot.time}.`,
  });

  return NextResponse.json(
    {
      ok: true,
      reference: record.reference,
      notified,
      whatsappHref: whatsappLink(
        `Hello tyrespeed, I am following up on booking ${record.reference} for ${serviceTitle} on ${record.slot.date} at ${record.slot.time}.`,
      ),
    },
    { status: 201 },
  );
}
