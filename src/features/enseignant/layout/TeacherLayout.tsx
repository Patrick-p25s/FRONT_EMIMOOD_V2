// src/features/enseignant/layout/TeacherLayout.tsx
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Home, Megaphone, NotebookText } from "lucide-react";
import { Brand } from "@/components/emimood/atoms/Brand";
import { ConsoleLayout, type NavGroup } from "@/components/emimood/templates/ConsoleLayout";

type TeacherTo =
  "/enseignant" | "/enseignant/matieres" | "/enseignant/evaluations" | "/enseignant/annonces";

const NAV: NavGroup<TeacherTo>[] = [
  {
    items: [
      { to: "/enseignant", label: "Accueil", icon: Home, exact: true },
      { to: "/enseignant/matieres", label: "Mes matières", icon: NotebookText },
      { to: "/enseignant/evaluations", label: "Évaluations", icon: ClipboardCheck },
      { to: "/enseignant/annonces", label: "Annonces", icon: Megaphone },
    ],
  },
];

export function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <ConsoleLayout
      brand={<Brand link="/enseignant" />}
      badge="Espace enseignant"
      navLabel="Navigation enseignant"
      nav={NAV}
      link={(to, props) => <Link to={to} {...props} />}
    >
      {children}
    </ConsoleLayout>
  );
}
