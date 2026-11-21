export type QuoteKind = "tyre" | "service";

export type QuoteItem = {
  key: string;
  kind: QuoteKind;
  ref: string;
  label: string;
  meta: string;
  qty: number;
  price: number;
  minutes: number;
};

export type Slot = {
  date: string;
  time: string;
  available: boolean;
  bay: number;
};

export type VehicleType = "Car" | "SUV" | "Bakkie" | "Van";

export type TyreSku = {
  sku: string;
  brand: string;
  pattern: string;
  size: string;
  loadSpeed: string;
  vehicleType: VehicleType;
  price: number;
  stock: number;
  fits: string;
  minutes: number;
  image: string;
  imageAlt: string;
};

export type Vehicle = {
  id: string;
  label: string;
  years: string;
  sizes: string[];
  note: string;
};

export type ServiceCategory = "Wheels" | "Alignment" | "Diagnostics" | "Maintenance";

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  symptom: string;
  durationMin: number;
  priceFrom: number;
  summary: string;
  fixes: string;
  procedure: string[];
  checks: string[];
  measurements: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
};

export type Job = {
  reference: string;
  vehicle: string;
  reportedIssue: string;
  workCarriedOut: string;
  partsUsed: string[];
  total: number;
  turnaround: string;
  date: string;
};

export type Faq = {
  category: string;
  question: string;
  answer: string;
};
