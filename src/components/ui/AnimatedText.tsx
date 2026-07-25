import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

/** The site's signature reveal ease. */
const SIGNATURE_EASE = [0.2, 0.75, 0.2, 1] as const;

/* ---- Magnetic-letter tuning (Home hero headline only) ---- */
/** Cursor influence radius in px. */
const INFLUENCE = 120;
/** Peak added scale at the cursor (1 + this). */
const MAX_SCALE = 0.2;
/** Peak upward lift in px. */
const MAX_LIFT = 9;
/**
 * Response rate of the follow. High and critically damped — letters
 * snap to the cursor with no overshoot and no floaty trailing.
 * (~90% of the way in ~95ms, equivalent to a stiff, well-damped spring.)
 */
const RESPONSE = 24;
/** Below this, a letter counts as settled. */
const EPSILON = 0.002;
/** Brightness class thresholds (hysteresis avoids add/remove thrash). */
const LIT_ON = 0.5;
const LIT_OFF = 0.32;

interface AnimatedTextProps {
  /** Plain text; words wrapped in *asterisks* render in the silk accent. */
  text: string;
  className?: string;
  /** Base delay before the first word. */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
  /** Animate on view (scroll) instead of on mount. */
  onView?: boolean;
  /**
   * Split into individual letters that lift and scale as a magnetic
   * wave following the cursor. Reserved for the Home hero headline —
   * the only element on the site with this effect.
   */
  magneticLetters?: boolean;
}

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
  span: motion.span,
} as const;

interface Word {
  word: string;
  accent: boolean;
}

/** Split text into words, tracking *accent* spans. */
function parseWords(text: string): Word[] {
  const words: Word[] = [];
  for (const chunk of text.split(/(\*[^*]+\*)/g)) {
    if (!chunk) continue;
    const accent = chunk.startsWith("*") && chunk.endsWith("*");
    const clean = accent ? chunk.slice(1, -1) : chunk;
    for (const word of clean.split(/\s+/)) {
      if (word) words.push({ word, accent });
    }
  }
  return words;
}

