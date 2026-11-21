"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import { usd } from "@/lib/format";
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
    <div>
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

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Symptom it fixes</th>
              <th scope="col" className="num">Time</th>
              <th scope="col" className="num">Indicative from</th>
              <th scope="col"><span className="sr-only">Add to quote</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((service) => (
              <tr key={service.slug} data-reveal>
                <td data-label="Service">
                  <Link href={`/services/${service.slug}`} className="cell-title cell-link">
                    {service.title}
                  </Link>
                  <span className="cell-sub">{service.category}</span>
                </td>
                <td data-label="Symptom" className="muted">{service.symptom}</td>
                <td data-label="Time" className="num">{service.durationMin} min</td>
                <td data-label="From" className="num">{usd(service.priceFrom)}</td>
                <td data-label="">
                  <button
                    type="button"
                    className="btn btn-outline"
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
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel-foot row-between">
        <span className="count" aria-live="polite">{rows.length} {rows.length === 1 ? "service" : "services"} shown</span>
        <span className="tiny">Times are per wheel unless the service record says otherwise. Prices are indicative and confirmed by the workshop.</span>
      </div>
    </div>
  );
}
