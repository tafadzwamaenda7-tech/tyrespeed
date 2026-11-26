import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "tyre-fitting",
    title: "Tyre fitting",
    category: "Wheels",
    symptom: "New tyres, worn tread or a sidewall injury",
    durationMin: 35,
    priceFrom: 12,
    summary: "Wheel off, rim checked, new tyre fitted, bead seated and bolts torqued to the vehicle figure.",
    fixes:
      "A tyre change is only as good as the fitment. We check the rim for bends and corrosion before the new tyre goes on, then torque the bolts to the manufacturer's figure rather than an air-gun setting.",
    procedure: [
      "Wheel removed and the rim checked for bends, corrosion and old weight residue.",
      "Old tyre removed on a guarded changer; the bead seat is cleaned before the new one is fitted.",
      "New tyre inflated to the door-placard pressure and checked for an even bead line.",
      "Wheel balanced, refitted and bolts torqued in a star pattern.",
    ],
    checks: [
      "Rim condition on all four wheels",
      "Load index and speed rating against the placard",
      "Date code on every new tyre",
      "Torque figure recorded on the job card",
    ],
    measurements: [
      { label: "Fitment time", value: "35 min / wheel" },
      { label: "Torque check", value: "Vehicle spec, recorded" },
      { label: "Valve", value: "New rubber valve fitted" },
    ],
    faqs: [
      {
        question: "Do you fit tyres bought elsewhere?",
        answer:
          "Yes. We check size, load rating, date code and condition first. If a tyre is old or damaged we tell you before touching the car.",
      },
      {
        question: "Is balancing included?",
        answer:
          "No. It is a separate line on the invoice so you can see it clearly.",
      },
    ],
  },
  {
    slug: "wheel-balancing",
    title: "Wheel balancing",
    category: "Wheels",
    symptom: "Vibration through the steering wheel above 90 km/h",
    durationMin: 20,
    priceFrom: 10,
    summary: "Old weights removed, assembly measured on a calibrated balancer, weights placed and the reading shown to you.",
    fixes:
      "Balancing corrects heavy spots in the tyre and wheel assembly. We remove the old weights, clean the rim where they sit and place new weights to suit the wheel design.",
    procedure: [
      "Wheel removed and old weights taken off.",
      "Mounted on the balancer for static and dynamic readings.",
      "Clip-on or adhesive weights placed in the corrected positions.",
      "Re-checked to under 5 g of residual imbalance, then refitted.",
    ],
    checks: [
      "Balancer calibration against a known weight",
      "Rim surface cleaned before adhesive weights",
      "Bead seated evenly before measurement",
      "Wheel torque after refit",
    ],
    measurements: [
      { label: "Balance time", value: "20 min / wheel" },
      { label: "Residual target", value: "Under 5 g" },
      { label: "Reading", value: "Before and after shown" },
    ],
    faqs: [
      {
        question: "How often should wheels be balanced?",
        answer:
          "With every tyre change, and sooner if you feel vibration through the steering wheel or the seat.",
      },
      {
        question: "Why do the weights fall off?",
        answer:
          "Usually a dirty rim surface or a clip that does not match the wheel. We clean the contact area and choose the weight type for that rim.",
      },
    ],
  },
  {
    slug: "four-wheel-alignment",
    title: "Four-wheel alignment",
    category: "Alignment",
    symptom: "Steering pulls, crooked wheel or one edge wearing faster",
    durationMin: 75,
    priceFrom: 45,
    summary: "Camber, caster and toe measured at all four corners, adjusted to the manufacturer spec and road-tested.",
    fixes:
      "Harare potholes and kerbs knock toe and camber out of spec. We measure all four corners before adjusting anything, inspect the suspension for wear and road-test the result.",
    procedure: [
      "Tyre pressures set and suspension play checked before measurement.",
      "Vehicle on the four-wheel rig; camber, caster and toe recorded at each corner.",
      "Adjustments made to the figures in the manufacturer's range.",
      "Printed before-and-after sheet and a 12 km road test.",
    ],
    checks: [
      "Tyre pressures and tread depth equalised first",
      "Ball joints, tie rods and bushes checked for play",
      "Steering wheel centred after adjustment",
      "Before-and-after sheet kept with the job record",
    ],
    measurements: [
      { label: "Camber", value: "All four wheels" },
      { label: "Caster", value: "Front axle" },
      { label: "Toe", value: "Front and rear axle" },
      { label: "Bay time", value: "1 hr 15 min" },
    ],
    faqs: [
      {
        question: "Why not a two-wheel alignment?",
        answer:
          "Rear toe affects the thrust angle on most cars. Measuring only the front wheels can leave the car tracking sideways even when the steering wheel looks straight.",
      },
      {
        question: "Will alignment stop tyre wear?",
        answer:
          "It corrects wear caused by angles outside spec. If a bush or damper is worn, we fit the part first or the angles will drift again.",
      },
    ],
  },
  {
    slug: "puncture-repair",
    title: "Puncture repair",
    category: "Wheels",
    symptom: "Nail in the tread or pressure dropping overnight",
    durationMin: 25,
    priceFrom: 18,
    summary: "Tyre removed, injury checked against the repair limits, patched from inside and rebalanced.",
    fixes:
      "We only repair small injuries in the centre of the tread. Sidewall and shoulder damage is not repairable, and we will say so before doing any work.",
    procedure: [
      "Wheel removed and the tyre inspected inside and out.",
      "Injury measured; anything over 6 mm or outside the tread is rejected.",
      "Inside patch applied and the tyre refitted.",
      "Pressure set and the wheel rebalanced.",
    ],
    checks: [
      "Injury position within the centre tread",
      "No internal ply damage or oxidation",
      "Bead seat checked after refit",
      "Pressure rechecked after 10 minutes",
    ],
    measurements: [
      { label: "Repair limit", value: "6 mm centre tread" },
      { label: "Bay time", value: "25 min" },
      { label: "Pressure", value: "Set to placard" },
    ],
    faqs: [
      {
        question: "Can a sidewall puncture be repaired?",
        answer:
          "No. The sidewall flexes with every rotation and a patch there is not a safe repair. The tyre needs replacing.",
      },
      {
        question: "Do I need a new valve with the repair?",
        answer:
          "Only if the valve core is leaking or the rubber is perished. We test it before recommending a replacement.",
      },
    ],
  },
  {
    slug: "tpms-check",
    title: "TPMS check and reset",
    category: "Diagnostics",
    symptom: "Pressure warning light on after a tyre change",
    durationMin: 20,
    priceFrom: 25,
    summary: "Sensors scanned, pressures set cold, failed units identified and the relearn completed.",
    fixes:
      "A warning light after a tyre change is usually an unlearned sensor or a flat battery in the unit. We scan each sensor, report the readings and complete the relearn.",
    procedure: [
      "Scan all four sensors and record the IDs and battery state.",
      "Set cold pressures to the door-placard figures.",
      "Replace failed sensors only after showing you the reading.",
      "Complete the vehicle relearn and clear the warning light.",
    ],
    checks: [
      "Sensor ID and battery reading per wheel",
      "Spare wheel sensor where fitted",
      "Cold pressure set before the relearn",
      "Warning lamp confirmed off after the drive",
    ],
    measurements: [
      { label: "Scan time", value: "20 min" },
      { label: "Pressure", value: "Cold, to placard" },
      { label: "Report", value: "Per-sensor readings" },
    ],
    faqs: [
      {
        question: "Do you reset sensors after fitting tyres?",
        answer:
          "Yes. We scan the system, set cold pressures and run the relearn for the vehicle. If a sensor has failed we show you the reading before replacing it.",
      },
      {
        question: "Why did the light come back after a week?",
        answer:
          "Usually a slow leak or a sensor with a weak battery. We recheck pressures first, then the sensor data, before recommending parts.",
      },
    ],
  },
  {
    slug: "brake-inspection",
    title: "Brake inspection",
    category: "Diagnostics",
    symptom: "Squeal, longer stopping distance or a pulsing pedal",
    durationMin: 40,
    priceFrom: 35,
    summary: "Pad and disc measured, caliper operation checked and the figures written on the job card.",
    fixes:
      "We measure pad thickness and disc wear at each wheel rather than guessing from noise. Any limit we find is written down with the reading.",
    procedure: [
      "Wheels removed and pad thickness measured at all four corners.",
      "Disc thickness and runout checked with a gauge.",
      "Caliper slide pins and hose condition inspected.",
      "Findings recorded with the minimum and actual figures.",
    ],
    checks: [
      "Pad thickness against the 3 mm service limit",
      "Disc thickness against the minimum stamped on the disc",
      "Caliper slide movement",
      "Brake fluid condition and level",
    ],
    measurements: [
      { label: "Pad limit", value: "3 mm" },
      { label: "Disc reading", value: "Recorded per wheel" },
      { label: "Bay time", value: "40 min" },
    ],
    faqs: [
      {
        question: "Do you replace pads during the inspection?",
        answer:
          "No. Inspection is measurement only. We report the readings and you approve any parts before we fit them.",
      },
      {
        question: "Why does the pedal pulse?",
        answer:
          "Usually disc thickness variation. We measure runout and thickness before recommending machining or replacement.",
      },
    ],
  },
  {
    slug: "suspension-check",
    title: "Suspension check",
    category: "Diagnostics",
    symptom: "Knock over bumps or uneven tyre wear",
    durationMin: 50,
    priceFrom: 40,
    summary: "Bushes, ball joints, dampers and tie rods tested with the wheel loaded, then written into a short report.",
    fixes:
      "Uneven tyre wear is often a suspension part with play. We check each joint with the vehicle on the ramp before changing alignment angles.",
    procedure: [
      "Vehicle raised and each wheel loaded to test for movement.",
      "Ball joints, tie rods and bushes checked with a lever.",
      "Dampers inspected for leaks and tested by compression.",
      "Findings listed with the corner and the measured play.",
    ],
    checks: [
      "Upper and lower ball joints",
      "Tie rod ends and rack boots",
      "Control arm bushes",
      "Damper leaks and mounting play",
    ],
    measurements: [
      { label: "Bay time", value: "50 min" },
      { label: "Report", value: "Per-corner findings" },
      { label: "Follow-up", value: "Alignment after parts" },
    ],
    faqs: [
      {
        question: "Why check suspension before alignment?",
        answer:
          "A worn bush lets the angle move during the measurement. Adjusting around it gives a printout that will not hold.",
      },
      {
        question: "Can one worn damper wear two tyres?",
        answer:
          "Yes. A weak damper lets the tyre lift and skip on uneven roads, which shows up as patchy wear on that corner.",
      },
    ],
  },
  {
    slug: "tyre-rotation",
    title: "Tyre rotation",
    category: "Maintenance",
    symptom: "Front tyres worn at 30,000 km while the rear pair still has tread",
    durationMin: 30,
    priceFrom: 20,
    summary: "Wheels moved to the vehicle's rotation pattern, torqued to spec and pressures reset.",
    fixes:
      "Rotation evens out wear between axles. We follow the pattern in the owner's manual, especially on directional tyres and vehicles with different front and rear sizes.",
    procedure: [
      "Tread depths recorded at all four wheels before removal.",
      "Wheels moved in the pattern specified for that vehicle.",
      "Pressures set cold and bolts torqued in sequence.",
      "New tread depths recorded on the job card.",
    ],
    checks: [
      "Direction of rotation on asymmetric tyres",
      "Different front and rear sizes where fitted",
      "Tread depth difference before rotation",
      "Torque figure after refit",
    ],
    measurements: [
      { label: "Bay time", value: "30 min" },
      { label: "Pressures", value: "Set cold" },
      { label: "Record", value: "Before and after tread" },
    ],
    faqs: [
      {
        question: "How often should tyres be rotated?",
        answer:
          "Every 10,000 km, or at each service if the vehicle mainly does short city trips.",
      },
      {
        question: "Can all four tyres be rotated?",
        answer:
          "Only if the sizes match. Cars with different front and rear sizes can only rotate side to side, if the tyre design allows it.",
      },
    ],
  },
  {
    slug: "pressure-tread-check",
    title: "Pressure and tread check",
    category: "Maintenance",
    symptom: "Before a long trip or after hitting a kerb",
    durationMin: 15,
    priceFrom: 12,
    summary: "Cold pressures set to the placard, tread measured at three points per tyre and date codes recorded.",
    fixes:
      "A short check catches low pressure and uneven wear before they cost you a tyre. We write the figures on the card so you have a baseline for the next visit.",
    procedure: [
      "Pressures checked cold and adjusted to the door-placard figures.",
      "Tread measured at the centre and both shoulders of each tyre.",
      "Date codes and visible damage recorded.",
      "Spare wheel included where fitted.",
    ],
    checks: [
      "Placard pressure for the loaded vehicle",
      "Tread depth at three points per tyre",
      "Sidewall cuts, bulges and repairs",
      "Spare wheel pressure",
    ],
    measurements: [
      { label: "Bay time", value: "15 min" },
      { label: "Tread points", value: "3 per tyre" },
      { label: "Legal minimum", value: "1.6 mm" },
    ],
    faqs: [
      {
        question: "What tread depth do you recommend?",
        answer:
          "The legal minimum is 1.6 mm. We recommend replacing at 3 mm in the wet, because braking distance rises sharply below that.",
      },
      {
        question: "Why check pressures cold?",
        answer:
          "The placard figure is a cold reading. A tyre driven 20 km can read 3 to 5 psi higher, which gives a false adjustment.",
      },
    ],
  },
  {
    slug: "alloy-wheel-refinish",
    title: "Alloy wheel refinish",
    category: "Wheels",
    symptom: "Kerbed edges, corroded lips or a faded machined face",
    durationMin: 180,
    priceFrom: 95,
    summary: "Wheel stripped, kerb damage filled, refinished to the original finish and balanced before refit.",
    fixes:
      "We refinish one wheel at a time so the set stays matched. The tyre is removed, the barrel masked and the finish rebuilt before balancing.",
    procedure: [
      "Wheel removed, tyre separated and the rim degreased.",
      "Kerb marks filled and sanded through to the original profile.",
      "Primer, base colour and clear coat applied in a booth.",
      "Tyre refitted, bead seated and wheel balanced.",
    ],
    checks: [
      "Rim checked for bends before cosmetic work",
      "Finish code matched to the other wheels",
      "Bead seat masked and cleaned",
      "Balance reading after refit",
    ],
    measurements: [
      { label: "Bay time", value: "3 hr / wheel" },
      { label: "Cure time", value: "Overnight before fitting" },
      { label: "Finish", value: "Original colour matched" },
    ],
    faqs: [
      {
        question: "Do I need to leave the car?",
        answer:
          "No. Drop off the wheel or the car in the morning and collect after the clear coat has cured, usually the next day.",
      },
      {
        question: "Can you match only one kerbed wheel?",
        answer:
          "We colour-match to the existing finish. If the set has faded unevenly, we will tell you before starting whether one wheel will stand out.",
      },
    ],
  },
];

export const serviceCategories = [
  "All",
  "Wheels",
  "Alignment",
  "Diagnostics",
  "Maintenance",
] as const;

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceOptions = services.map((service) => ({
  value: service.slug,
  label: service.title,
}));
