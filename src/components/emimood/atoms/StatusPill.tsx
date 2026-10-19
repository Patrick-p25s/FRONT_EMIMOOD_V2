// src/components/emimood/atoms/StatusPill.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneSoft, type Tone } from "./tones";

type StatusPillProps = {
  tone?: Tone | undefined;
  children: ReactNode;
  className?: string | undefined;
};

export function StatusPill({ tone = "muted", children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneSoft[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
