"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TyreSection } from "@/components/schematics/tyre-section";
import { vehicles } from "@/lib/inventory";

export function FitmentChecker() {
  const [vehicleId, setVehicleId] = useState("");
  const vehicle = useMemo(() => vehicles.find((item) => item.id === vehicleId), [vehicleId]);

  return (
    <section className="fitment-panel" aria-labelledby="fitment-heading">
      <div className="fitment-intro">
        <h2 id="fitment-heading">Fitment checker</h2>
        <p>Choose a vehicle to see indicative sizes. Confirm the size and rating against your own placard before booking.</p>
      </div>
      <div className="fitment-grid">
        <form className="fitment-fields" onSubmit={(event) => event.preventDefault()}>
          <label className="field-label" htmlFor="tyres-vehicle">Vehicle</label>
          <select
            id="tyres-vehicle"
            className="field"
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((item) => (
              <option key={item.id} value={item.id}>{item.label} ({item.years})</option>
            ))}
          </select>

          {vehicle ? (
            <div className="fitment-result" aria-live="polite">
              {vehicle.sizes.length > 0 ? (
                <>
                  <p className="fitment-result-title">Indicative sizes for {vehicle.label}</p>
                  <div className="row fitment-sizes">
                    {vehicle.sizes.map((item) => <span key={item} className="chip data">{item}</span>)}
                  </div>
                  <p className="small muted fitment-note">
                    These are starting points, not a fitment guarantee. The workshop checks load, speed rating and
                    clearance against your vehicle before fitting.
                  </p>
                  <Link href={`/tyres?vehicle=${vehicle.id}`} className="btn btn-accent fitment-action">
                    See indicative matches <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <p className="fitment-note">
                  We have no indicative sizes listed for {vehicle.label}. Call the workshop with the size from your
                  door placard and we will check what we can supply.
                </p>
              )}
            </div>
          ) : (
            <p className="fitment-hint">
              Sizes are listed with load and speed ratings in the catalogue below. Pick a make and model to narrow them
              here, then confirm the final choice by phone or WhatsApp.
            </p>
          )}
        </form>
        <div className="fitment-schematic">
          <TyreSection />
        </div>
      </div>
    </section>
  );
}
