import { useEffect, useState } from "react";

/**
 * True only on devices with a real hovering pointer (mouse/trackpad).
 * Hover-driven effects are desktop-only: on phones and tablets they
 * either never fire or fire once on tap and stick, which feels broken.
 */
const QUERY = "(hover: hover) and (pointer: fine)";

export function useHoverCapable(): boolean {
  const [capable, setCapable] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setCapable(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return capable;
}
