import { createFileRoute } from "@tanstack/react-router";
import { RoleConsolePage, superAdminConsole } from "@/components/emimood/admin";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/administration")({
  head: () => pageHead("Super administration", "Universités, structure, utilisateurs, rôles, codes d’invitation et journal d’EMIMood."),
  component: () => <RoleConsolePage config={superAdminConsole} />,
});
