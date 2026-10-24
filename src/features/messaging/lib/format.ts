// features/messaging/lib/format.ts
import type { Message } from "../api/schemas";

export const EDIT_WINDOW_MS = 15 * 60_000;
export const canEdit = (message: Message): boolean =>
  message.is_mine &&
  !message.deleted &&
  Date.now() - Date.parse(message.created_at) < EDIT_WINDOW_MS;

const dayStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const daysAgo = (iso: string) =>
  Math.round((dayStart(new Date()) - dayStart(new Date(iso))) / 86_400_000);

export const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export function dayLabel(iso: string): string {
  const diff = daysAgo(iso);
  if (diff === 0) return "Aujourd’hui";
  if (diff === 1) return "Hier";
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function listTime(iso: string): string {
  const diff = daysAgo(iso);
  if (diff <= 0) return clockTime(iso);
  if (diff === 1) return "Hier";
  if (diff < 7) return new Date(iso).toLocaleDateString("fr-FR", { weekday: "short" });
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export type Row =
  | { kind: "day"; key: string; label: string }
  | { kind: "message"; key: string; message: Message; showSender: boolean };

export function buildRows(messages: Message[], isGroup: boolean): Row[] {
  const rows: Row[] = [];
  let previous: Message | undefined;
  for (const message of messages) {
    const newDay =
      !previous ||
      new Date(previous.created_at).toDateString() !== new Date(message.created_at).toDateString();
    if (newDay)
      rows.push({ kind: "day", key: `day-${message.id}`, label: dayLabel(message.created_at) });
    const showSender =
      isGroup && !message.is_mine && (newDay || previous?.sender.id !== message.sender.id);
    rows.push({ kind: "message", key: message.id, message, showSender });
    previous = message;
  }
  return rows;
}
