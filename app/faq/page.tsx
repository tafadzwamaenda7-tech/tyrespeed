import type { Metadata } from "next";
import { FaqList } from "@/components/faq/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Short answers on fitting times, balancing, alignment, punctures, booking and quotes.",
  alternates: { canonical: "/faq" },
};

type Params = { searchParams: Promise<{ q?: string }> };

export default async function FaqPage({ searchParams }: Params) {
  const params = await searchParams;

  return (
    <div className="wrap page faq-page">
      <header className="page-head page-head--compact">
        <h1>Frequently asked questions</h1>
        <p className="lede">
          The questions we hear most at the counter, with direct answers on times, measurements, bookings and quotes.
        </p>
      </header>
      <FaqList initialQuery={params.q ?? ""} />
    </div>
  );
}
