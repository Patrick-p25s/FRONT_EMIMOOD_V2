import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/enseignant/messages")({ component: Outlet });
