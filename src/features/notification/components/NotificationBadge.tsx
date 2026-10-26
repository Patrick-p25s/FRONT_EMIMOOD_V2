// features/notifications/components/NotificationBadge.tsx
import { useNotificationUnread } from "../hooks/useNotifications";

export function NotificationBadge() {
  const count = useNotificationUnread().data ?? 0;
  if (count === 0) return null;
  return (
    <span
      className="notification-dot"
      aria-label={`${count} notification${count > 1 ? "s" : ""} non lue${count > 1 ? "s" : ""}`}
    />
  );
}
