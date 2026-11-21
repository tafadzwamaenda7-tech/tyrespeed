import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { usd } from "@/lib/format";
import { notifySubmission } from "@/lib/notify";
import { appendRecord, resolveDataFile } from "@/lib/persistence";
import { isRateLimited } from "@/lib/rate-limit";
import { whatsappLink } from "@/lib/site";

export const runtime = "nodejs";

const itemSchema = z.object({
  ref: z.string().trim().min(1).max(60),
  kind: z.enum(["tyre", "service"]),
  label: z.string().trim().min(1).max(160),
  qty: z.number().int().min(1).max(20),
  price: z.number().finite().min(0).max(100000),
});

const enquirySchema = z.object({
  items: z.array(itemSchema).min(1).max(30),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(24).regex(/^[+\d][\d\s()-]{6,19}$/),
  vehicle: z.string().trim().max(80),
  notes: z.string().trim().max(1200),
  consent: z.literal(true),
});

type QuoteRecord = z.infer<typeof enquirySchema> & {
  reference: string;
  createdAt: string;
};

export async function POST(request: Request) {
  if (isRateLimited(request, { namespace: "enquiries" })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Wait a few minutes or call the workshop." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send valid quote details." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Check the quote details and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const record: QuoteRecord = {
    ...parsed.data,
    reference: `TS-Q${randomUUID().slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    await appendRecord(
      resolveDataFile(process.env.QUOTE_DATA_FILE, "quotes.jsonl"),
      record,
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save the quote. Call or WhatsApp the workshop." },
      { status: 500 },
    );
  }

  const indicativeTotal = record.items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const { notified } = await notifySubmission({
    kind: "quote",
    reference: record.reference,
    receivedAt: record.createdAt,
    summary: `${record.items.length} ${record.items.length === 1 ? "line" : "lines"}, indicative total ${usd(indicativeTotal)}.`,
  });

  return NextResponse.json(
    {
      ok: true,
      reference: record.reference,
      notified,
      whatsappHref: whatsappLink(
        `Hello tyrespeed, I am following up on quote ${record.reference} (${record.items.length} ${record.items.length === 1 ? "line" : "lines"}). Please confirm stock and the final price.`,
      ),
    },
    { status: 201 },
  );
}
