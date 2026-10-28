import { useEffect, useRef } from "react";

/** Appelle `onVisible` quand l'élément sentinelle approche de l'écran. */
export function useInfiniteSentinel(enabled: boolean, onVisible: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onVisible(),
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onVisible]);
  return ref;
}
