import { NextResponse } from "next/server";
import { bookedSlots } from "@/lib/booked-slots";
import { generateSlots } from "@/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("days");
  const parsed = raw === null ? 14 : Number(raw);
  const days = Number.isFinite(parsed)
    ? Math.min(Math.max(Math.trunc(parsed), 1), 30)
    : 14;

  return NextResponse.json({ days, slots: generateSlots(days, new Date(), await bookedSlots()) });
}
