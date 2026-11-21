import type { BookedSlot } from "@/lib/bookings";
import { readRecords, resolveDataFile } from "@/lib/persistence";

/** Server-only. Unreadable or malformed data simply yields no blocked slots. */
export async function bookedSlots(): Promise<BookedSlot[]> {
  try {
    const records = await readRecords<Record<string, unknown>>(
      resolveDataFile(process.env.BOOKING_DATA_FILE, "bookings.jsonl"),
    );

    return records.flatMap((record) => {
      const slot = record.slot;
      if (!slot || typeof slot !== "object") return [];
      const candidate = slot as { date?: unknown; time?: unknown };
      if (typeof candidate.date !== "string" || typeof candidate.time !== "string") return [];
      return [{ date: candidate.date, time: candidate.time }];
    });
  } catch {
    return [];
  }
}
