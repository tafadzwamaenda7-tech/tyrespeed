import type { Slot } from "@/lib/types";

const weekdayTimes = ["08:30", "10:30", "11:30", "14:00", "15:30"];
const saturdayTimes = ["08:30", "10:30", "11:30"];

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type BookedSlot = { date: string; time: string };

function slotKey(date: string, time: string): string {
  return `${date}|${time}`;
}

/** Mark saved bookings as unavailable so the picker cannot offer a double booking. */
export function excludeBookedSlots(slots: Slot[], booked: BookedSlot[]): Slot[] {
  const used = new Set(
    booked
      .filter((slot) => /^\d{4}-\d{2}-\d{2}$/.test(slot.date) && /^\d{2}:\d{2}$/.test(slot.time))
      .map((slot) => slotKey(slot.date, slot.time)),
  );
  return slots.map((slot) =>
    used.has(slotKey(slot.date, slot.time)) ? { ...slot, available: false } : slot,
  );
}

export function generateSlots(
  days = 14,
  from: Date = new Date(),
  booked: BookedSlot[] = [],
): Slot[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const slots: Slot[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + offset);
    const weekday = day.getDay();
    if (weekday === 0) continue;

    const date = toIsoDate(day);
    const times = weekday === 6 ? saturdayTimes : weekdayTimes;

    let openCount = 0;
    const daySlots = times.map((time) => {
      const seed = hash(`${date}|${time}`);
      const available = seed % 10 > 2;
      if (available) openCount += 1;
      return { date, time, available, bay: ((seed >>> 8) % 4) + 1 };
    });

    if (openCount < 2) {
      for (let index = 0; index < daySlots.length && openCount < 2; index += 1) {
        if (!daySlots[index].available) {
          daySlots[index].available = true;
          openCount += 1;
        }
      }
    }

    slots.push(...daySlots);
  }

  return excludeBookedSlots(slots, booked);
}

export function availableSlots(slots: Slot[]): Slot[] {
  return slots.filter((slot) => slot.available);
}

export function slotsForDate(slots: Slot[], date: string): Slot[] {
  return slots.filter((slot) => slot.date === date);
}

export function nextSlots(slots: Slot[], count = 5): Slot[] {
  return availableSlots(slots).slice(0, count);
}

export function slotLabel(date: string, time: string, from: Date = new Date()): string {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const difference = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  const prefix =
    difference === 0
      ? "Today"
      : difference === 1
        ? "Tomorrow"
        : target.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return `${prefix} ${time}`;
}
