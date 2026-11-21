"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import { usd } from "@/lib/format";
import { inventory } from "@/lib/inventory";

const featuredSkus = [
  "MI-20555R16-ES2",
  "DU-22565R17-SP4",
  "HA-22550R17-VN1",
  "DU-23565R16C-SP9",
];

export function FeaturedTyres() {
  const { addToQuote } = useApp();

  return (
    <div className="tyre-rail">
      {featuredSkus.map((sku) => {
        const item = inventory.find((entry) => entry.sku === sku);
        if (!item) return null;

        const href = `/tyres?size=${encodeURIComponent(item.size)}`;

        return (
          <article className="tyre-card" key={item.sku} data-reveal>
            <Link className="tyre-card-media" href={href} aria-label={`See ${item.size} tyres in the inventory`}>
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1020px) 50vw, 25vw"
              />
            </Link>
            <div className="tyre-card-body">
              <h3 className="tyre-card-size">
                <Link href={href}>{item.size}</Link>
              </h3>
              <p className="tyre-card-name">{item.brand} {item.pattern}</p>
              <p className="tyre-card-fits">Suggested for {item.fits}</p>
              <p className="tyre-card-stock" data-level="check">Confirm with workshop</p>
              <p className="tyre-card-price">
                {usd(item.price)} <span className="tiny muted">indicative</span>
              </p>
              <button
                type="button"
                className="btn btn-outline"
                aria-label={`Add to quote: ${item.brand} ${item.size}`}
                onClick={() => addToQuote({
                  key: `tyre:${item.sku}`,
                  kind: "tyre",
                  ref: item.sku,
                  label: `${item.size} ${item.loadSpeed}, ${item.brand} ${item.pattern}`,
                  meta: `Fitted and balanced in about ${item.minutes} min`,
                  price: item.price,
                  minutes: item.minutes,
                })}
              >
                Add to quote
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
