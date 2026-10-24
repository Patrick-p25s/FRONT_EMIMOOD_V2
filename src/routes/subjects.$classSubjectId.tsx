import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/subjects/$classSubjectId")({ component: Outlet });
