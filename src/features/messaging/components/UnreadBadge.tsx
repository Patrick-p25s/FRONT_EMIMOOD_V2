// components/UnreadBadge.tsx : pastille du menu « Messages »
import { cn } from "@/lib/utils";
import { useUnreadCount } from "../hooks/useMessaging";

export function UnreadBadge({ className }: { className?: string }) {
  const count = useUnreadCount().data?.unread_messages ?? 0;
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "ml-auto grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground",
        className,
      )}
      aria-label={`${count} message${count > 1 ? "s" : ""} non lu${count > 1 ? "s" : ""}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
