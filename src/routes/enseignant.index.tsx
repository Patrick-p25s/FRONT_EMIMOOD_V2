// src/routes/enseignant.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/enseignant/pages/overview";

export const Route = createFileRoute("/enseignant/")({ component: HomePage });
