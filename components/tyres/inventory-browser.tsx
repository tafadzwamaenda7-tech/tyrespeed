"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import {
  indicativeNotice,
  inventory,
  tyreBrands,
  tyreSizes,
  vehicleTypes,
  vehicles,
} from "@/lib/inventory";
import type { TyreSku } from "@/lib/types";

type View = "grid" | "list";

export function InventoryBrowser({
  initialSize = "",
  initialVehicle = "",
  initialType = "",
  initialBrand = "",
  showFilters = true,
}: {
  initialSize?: string;
  initialVehicle?: string;
  initialType?: string;
  initialBrand?: string;
  showFilters?: boolean;
}) {
  const { addToQuote } = useApp();
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(initialSize);
  const [vehicleType, setVehicleType] = useState(initialType);
  const [brand, setBrand] = useState(initialBrand);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [view, setView] = useState<View>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters = [query, size, vehicleType, brand, vehicle].filter(Boolean).length;
  const activeFilterDescription = [
    query && `search "${query.trim()}"`,
    size && `size ${size}`,
    vehicleType && `type ${vehicleType}`,
    brand && `brand ${brand}`,
    vehicle && `vehicle ${vehicles.find((item) => item.id === vehicle)?.label ?? vehicle}`,
  ]
    .filter(Boolean)
    .join(", ");

  const vehicleSizes = useMemo(
    () => vehicles.find((item) => item.id === vehicle)?.sizes ?? [],
    [vehicle],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inventory.filter((item: TyreSku) => {
      if (needle && !`${item.sku} ${item.size} ${item.pattern} ${item.brand} ${item.fits}`.toLowerCase().includes(needle)) return false;
      if (size && item.size !== size) return false;
      if (vehicleType && item.vehicleType !== vehicleType) return false;
      if (brand && item.brand !== brand) return false;
      if (vehicleSizes.length && !vehicleSizes.includes(item.size)) return false;
      return true;
    });
  }, [query, size, vehicleType, brand, vehicleSizes]);

  function stockInfo(): { text: string; level: "check" } {
    return { text: "Confirm with workshop", level: "check" };
  }

  function addItem(item: TyreSku) {
    addToQuote({
      key: `tyre:${item.sku}`,
      kind: "tyre",
      ref: item.sku,
      label: `${item.size} ${item.loadSpeed}, ${item.brand} ${item.pattern}`,
      meta: `Fitted and balanced in about ${item.minutes} min`,
      price: item.price,
      minutes: item.minutes,
    });
  }

  function clearFilters() {
    setQuery("");
    setSize("");
    setVehicleType("");
    setBrand("");
    setVehicle("");
  }

  const sizeHref = (item: TyreSku) => `/tyres?size=${encodeURIComponent(item.size)}`;

  return (
    <div className="catalogue">
      {showFilters && (
        <aside className="filter-rail" data-open={filtersOpen} aria-label="Tyre filters">
          <div className="filter-rail-head">
            <h3>Filter stock</h3>
            <button type="button" className="text-action" onClick={clearFilters}>Clear all</button>
          </div>
          <div className="filter-summary">
            <span>
              {activeFilters === 0
                ? "No filters set"
                : `${activeFilters} ${activeFilters === 1 ? "filter" : "filters"} set`}
            </span>
            <button
              type="button"
              className="text-action"
              aria-expanded={filtersOpen}
              aria-controls="inventory-filter-fields"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? "Hide filters" : "Edit filters"}
            </button>
          </div>
          <div className="filter-fields" id="inventory-filter-fields">
            <div>
              <label className="field-label" htmlFor="inventory-search">Search</label>
              <input
                id="inventory-search"
                className="field"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SKU, size, pattern"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="inventory-vehicle">Vehicle</label>
              <select id="inventory-vehicle" className="field" value={vehicle} onChange={(event) => setVehicle(event.target.value)}>
                <option value="">All vehicles</option>
                {vehicles.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="inventory-size">Size</label>
              <select id="inventory-size" className="field" value={size} onChange={(event) => setSize(event.target.value)}>
                <option value="">All sizes</option>
                {tyreSizes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="inventory-type">Type</label>
              <select id="inventory-type" className="field" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
                <option value="">All types</option>
                {vehicleTypes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="inventory-brand">Brand</label>
              <select id="inventory-brand" className="field" value={brand} onChange={(event) => setBrand(event.target.value)}>
                <option value="">All brands</option>
                {tyreBrands.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </aside>
      )}

      <div className="catalogue-results">
        <div className="catalogue-toolbar">
          <span className="count" aria-live="polite">{rows.length} {rows.length === 1 ? "entry" : "entries"} shown</span>
          <div className="view-switch" role="group" aria-label="Inventory view">
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="catalogue-empty">
            <p>
              No catalogue entries match {activeFilterDescription}. Availability and fitment are indicative, so the
              workshop can suggest alternatives when you call or send the quote.
            </p>
            <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : view === "grid" ? (
          <div className="tyre-card-grid">
            {rows.map((item) => {
              const stock = stockInfo();
              return (
                <article className="tyre-card" key={item.sku}>
                  <Link className="tyre-card-media" href={sizeHref(item)} aria-label={`See ${item.size} tyres in the inventory`}>
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1020px) 50vw, 25vw"
                    />
                  </Link>
                  <div className="tyre-card-body">
                    <h3 className="tyre-card-size">
                      <Link href={sizeHref(item)}>{item.size}</Link>
                    </h3>
                    <p className="tyre-card-name">{item.brand} {item.pattern}</p>
                    <p className="tyre-card-fits">Suggested for {item.fits}</p>
                    <p className="tyre-card-rating">Load and speed index {item.loadSpeed}</p>
                    <p className="tyre-card-stock" data-level={stock.level}>{stock.text}</p>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => addItem(item)}
                    >
                      Add to quote
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Tyre</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Size</th>
                  <th scope="col">Pattern</th>
                  <th scope="col">Suggested for</th>
                  <th scope="col">Availability</th>
                  <th scope="col"><span className="sr-only">Add to quote</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const stock = stockInfo();
                  return (
                    <tr key={item.sku}>
                      <td data-label="Tyre" className="thumb-cell">
                        <Image
                          className="tyre-thumb"
                          src={item.image}
                          alt={item.imageAlt}
                          width={64}
                          height={48}
                          sizes="64px"
                        />
                      </td>
                      <td data-label="SKU"><span className="cell-title">{item.sku}</span></td>
                      <td data-label="Size"><span className="cell-title">{item.size}</span><span className="cell-sub">{item.loadSpeed}</span></td>
                      <td data-label="Pattern"><span>{item.brand}</span><span className="cell-sub">{item.pattern}</span></td>
                      <td data-label="Suggested for" className="muted">{item.fits}</td>
                      <td data-label="Availability"><span className="stock" data-level={stock.level}>{stock.text}</span></td>
                      <td data-label="">
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => addItem(item)}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="catalogue-note">{indicativeNotice}</p>
      </div>
    </div>
  );
}
