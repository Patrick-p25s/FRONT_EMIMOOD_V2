// src/components/emimood/atoms/IconBox.tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneSoft, type Tone } from "./tones";

type IconBoxProps = { icon: LucideIcon; tone?: Tone | undefined; className?: string | undefined };

export function IconBox({ icon: Icon, tone = "success", className }: IconBoxProps) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg",
        toneSoft[tone],
        className,
      )}
    >
      <Icon className="size-4.5" aria-hidden />
    </span>
  );
}
