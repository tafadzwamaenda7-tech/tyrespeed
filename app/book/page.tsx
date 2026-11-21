import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { bookedSlots } from "@/lib/booked-slots";
import { generateSlots } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a slot",
  description: "Choose a service, vehicle and time from the next 14 days of workshop availability.",
  alternates: { canonical: "/book" },
};

type Params = {
  searchParams: Promise<{ service?: string; vehicle?: string; day?: string; slot?: string }>;
};

export default async function BookPage({ searchParams }: Params) {
  const params = await searchParams;
  const slots = generateSlots(14, new Date(), await bookedSlots());

  return (
    <div className="wrap page book-page">
      <header className="page-head page-head--compact">
        <h1>Book a slot</h1>
        <p className="lede">
          Choose the job, tell us the vehicle and pick a time from the next 14 days of workshop availability.
        </p>
      </header>
      <BookingForm
        slots={slots}
        initialService={params.service ?? ""}
        initialVehicle={params.vehicle ?? ""}
        initialDay={params.day ?? ""}
        initialSlot={params.slot ?? ""}
      />
    </div>
  );
}
