// src/features/admin/lib/search.ts
import type { AdminSearch } from "../hooks/useAdminSearch";

// L'URL parse « 2024 » en nombre : on ramène tout en texte.
const text = (value: unknown) => {
  if (typeof value === "string") return value === "" ? undefined : value;
  if (typeof value === "number") return String(value);
  return undefined;
};

const count = (value: unknown) => {
  const n =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

export function validateAdminSearch(search: Record<string, unknown>): AdminSearch {
  return {
    u: text(search["u"]),
    q: text(search["q"]),
    page: count(search["page"]),
    page_size: count(search["page_size"]),
    statut: text(search["statut"]),
    role: text(search["role"]),
    classe: text(search["classe"]),
    mention: text(search["mention"]),
    level: text(search["level"]),
    year: text(search["year"]),
    univ: text(search["univ"]),
    active: text(search["active"]),
    tab: text(search["tab"]),
  };
}

/** Garde l'université active (?u=) quand on navigue entre les écrans admin. */
export const keepU = (prev: { u?: string | undefined }) => ({ u: prev.u });

export type AdminPath =
  | "/admin/universities"
  | "/admin/academic-years"
  | "/admin/classes"
  | "/admin/users"
  | "/admin/subjects";
