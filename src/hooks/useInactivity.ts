// src/hooks/useInactivity.ts
import { useEffect, useRef, useState } from "react";
import { refreshTokens } from "@/lib/api/client";

const IDLE_MS = 30 * 60 * 1000;
const WARN_MS = 60 * 1000;

export function useInactivity(onTimeout: () => void) {
  const [warning, setWarning] = useState(false);
  const last = useRef(Date.now());
  useEffect(() => {
    const bump = () => {
      last.current = Date.now();
    };
    const events = ["mousemove", "keydown", "pointerdown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const t = setInterval(() => {
      const idle = Date.now() - last.current;
      if (idle >= IDLE_MS) onTimeout();
      else setWarning(idle >= IDLE_MS - WARN_MS);
    }, 5000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(t);
    };
  }, [onTimeout]);
  const stay = async () => {
    last.current = Date.now();
    setWarning(false);
    await refreshTokens();
  };
  return { warning, stay };
}
