// src/routes/admin.universities.tsx (nouveau : simple passage)
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/universities")({ component: Outlet });