/**
 * The signature reveal: each word rises out from behind a clip mask —
 * the headline is being *set*, not fading in. Used on load in the
 * hero, on scroll-in everywhere else.
 *
 * The visibility trigger lives on the parent tag, not the words:
 * the words start fully clipped by their overflow mask, and a clipped
 * element never intersects, so observing them directly would never
 * fire. Children inherit the parent's variant state instead.
 *
 * With `magneticLetters`, words additionally split into per-letter
 * spans driven by ONE requestAnimationFrame loop that writes
 * `transform` straight to the DOM — no React state, no per-letter
 * spring instances, no per-frame paint. See the loop below.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  onView = false,
  magneticLetters = false,
}: AnimatedTextProps) {
  const reduced = useReducedMotion();
  const words = useMemo(() => parseWords(text), [text]);

  /* Flatten to letters with a stable global index for the wave. */
  const { wordLetters, letterCount, accentFlags } = useMemo(() => {
    let i = 0;
    const flags: boolean[] = [];
    const mapped = words.map((w) => ({
      accent: w.accent,
      letters: Array.from(w.word).map((ch) => {
        flags.push(w.accent);
        return { ch, index: i++ };
      }),
    }));
    return { wordLetters: mapped, letterCount: i, accentFlags: flags };
  }, [words]);

  const magnetic = magneticLetters && !reduced;

  const hostRef = useRef<HTMLElement | null>(null);
  const letterEls = useRef<(HTMLSpanElement | null)[]>([]);
  /** Letter centres, host-relative, as flat [x0,y0,x1,y1,…]. */
  const centers = useRef(new Float32Array(0));
  /** Current per-letter influence, smoothed toward its target. */
  const current = useRef(new Float32Array(0));
  /** Which letters currently carry the brightness class. */
  const lit = useRef(new Uint8Array(0));
  const pointer = useRef({ x: -99999, y: -99999, inside: false });
  const hostRect = useRef<DOMRect | null>(null);
  const rafId = useRef(0);
  const lastT = useRef(0);
  const [revealed, setRevealed] = useState(false);

  /** Cache letter centres and the host's viewport rect (one layout read). */
  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    hostRect.current = rect;
    const n = letterCount;
    if (current.current.length !== n) {
      centers.current = new Float32Array(n * 2);
      current.current = new Float32Array(n);
      lit.current = new Uint8Array(n);
    }
    for (let i = 0; i < n; i++) {
      const el = letterEls.current[i];
      if (!el) {
        centers.current[i * 2] = -99999;
        centers.current[i * 2 + 1] = -99999;
        continue;
      }
      const r = el.getBoundingClientRect();
      centers.current[i * 2] = r.left - rect.left + r.width / 2;
      centers.current[i * 2 + 1] = r.top - rect.top + r.height / 2;
    }
  }, [letterCount]);

  /**
   * The whole effect: one frame loop, transform-only writes.
   * Runs only while something is still moving, then stops itself.
   */
  const frame = useCallback(
    (t: number) => {
      const dt = lastT.current ? Math.min(0.05, (t - lastT.current) / 1000) : 0.016;
      lastT.current = t;

      const { x: px, y: py, inside } = pointer.current;
      const cur = current.current;
      const cs = centers.current;
      const n = cur.length;
      // Critically damped follow — stable at any frame duration.
      const alpha = 1 - Math.exp(-RESPONSE * dt);
      let busy = false;

      for (let i = 0; i < n; i++) {
        let target = 0;
        if (inside) {
          const dx = px - cs[i * 2];
          const dy = py - cs[i * 2 + 1];
          const raw = 1 - Math.hypot(dx, dy) / INFLUENCE;
          if (raw > 0) target = raw * raw * (3 - 2 * raw); // smoothstep
        }

        const prev = cur[i];
        const next = prev + (target - prev) * alpha;
        cur[i] = next;
        if (Math.abs(target - next) > EPSILON || next > EPSILON) busy = true;

        const el = letterEls.current[i];
        if (!el) continue;

        // GPU-only write: no layout, no paint.
        el.style.transform = `translate3d(0,${(-MAX_LIFT * next).toFixed(2)}px,0) scale(${(1 + MAX_SCALE * next).toFixed(4)})`;

        // Brightness is a discrete class + CSS transition, so it never
        // costs a repaint per frame. Accent letters only — white text
        // cannot get brighter than white.
        if (accentFlags[i]) {
          if (!lit.current[i] && next > LIT_ON) {
            el.classList.add("is-lit");
            lit.current[i] = 1;
          } else if (lit.current[i] && next < LIT_OFF) {
            el.classList.remove("is-lit");
            lit.current[i] = 0;
          }
        }
      }

      if (busy) {
        rafId.current = requestAnimationFrame(frame);
      } else {
        // Fully settled: stop the loop and release the layer hints.
        rafId.current = 0;
        lastT.current = 0;
        for (let i = 0; i < n; i++) {
          const el = letterEls.current[i];
          if (el) el.style.willChange = "";
        }
      }
    },
    [accentFlags]
  );

  const kick = useCallback(() => {
    if (rafId.current) return;
    for (const el of letterEls.current) {
      if (el) el.style.willChange = "transform";
    }
    lastT.current = 0;
    rafId.current = requestAnimationFrame(frame);
  }, [frame]);

  useEffect(() => {
    if (!magnetic) return;

    measure();
    // Fonts can shift metrics after first paint.
    document.fonts?.ready.then(measure).catch(() => {});

    // Only the host's viewport position changes on scroll.
    const refreshRect = () => {
      const host = hostRef.current;
      if (host) hostRect.current = host.getBoundingClientRect();
    };
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", measure);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };
  }, [magnetic, measure]);

  // Letters are translated during the reveal — re-measure once it lands.
  useEffect(() => {
    if (magnetic && revealed) measure();
  }, [magnetic, revealed, measure]);

  /* Pointer handlers stay trivial: stash coords, let the loop do the
     work. This decouples event rate (can exceed 120Hz) from frames. */
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = hostRect.current;
    if (!rect) return;
    pointer.current.x = e.clientX - rect.left;
    pointer.current.y = e.clientY - rect.top;
    pointer.current.inside = true;
    kick();
  };

  const onPointerLeave = () => {
    pointer.current.inside = false;
    kick();
  };

  if (reduced) {
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i} className={w.accent ? "text-silk" : undefined}>
            {w.word}{" "}
          </span>
        ))}
      </Tag>
    );
  }

  const MotionTag = MOTION_TAGS[Tag];

  /* Once revealed, the mask must stop clipping or the magnetic lift
     would be cut off at the top of each word. */
  const maskClass = `inline-block pb-[0.08em] align-bottom ${
    magnetic && revealed ? "overflow-visible" : "overflow-hidden"
  }`;

  return (
    <MotionTag
      ref={hostRef as never}
      className={className}
      initial="hidden"
      onPointerMove={magnetic ? onPointerMove : undefined}
      onPointerLeave={magnetic ? onPointerLeave : undefined}
      {...(onView
        ? { whileInView: "visible", viewport: { once: true, amount: 0.4 } }
        : { animate: "visible" })}
      onAnimationComplete={() => setRevealed(true)}
    >
      {wordLetters.map((w, i) => (
        <Fragment key={i}>
          <span className={maskClass}>
            <motion.span
              className={`inline-block will-change-transform ${
                w.accent ? "text-silk" : ""
              }`}
              variants={{
                hidden: { y: "112%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    delay: delay + i * 0.04,
                    ease: [...SIGNATURE_EASE],
                  },
                },
              }}
            >
              {magnetic
                ? w.letters.map(({ ch, index }) => (
                    <span
                      key={index}
                      ref={(el) => {
                        letterEls.current[index] = el;
                      }}
                      // Grows from the baseline so letters rise rather
                      // than bloat into their neighbours.
                      className="magnetic-letter inline-block origin-bottom"
                    >
                      {ch}
                    </span>
                  ))
                : words[i].word}
            </motion.span>
          </span>
          {/* Separator lives OUTSIDE the clipped span — trailing
              whitespace inside an inline-block gets trimmed by CSS. */}
          {i < wordLetters.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
