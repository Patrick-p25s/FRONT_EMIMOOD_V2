// src/components/emimood/atoms/tones.ts
export type Tone = "success" | "info" | "warning" | "danger" | "muted";

export const toneSoft: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};
