import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SILK_EASE } from "./ui/Reveal";
import lockupPng from "../assets/centagon-lockup.png";

const TAGLINE_AT = 2.4;
const EXIT_BACKSTOP_MS = 5200;
const REDUCED_HOLD_MS = 1100;

interface PreloaderProps {
  onDone: () => void;
}

/**
 * Black intro built around the OFFICIAL Centagon logo animation
 * (provided .mov, transcoded to an alpha-keyed VP9 WebM so the cells
 * float on pure black; H.264 fallback for browsers without VP9
 * alpha). "Every Side Matters" settles beneath while it plays, then
 * the screen scales open and dissolves into Home. First load only,
 * skippable; reduced-motion shows the static logo briefly instead.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const reduced = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Backstop: leave even if the video stalls or never fires "ended".
  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setLeaving(true), EXIT_BACKSTOP_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  // Reduced motion: static logo, brief hold, no animation.
  useEffect(() => {
    if (!reduced) return;
    const t = window.setTimeout(onDone, REDUCED_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reduced, onDone]);

  useEffect(() => {
    if (reduced) return;
    const skip = () => setLeaving(true);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black"
        aria-label="Loading Centagon"
      >
        <img src={lockupPng} alt="Centagon" className="h-10 w-auto" />
        <p className="font-body text-[11px] font-500 uppercase tracking-[0.34em] text-silk">
          Every Side Matters
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ scale: 1.14, opacity: 0 }}
          transition={{ duration: 0.5, ease: [...SILK_EASE] }}
          aria-label="Loading Centagon"
        >
          {/* The official logo animation, keyed onto pure black. */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={() => setLeaving(true)}
            onError={() => setLeaving(true)}
            className="h-64 w-auto sm:h-80"
            aria-hidden="true"
          >
            <source src="/brand/centagon-logo-animation.webm" type="video/webm" />
            <source src="/brand/centagon-logo-intro.mp4" type="video/mp4" />
          </video>

          <motion.p
            className="mt-2 font-body text-[11px] font-500 uppercase tracking-[0.34em] text-silk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: TAGLINE_AT, ease: [...SILK_EASE] }}
          >
            Every Side Matters
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
