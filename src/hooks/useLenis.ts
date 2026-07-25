import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

let instance: Lenis | null = null;

/** The live Lenis instance, for programmatic scrolls (route changes). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Global smooth scrolling — snappy, weighted, driven by its own rAF.
 * Disabled entirely under prefers-reduced-motion.
 */
export function useLenis(enabled: boolean = true) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    instance = lenis;

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, [enabled, reducedMotion]);
}
