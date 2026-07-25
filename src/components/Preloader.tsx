import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SILK_EASE } from "./ui/Reveal";
import lockupPng from "../assets/centagon-lockup.png";

const TAGLINE = "Every Side Matters";
/** When typing starts, ms after mount. */
const TAGLINE_AT_MS = 2100;
/** Ms per letter. 18 letters lands well before the exit. */
const TYPE_STEP_MS = 58;
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
  /** How many letters of the tagline have been typed so far. */
  const [typed, setTyped] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Type the tagline out one letter at a time. 18 cheap state updates
  // total, not per-frame work.
  useEffect(() => {
    if (reduced) return;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        setTyped((n) => {
          if (n >= TAGLINE.length) {
            window.clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, TYPE_STEP_MS);
    }, TAGLINE_AT_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [reduced]);

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
        <p className="font-body text-sm font-500 uppercase tracking-[0.3em] text-silk sm:text-base">
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

          {/*
            Typed out letter by letter with a blinking caret. Clearly
            readable rather than caption-sized, with space above it to
            breathe under the logo animation.
          */}
          <p
            className="mt-6 flex items-center font-body text-sm font-500 uppercase tracking-[0.3em] text-silk sm:text-base"
            aria-label={TAGLINE}
          >
            <span aria-hidden="true">{TAGLINE.slice(0, typed)}</span>
            <span
              aria-hidden="true"
              className={`ml-1 inline-block h-[1.05em] w-[2px] bg-silk/90 ${
                typed > 0 ? "animate-caret" : "opacity-0"
              }`}
            />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
