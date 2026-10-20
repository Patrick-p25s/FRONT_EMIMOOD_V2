// lib/statut.ts
import { statutLabel, type Statut } from "@/lib/domain";

export const STATUT_OPTIONS = (["active", "suspend", "inactive"] as const).map((value) => ({
  value,
  label: statutLabel[value],
}));

/** Changements de statut proposés selon le statut actuel. */
export const TRANSITIONS: Record<
  Statut,
  { statut: Statut; label: string; destructive: boolean }[]
> = {
  active: [
    { statut: "suspend", label: "Suspendre", destructive: false },
    { statut: "inactive", label: "Désactiver", destructive: true },
  ],
  suspend: [
    { statut: "active", label: "Réactiver", destructive: false },
    { statut: "inactive", label: "Désactiver", destructive: true },
  ],
  inactive: [{ statut: "active", label: "Réactiver", destructive: false }],
};
