"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import { serviceCategories, services } from "@/lib/services";

export function ServiceTable({ initialCategory = "All" }: { initialCategory?: string }) {
  const { addToQuote } = useApp();
  const [category, setCategory] = useState(initialCategory);

  const rows = useMemo(
    () =>
      services.filter(
        (service) => category === "All" || service.category === category,
      ),
    [category],
  );

  return (
    <div className="service-index">
      <div className="filter-bar" role="group" aria-label="Filter services by category">
        {serviceCategories.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="service-index-grid">
        {rows.map((service) => (
          <li key={service.slug} data-reveal>
            <article className="service-index-card">
              <div className="service-index-card-top">
                <span className="service-index-category">{service.category}</span>
                <h3 className="service-index-title">
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </h3>
                <p className="service-index-symptom">{service.symptom}</p>
              </div>
              <div className="service-index-card-foot">
                <span className="service-index-time">{service.durationMin} min</span>
                <button
                  type="button"
                  className="btn btn-outline"
                  aria-label={`Add to quote: ${service.title}`}
                  onClick={() => addToQuote({
                    key: `service:${service.slug}`,
                    kind: "service",
                    ref: service.slug,
                    label: service.title,
                    meta: `${service.durationMin} min at the workshop`,
                    price: service.priceFrom,
                    minutes: service.durationMin,
                  })}
                >
                  Add to quote
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="panel-foot row-between">
        <span className="count" aria-live="polite">{rows.length} {rows.length === 1 ? "service" : "services"} shown</span>
        <span className="tiny">Times are per wheel unless the service record says otherwise.</span>
      </div>
    </div>
  );
}
