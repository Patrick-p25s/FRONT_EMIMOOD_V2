// features/messaging/components/MessagesNavBadge.tsx
import { useUnreadCount } from "../hooks/useMessaging";

export function MessagesNavBadge() {
  const count = useUnreadCount().data?.unread_messages ?? 0;
  if (count === 0) return null;
  return (
    <span
      className="nav-badge"
      aria-label={`${count} message${count > 1 ? "s" : ""} non lu${count > 1 ? "s" : ""}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
