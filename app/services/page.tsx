import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlignmentDiagram } from "@/components/schematics/alignment-diagram";
import { ServiceTable } from "@/components/services/service-table";
import { usd } from "@/lib/format";
import { serviceCategories, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Service records with the symptom, procedure, measured checks, workshop time and starting price.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const categories = serviceCategories.filter((category) => category !== "All");
  const durations = services.map((service) => service.durationMin);
  const prices = services.map((service) => service.priceFrom);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="wrap page">
      <header className="page-head page-head--editorial">
        <h1>Workshop services</h1>
        <div className="page-head-aside">
          <p className="lede">
            Every job is written up with the symptom, the steps we follow and the readings we took before you collect
            the vehicle.
          </p>
          <Link href="/book" className="btn btn-accent btn-lg">Book a service</Link>
        </div>
      </header>

      <div className="editorial-split">
        <div className="editorial-photo">
          <Image
            src="/images/workshop-fitting.jpg"
            alt="Workshop technician fitting a tyre onto a vehicle wheel"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="editorial-copy">
          <h2>How a job is recorded</h2>
          <p>
            Each service lists the steps we follow and the measurements that go on the job card. Times are workshop
            time per wheel unless the record says otherwise. Parts are listed separately on the invoice.
          </p>
          <div className="fact-rows">
            <div className="fact-row">
              <span>Records in the workshop</span>
              <span className="fact-value data">{services.length}</span>
            </div>
            {categories.map((category) => {
              const count = services.filter((service) => service.category === category).length;
              return (
                <div className="fact-row" key={category}>
                  <span>{category}</span>
                  <span className="fact-value data">{count} {count === 1 ? "service" : "services"}</span>
                </div>
              );
            })}
            <div className="fact-row">
              <span>Workshop time</span>
              <span className="fact-value data">{minDuration} to {maxDuration} min</span>
            </div>
            <div className="fact-row">
              <span>Indicative starting prices</span>
              <span className="fact-value data">{usd(minPrice)} to {usd(maxPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <figure className="editorial-figure">
        <AlignmentDiagram />
      </figure>

      <section className="section-block" aria-labelledby="services-table-heading">
        <h2 id="services-table-heading" className="section-title">Service index</h2>
        <ServiceTable />
      </section>
    </div>
  );
}
