"use client";

import { useEffect, useState } from "react";
import { outletStatus } from "@/lib/site";

export function OutletStatus() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus(outletStatus());
  }, []);

  return (
    <span className="data outlet-status" aria-live="polite">
      {status}
    </span>
  );
}
