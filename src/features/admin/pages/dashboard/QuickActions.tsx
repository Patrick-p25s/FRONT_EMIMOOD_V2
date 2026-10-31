// Raccourcis vers les actions d'administration les plus fréquentes.
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  CalendarRange,
  ChevronRight,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import { Panel } from "@/components/emimood/molecules/Panel";
import { keepU, type AdminPath } from "../../lib/search";

const actions: { to: AdminPath; label: string; icon: LucideIcon }[] = [
  { to: "/admin/universities", label: "Créer une université", icon: Building2 },
  { to: "/admin/academic-years", label: "Créer une année académique", icon: CalendarRange },
  { to: "/admin/classes", label: "Créer une classe et son code", icon: KeyRound },
  { to: "/admin/subjects", label: "Ajouter une matière", icon: BookOpen },
];

export function QuickActions() {
  return (
    <Panel title="Actions rapides">
      <ul className="grid gap-2">
        {actions.map((action) => (
          <li key={action.label}>
            <Link
              to={action.to}
              search={keepU}
              className="flex items-center gap-3 rounded-lg border p-2.5 text-sm font-medium no-underline transition-colors hover:border-primary/40 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <IconBox icon={action.icon} tone="danger" />
              <span className="flex-1">{action.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
