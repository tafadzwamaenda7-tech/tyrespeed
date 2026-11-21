"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tyreSizes, vehicles } from "@/lib/inventory";

export function FitmentBar() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState("");
  const [size, setSize] = useState("");

  function findTyres(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (size) router.push(`/tyres?size=${encodeURIComponent(size)}`);
    else if (vehicle) router.push(`/tyres?vehicle=${encodeURIComponent(vehicle)}`);
    else router.push("/tyres");
  }

  return (
    <form className="fitment-bar" onSubmit={findTyres} aria-label="Find tyres by fitment">
      <div>
        <label className="field-label" htmlFor="home-vehicle">Vehicle</label>
        <select
          id="home-vehicle"
          className="field"
          value={vehicle}
          onChange={(event) => setVehicle(event.target.value)}
        >
          <option value="">Any vehicle</option>
          {vehicles.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="home-size">Size</label>
        <select
          id="home-size"
          className="field"
          value={size}
          onChange={(event) => setSize(event.target.value)}
        >
          <option value="">Any size</option>
          {tyreSizes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-accent">Find tyres</button>
    </form>
  );
}
