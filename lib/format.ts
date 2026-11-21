export function usd(amount: number): string {
  return `USD$${amount.toLocaleString("en-US")}`;
}

export function minutes(total: number): string {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export function dateLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function relativeDay(iso: string, from: Date = new Date()): string {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const [year, month, day] = iso.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return dateLabel(iso);
}
