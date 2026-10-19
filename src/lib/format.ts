// src/lib/format.ts
const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function parse(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function fmtDate(value: string | null | undefined) {
  const date = parse(value);
  return date ? dateFormat.format(date) : "—";
}

export function fmtDateTime(value: string | null | undefined) {
  const date = parse(value);
  return date ? dateTimeFormat.format(date) : "—";
}

export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return letters || "?";
}
