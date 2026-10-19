// src/lib/domain.ts
export type Statut = "active" | "suspend" | "inactive";

export const statutLabel: Record<Statut, string> = {
  active: "Actif",
  suspend: "Suspendu",
  inactive: "Désactivé",
};
