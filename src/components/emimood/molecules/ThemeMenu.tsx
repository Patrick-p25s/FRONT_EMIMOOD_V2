import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/emimood/theme";

export function ThemeMenu() {
  const { setTheme } = useTheme();
  return (
    <>
      <DropdownMenuLabel>Apparence</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun /> Clair
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon /> Sombre
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <Monitor /> Système
      </DropdownMenuItem>
    </>
  );
}
