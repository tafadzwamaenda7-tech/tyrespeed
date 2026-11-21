export type SiteClosure = {
  /** ISO date in Harare local time, for example 2026-12-25. */
  date: string;
  reason: string;
};

export const site = {
  name: "tyrespeed",
  city: "Harare",
  location: "Eastlea, Harare",
  phoneNumber: "07736466184",
  phoneDisplay: "0773 646 6184",
  phoneHref: "tel:+2637736466184",
  whatsappNumber: "2637736466184",
  whatsappDisplay: "0773 646 6184",
  whatsappHref: "https://wa.me/2637736466184",
  email: "hello@tyrespeed.co.zw",
  address: "20 McChlery Road, Eastlea, Harare",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=20%20McChlery%20Road%2C%20Eastlea%2C%20Harare",
  /** Temporary or holiday closures. Intentionally empty until dates are supplied. */
  closures: [] as SiteClosure[],
  hoursCompact: "Mon to Fri 08:00 to 17:30, Sat 08:00 to 13:00",
  hours: [
    { days: "Monday to Friday", time: "08:00 to 17:30" },
    { days: "Saturday", time: "08:00 to 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
  navigation: [
    { label: "Find tyres", href: "/tyres" },
    { label: "Services", href: "/services" },
    { label: "Workshop", href: "/workshop" },
    { label: "FAQ", href: "/faq" },
  ],
  equipment: [
    "Guarded low-profile tyre changer",
    "Computer wheel balancer, calibrated monthly",
    "Four-wheel alignment rig with camber, caster and toe readouts",
    "Torque wrenches checked against a master gauge",
    "TPMS scan and relearn tool",
    "Tread depth and pressure gauges at the reception bench",
  ],
  arrival: [
    {
      title: "Park in bay 1",
      detail:
        "Come to 20 McChlery Road, Eastlea and park in the first marked bay. Someone will come out within five minutes.",
    },
    {
      title: "Hand over the keys and the job card",
      detail:
        "We write the reported problem, mileage and your contact number on the card. You approve the scope before we start.",
    },
    {
      title: "Get the measurement before the work",
      detail:
        "For alignment, balancing and pressure work we show you the first reading and the target before anything is adjusted.",
    },
    {
      title: "Pay on collection",
      detail:
        "USD cash or card at the counter. The invoice lists parts, labour and the torque or alignment figures we recorded.",
    },
  ],
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tyrespeed.co.zw";

/** WhatsApp deep link with a prefilled message. Never include personal details here. */
export function whatsappLink(message: string): string {
  return `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
}

const harareWeekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function minutesOf(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function clockTime(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function harareDate(from: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Harare",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(from);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

/** Plain-text outlet status derived from closures and site.hours, in Harare local time. */
export function outletStatus(from: Date = new Date()): string {
  const closure = site.closures.find(
    (entry) => entry.date === harareDate(from) && entry.reason.trim().length > 0,
  );
  if (closure) return `Closed today: ${closure.reason}`;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Harare",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(from);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Monday";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const now = hour * 60 + minute;
  const parsedDay = harareWeekdays.indexOf(weekday as (typeof harareWeekdays)[number]);
  const day = parsedDay < 0 ? 1 : parsedDay;

  const windowFor = (index: number): { open: number; close: number } | null => {
    const entry = index === 0 ? site.hours[2] : index === 6 ? site.hours[1] : site.hours[0];
    if (entry.time === "Closed") return null;
    const [open, close] = entry.time.split(" to ").map(minutesOf);
    return { open, close };
  };

  const today = windowFor(day);
  if (today && now >= today.open && now < today.close) {
    return `Open until ${clockTime(today.close)}`;
  }

  const nextDay = today && now < today.open ? day : day + 1;
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = (nextDay + offset) % 7;
    const nextWindow = windowFor(candidate);
    if (nextWindow) return `Opens ${clockTime(nextWindow.open)} ${harareWeekdays[candidate]}`;
  }

  return site.hoursCompact;
}
