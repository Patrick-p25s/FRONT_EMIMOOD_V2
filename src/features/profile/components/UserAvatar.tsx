// features/profile/components/UserAvatar.tsx
import { cn } from "@/lib/utils";
import { avatarSrc } from "../lib/avatar";
import { initials } from "@/lib/format";

type UserAvatarProps = { name: string; url?: string | null | undefined; className?: string };

/** Photo si elle existe (adresse contrôlée), sinon les initiales. */
export function UserAvatar({ name, url, className }: UserAvatarProps) {
  const src = avatarSrc(url);
  return src ? (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      className={cn("size-10 shrink-0 rounded-full object-cover", className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
