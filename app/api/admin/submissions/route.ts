import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { readRecords, resolveDataFile } from "@/lib/persistence";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenMatches(supplied: string, expected: string): boolean {
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function providedToken(request: Request): string {
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  return (bearer ?? request.headers.get("x-admin-token") ?? "").trim();
}

export async function GET(request: Request) {
  const configured = process.env.ADMIN_TOKEN;
  if (!configured) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  if (isRateLimited(request, { namespace: "admin", maxPerWindow: 30 })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Wait a few minutes." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  if (!tokenMatches(providedToken(request), configured)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "all";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const parsedLimit = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(Math.trunc(parsedLimit), 1), 200)
    : 50;

  const [allBookings, allQuotes] = await Promise.all([
    readRecords<Record<string, unknown>>(resolveDataFile(process.env.BOOKING_DATA_FILE, "bookings.jsonl")),
    readRecords<Record<string, unknown>>(resolveDataFile(process.env.QUOTE_DATA_FILE, "quotes.jsonl")),
  ]);

  const withinRange = (record: Record<string, unknown>): boolean => {
    const created = typeof record.createdAt === "string" ? record.createdAt.slice(0, 10) : "";
    if (from && created < from) return false;
    if (to && created > to) return false;
    return true;
  };

  const bookings = type === "quote"
    ? []
    : allBookings.filter(withinRange).slice(-limit).reverse();
  const quotes = type === "booking"
    ? []
    : allQuotes.filter(withinRange).slice(-limit).reverse();

  return NextResponse.json({
    ok: true,
    filters: { type, from, to, limit },
    total: bookings.length + quotes.length,
    bookings,
    quotes,
  });
}
