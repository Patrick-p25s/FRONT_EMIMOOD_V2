// src/components/emimood/atoms/Logo.tsx
import { useState } from "react";
import { initials } from "@/lib/format";

export function Logo({ url, name }: { url: string | null | undefined; name: string }) {
  const [failed, setFailed] = useState(false);
  if (url && url.startsWith("https://") && !failed) {
    return (
      <img
        src={url}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-9 rounded-lg border object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid size-9 place-items-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground"
    >
      {initials(name)}
    </span>
  );
}
