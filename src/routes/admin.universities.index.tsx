// src/routes/admin.universities.index.tsx (le contenu change)
import { createFileRoute } from "@tanstack/react-router";
import { UniversitiesPage } from "@/features/admin/pages/universities";

export const Route = createFileRoute("/admin/universities/")({ component: UniversitiesPage });
