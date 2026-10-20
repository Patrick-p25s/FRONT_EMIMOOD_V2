// src/features/admin/layout/AdminLayout.tsx
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Building2, CalendarRange, LayoutDashboard, School, Users } from "lucide-react";
import { Brand } from "@/components/emimood/atoms/Brand";
import { SimpleSelect } from "@/components/emimood/molecules/filters";
import { ConsoleLayout, type NavGroup } from "@/components/emimood/templates/ConsoleLayout";
import { useActiveUniversity } from "../hooks/useActiveUniversity";

type AdminTo =
  | "/admin"
  | "/admin/universities"
  | "/admin/academic-years"
  | "/admin/classes"
  | "/admin/users"
  | "/admin/subjects";

const NAV: NavGroup<AdminTo>[] = [
  {
    group: "Vue d’ensemble",
    items: [{ to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true }],
  },
  {
    group: "Organisation",
    items: [
      { to: "/admin/universities", label: "Universités", icon: Building2 },
      { to: "/admin/academic-years", label: "Années académiques", icon: CalendarRange },
      { to: "/admin/classes", label: "Classes et codes", icon: School },
    ],
  },
  { group: "Personnes", items: [{ to: "/admin/users", label: "Utilisateurs", icon: Users }] },
  { group: "Pédagogie", items: [{ to: "/admin/subjects", label: "Matières", icon: BookOpen }] },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { universityId, setUniversity, universities } = useActiveUniversity();

  return (
    <ConsoleLayout
      brand={<Brand link="/admin" />}
      badge="Administration"
      navLabel="Navigation d’administration"
      nav={NAV}
      link={(to, props) => (
        <Link to={to} search={(prev: { u?: string | undefined }) => ({ u: prev.u })} {...props} />
      )}
      scope={
        <div className="flex items-center gap-2">
          <label
            htmlFor="active-university"
            className="hidden text-sm text-muted-foreground sm:inline"
          >
            Université
          </label>
          <SimpleSelect
            id="active-university"
            value={universityId}
            onChange={setUniversity}
            options={universities.map((u) => ({ value: u.id, label: u.name }))}
            placeholder="Université"
            allLabel="Toutes les universités"
          />
        </div>
      }
    >
      {children}
    </ConsoleLayout>
  );
}

export default AdminLayout;
