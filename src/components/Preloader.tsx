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

/** 1x1 black GIF, used as the video poster so nothing white can flash. */
const BLACK_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

interface PreloaderProps {
  onDone: () => void;
}

/**
 * Black intro built around the OFFICIAL Centagon logo animation.
 *
 * iOS/Safari note: Safari cannot decode alpha-channel VP9 WebM, so the
 * earlier build fell through to an H.264 file that still carried the
 * animation's original light-grey backdrop. That is what showed up as a
 * "white screen" on iPhone. The video is now a single H.264 MP4
 * composited onto solid black, which every browser can play and which
 * looks identical over this black screen, so no alpha is needed at all.
 *
 * "Every Side Matters" types out beneath it, then the screen scales
 * open and dissolves into Home. First load only, skippable;
 * reduced-motion shows the static logo instead.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const reduced = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  /** How many letters of the tagline have been typed so far. */
  const [typed, setTyped] = useState(0);
  /** Video refused to play: show the static logo, never a blank screen. */
  const [videoFailed, setVideoFailed] = useState(false);
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

  /*
   * iOS can reject autoplay silently, without firing an `error` event
   * (low power mode, for instance). Ask explicitly and fall back to the
   * static logo if the promise rejects, so nobody sees an empty screen.
   */
  useEffect(() => {
    if (reduced) return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => setVideoFailed(true));
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
          {videoFailed ? (
            /* Never a blank screen: the official logo, centred on black. */
            <img
              src={lockupPng}
              alt="Centagon"
              className="h-10 w-auto sm:h-12"
            />
          ) : (
            /*
             * One black-background H.264 source, playable everywhere.
             * `muted` + `playsInline` (and the legacy webkit variant) are
             * what allow iOS to autoplay inline rather than going
             * fullscreen or refusing outright.
             */
            <video
              ref={videoRef}
              autoPlay
              muted
              loop={false}
              playsInline
              preload="auto"
              disablePictureInPicture
              {...{ "webkit-playsinline": "true" }}
              onEnded={() => setLeaving(true)}
              onError={() => setVideoFailed(true)}
              className="h-64 w-auto sm:h-80"
              /*
               * Black poster + inline black background: belt and braces so
               * that even while the file buffers, or if a browser paints a
               * default backdrop behind the frame, what shows is black
               * rather than the white iOS was rendering.
               */
              poster={BLACK_PIXEL}
              style={{ backgroundColor: "#000" }}
              aria-hidden="true"
            >
              <source src="/brand/centagon-logo-intro.mp4" type="video/mp4" />
            </video>
          )}

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
