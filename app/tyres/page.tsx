import type { Metadata } from "next";
import Link from "next/link";
import { FitmentChecker } from "@/components/tyres/fitment-checker";
import { InventoryBrowser } from "@/components/tyres/inventory-browser";
import { QuoteReviewButton } from "@/components/utilities/quote-review-button";

export const metadata: Metadata = {
  title: "Tyre inventory",
  description:
    "Browse indicative tyre sizes, vehicles, types and brands. The workshop confirms stock, fitment and final prices.",
  alternates: { canonical: "/tyres" },
};

type Params = { searchParams: Promise<{ size?: string; vehicle?: string; type?: string; brand?: string }> };

export default async function TyresPage({ searchParams }: Params) {
  const params = await searchParams;
  const size = params.size ?? "";
  const type = params.type ?? "";

  return (
    <div className="wrap page tyres-page">
      <header className="page-head page-head--catalogue">
        <h1>Tyre catalogue</h1>
        <div className="page-head-aside">
          <p className="lede">
            Search by size, vehicle or pattern. Sizes and fitment suggestions are indicative, and the workshop
            confirms stock, fitment and the final cost before work starts.
          </p>
          <div className="page-head-actions">
            <QuoteReviewButton large />
            <Link href="/book" className="btn btn-accent btn-lg">Book a fitting</Link>
          </div>
        </div>
      </header>

      <FitmentChecker />

      <section className="section-block" aria-labelledby="tyre-catalogue-heading">
        <h2 id="tyre-catalogue-heading" className="section-title">Tyre catalogue</h2>
        <InventoryBrowser
          key={`${size}-${params.vehicle ?? ""}-${type}-${params.brand ?? ""}`}
          initialSize={size}
          initialVehicle={params.vehicle ?? ""}
          initialType={type}
          initialBrand={params.brand ?? ""}
        />
      </section>
    </div>
  );
}
