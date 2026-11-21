import type { Job } from "@/lib/types";

export const jobs: Job[] = [
  {
    reference: "TS-2418",
    vehicle: "2018 Toyota RAV4, 225/65 R17",
    reportedIssue: "Pulling left after a pothole on Borrowdale Road.",
    workCarriedOut:
      "Measured camber, caster and toe at all four corners. Adjusted front toe to the Toyota spec and road-tested 12 km.",
    partsUsed: ["Front toe shim ×2", "Valve core ×4"],
    total: 68,
    turnaround: "1 hr 20 min",
    date: "2026-11-14",
  },
  {
    reference: "TS-2417",
    vehicle: "2015 Ford Ranger, 265/65 R17",
    reportedIssue: "Steering shake above 90 km/h with a loaded canopy.",
    workCarriedOut:
      "Removed old weights, rebalanced all four wheels on the calibrated machine and torqued bolts to 120 Nm.",
    partsUsed: ["Adhesive weights ×8", "Valve stems ×4"],
    total: 96,
    turnaround: "1 hr 05 min",
    date: "2026-11-13",
  },
  {
    reference: "TS-2416",
    vehicle: "2019 Honda Fit, 185/55 R16",
    reportedIssue: "Nail in the tread of the left front tyre.",
    workCarriedOut:
      "Checked the injury against the repair limits, patched from inside the tread, rebalanced the wheel and reset pressures to 32 psi.",
    partsUsed: ["Inside patch ×1", "Valve core ×1"],
    total: 29,
    turnaround: "35 min",
    date: "2026-11-12",
  },
  {
    reference: "TS-2415",
    vehicle: "2020 BMW 320i, 225/50 R17",
    reportedIssue: "Two front tyres at the wear markers after 38,000 km.",
    workCarriedOut:
      "Fitted two 225/50 R17 94W tyres on the guarded changer, balanced each wheel, completed the TPMS relearn and recorded the final torque reading.",
    partsUsed: ["Hankook Ventus S1 evo3 ×2", "TPMS service kit ×2"],
    total: 396,
    turnaround: "1 hr 40 min",
    date: "2026-11-11",
  },
];
