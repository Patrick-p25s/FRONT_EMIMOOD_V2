// features/notifications/pages/NotificationsPage.tsx
import { Link } from "@tanstack/react-router";
import { Bell, Check, Trash2 } from "lucide-react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { AppNotification } from "../api/schemas";
import {
  useNotificationActions,
  useNotifications,
  useNotificationUnread,
} from "../hooks/useNotifications";
import { timeAgo } from "../lib/format";
import { notificationTarget } from "../lib/target";

function Row({ n, role }: { n: AppNotification; role?: string | undefined }) {
  const { markRead, remove } = useNotificationActions();
  const to = notificationTarget(n, role);
  const open = () => !n.read && markRead.mutate(n.id);
  const title = <h2>{n.title}</h2>;

  return (
    <div className={cn("document-row", n.read && "opacity-70")}>
      <span className="stat-icon">
        <Bell />
      </span>
      <div className="flex-1">
        {to ? (
          <Link to={to} onClick={open} className="text-foreground no-underline">
            {title}
          </Link>
        ) : (
          title
        )}
        {n.text && <p className="small">{n.text}</p>}
        <p className="small">{timeAgo(n.created_at)}</p>
      </div>
      {n.read ? (
        <Check className="text-success" aria-label="Lue" />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Marquer « ${n.title} » comme lue`}
          disabled={markRead.isPending}
          onClick={open}
        >
          <span className="notification-dot relative top-auto right-auto" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Supprimer la notification"
        disabled={remove.isPending}
        onClick={() => remove.mutate(n.id)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function NotificationsPage() {
  const { user } = useAuth();
  const query = useNotifications();
  const unread = useNotificationUnread().data ?? 0;
  const { readAll } = useNotificationActions();
  const items = query.data?.pages.flat() ?? [];

  return (
    <div className="page">
      <Heading
        title="Notifications"
        subtitle="Restez connecté à ce qui compte sur votre campus."
        action={
          <Button
            variant="outline"
            disabled={unread === 0 || readAll.isPending}
            onClick={() => readAll.mutate()}
          >
            <Check /> Tout marquer comme lu
          </Button>
        }
      />
      {query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.isLoading ? (
        <div className="grid gap-2">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Aucune notification" description="Vous êtes à jour." />
      ) : (
        <div className="document-list">
          {items.map((n) => (
            <Row key={n.id} n={n} role={user?.role} />
          ))}
          {query.hasNextPage && (
            <Button
              variant="ghost"
              className="mx-auto"
              disabled={query.isFetchingNextPage}
              onClick={() => void query.fetchNextPage()}
            >
              {query.isFetchingNextPage ? "Chargement…" : "Voir plus"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
