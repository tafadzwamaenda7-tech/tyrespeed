"use client";

import { useMemo, useState } from "react";
import { faqs } from "@/lib/faqs";

const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

export function FaqList({
  initialQuery = "",
  showControls = true,
}: {
  initialQuery?: string;
  showControls?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      if (category !== "All" && faq.category !== category) return false;
      if (!needle) return true;
      return `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(needle);
    });
  }, [query, category]);

  return (
    <div className="faq-list">
      {showControls && (
        <>
          <div className="filter-bar">
            <label className="field-label" htmlFor="faq-search">Search questions</label>
            <input
              id="faq-search"
              className="field grow"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions and answers"
            />
            <span className="count" aria-live="polite">{rows.length} of {faqs.length} entries</span>
          </div>
          <div className="filter-bar category-filter" role="group" aria-label="Filter questions by category">
            {categories.map((item) => (
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
        </>
      )}

      {rows.length === 0 && (
        <p className="faq-empty">No FAQ matches that search. Try a size, a time or a service name.</p>
      )}
      {rows.map((faq) => {
        const index = faqs.indexOf(faq);
        const open = openIndex === index;
        return (
          <div className="faq-row" key={faq.question} data-reveal>
            <button
              type="button"
              className="faq-question"
              aria-expanded={open}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="faq-meta">
                <span className="faq-category">{faq.category}</span>
                <span className="faq-toggle" aria-hidden="true">{open ? "-" : "+"}</span>
              </span>
            </button>
            {open && (
              <p className="faq-answer" id={`faq-answer-${index}`}>{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
