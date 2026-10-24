// features/etudiant/lib/dates.ts
const dayStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export function todayLabel(): string {
  const text = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function dayTile(iso: string): { month: string; day: string } {
  const date = new Date(iso);
  return {
    month: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "").toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
  };
}

export const timeOf = (iso: string): string =>
  new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export function inDays(iso: string): string {
  const days = Math.round((dayStart(new Date(iso)) - dayStart(new Date())) / 86_400_000);
  if (days <= 0) return "Aujourd’hui";
  return days === 1 ? "Demain" : `Dans ${days} jours`;
}
