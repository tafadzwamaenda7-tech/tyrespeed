import Link from "next/link";
import { nextSlots, slotLabel } from "@/lib/bookings";
import type { Slot } from "@/lib/types";

export function AvailabilityRow({ slots }: { slots: Slot[] }) {
  const upcoming = nextSlots(slots, 5);

  return (
    <section className="slots-strip" aria-labelledby="next-slots-heading">
      <p id="next-slots-heading" className="slots-label">Upcoming workshop times</p>
      <div className="slots-strip-items">
        {upcoming.map((slot) => (
          <Link
            key={`${slot.date}-${slot.time}`}
            className="chip chip-slot"
            href={`/book?slot=${slot.date}%7C${slot.time}`}
          >
            {slotLabel(slot.date, slot.time)} bay {slot.bay}
          </Link>
        ))}
        <Link href="/book" className="text-link slots-link">See the full schedule</Link>
      </div>
    </section>
  );
}
