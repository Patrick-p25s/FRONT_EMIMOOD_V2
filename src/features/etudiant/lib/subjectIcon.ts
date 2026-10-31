import { BookOpen, Code2, Database, Kanban, type LucideIcon } from "lucide-react";

const RULES: { match: string[]; icon: LucideIcon }[] = [
  { match: ["web", "program", "code", "algorithm", "dev"], icon: Code2 },
  { match: ["donnee", "base", "sql"], icon: Database },
  { match: ["projet", "gestion", "agile"], icon: Kanban },
];

const plain = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function subjectIcon(name: string, code: string | null): LucideIcon {
  const text = plain(`${name} ${code ?? ""}`);
  return RULES.find((rule) => rule.match.some((word) => text.includes(word)))?.icon ?? BookOpen;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.slice(0, 1).toUpperCase())
    .join("");
}
