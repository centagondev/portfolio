import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useHoverCapable } from "./useHoverCapable";

let instance: Lenis | null = null;

/** The live Lenis instance, or null when native scrolling is in use. */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Smooth inertial scrolling on DESKTOP ONLY.
 *
 * Lenis hijacks touch scrolling, which feels laggy and sticky on
 * phones, and this site is used mostly on mobile. So on touch devices
 * we skip Lenis entirely and let the browser scroll natively at 60fps.
 * Also skipped under prefers-reduced-motion.
 */
export function useLenis(enabled: boolean = true) {
  const reducedMotion = usePrefersReducedMotion();
  const desktop = useHoverCapable();

  useEffect(() => {
    if (!enabled || reducedMotion || !desktop) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Never take over touch scrolling, even on hybrid devices.
      syncTouch: false,
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
  }, [enabled, reducedMotion, desktop]);
}
