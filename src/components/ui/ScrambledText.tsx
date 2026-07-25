import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

interface ScrambledTextProps {
  children: string;
  /** Cursor influence radius in px. */
  radius?: number;
  /** Scramble duration at the cursor (scaled down with distance). */
  duration?: number;
  /** ScrambleTextPlugin speed. */
  speed?: number;
  /** Glyphs cycled through while scrambling. */
  scrambleChars?: string;
  /** Applied to the <p> so it keeps its own type, colour, and position. */
  className?: string;
}

/**
 * React Bits' ScrambledText effect (GSAP SplitText + ScrambleTextPlugin):
 * characters near the cursor scramble and resolve back to the real text.
 *
 * Two deliberate departures from the reference implementation:
 *
 * 1. It reads `getBoundingClientRect()` for EVERY character on EVERY
 *    pointermove. At ~190 chars that is ~190 forced layouts per event —
 *    the exact thrash pattern that made the hero feel laggy. Here the
 *    character centres are measured once and cached (invalidated on
 *    resize / font load), and pointer events only stash coordinates for
 *    a single rAF loop to consume.
 * 2. Each character's natural width is locked before scrambling starts.
 *    Swapping a wide glyph for "." or ":" would otherwise reflow the
 *    paragraph on every frame — the reference hides this by forcing a
 *    monospace font, which we must not do here.
 *
 * No `.text-block` demo styling: the paragraph keeps the caller's classes.
 */
export function ScrambledText({
  children,
  radius = 30,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className,
}: ScrambledTextProps) {
  const reduced = usePrefersReducedMotion();
  const pRef = useRef<HTMLParagraphElement>(null);
  const chars = useRef<HTMLElement[]>([]);
  /** Character centres, paragraph-relative, flat [x0,y0,x1,y1,…]. */
  const centers = useRef(new Float32Array(0));
  /** 1 while a character is mid-scramble, so we never re-fire it. */
  const busy = useRef(new Uint8Array(0));
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const raf = useRef(0);

  const measure = useCallback(() => {
    const el = pRef.current;
    if (!el || !chars.current.length) return;
    const r = el.getBoundingClientRect();
    const n = chars.current.length;
    if (centers.current.length !== n * 2) {
      centers.current = new Float32Array(n * 2);
      busy.current = new Uint8Array(n);
    }
    for (let i = 0; i < n; i++) {
      const c = chars.current[i].getBoundingClientRect();
      centers.current[i * 2] = c.left - r.left + c.width / 2;
      centers.current[i * 2 + 1] = c.top - r.top + c.height / 2;
    }
  }, []);

  const frame = useCallback(() => {
    const { x, y, inside } = pointer.current;
    if (inside) {
      const cs = centers.current;
      for (let i = 0; i < chars.current.length; i++) {
        if (busy.current[i]) continue;
        const dx = x - cs[i * 2];
        const dy = y - cs[i * 2 + 1];
        const dist = Math.hypot(dx, dy);
        if (dist >= radius) continue;

        const el = chars.current[i];
        busy.current[i] = 1;
        gsap.to(el, {
          overwrite: true,
          // Closer to the cursor scrambles for longer.
          duration: Math.max(0.25, duration * (1 - dist / radius)),
          ease: "none",
          scrambleText: {
            text: el.dataset.content ?? "",
            chars: scrambleChars,
            speed,
          },
          onComplete: () => {
            busy.current[i] = 0;
          },
        });
      }
    }
    raf.current = pointer.current.inside ? requestAnimationFrame(frame) : 0;
  }, [radius, duration, speed, scrambleChars]);

  useEffect(() => {
    if (reduced) return;
    const el = pRef.current;
    if (!el) return;

    let split: SplitText | null = null;
    let cancelled = false;

    /** Pin each glyph's natural width so scrambling can't reflow text. */
    const lockWidths = () => {
      for (const c of chars.current) {
        c.style.width = "";
        const w = c.getBoundingClientRect().width;
        c.style.display = "inline-block";
        c.style.width = `${w}px`;
      }
    };

    /* "words,chars" — not "chars" alone. Splitting to bare characters
       makes every letter an inline-block, so the browser may break a
       line between any two letters ("AI-powe|red"). Wrapping words
       keeps line breaks at word boundaries, as normal text. */
    split = SplitText.create(el, { type: "words,chars" });
    chars.current = (split.chars as HTMLElement[]) ?? [];
    for (const c of chars.current) c.dataset.content = c.textContent ?? "";
    lockWidths();
    measure();

    /* Split immediately (above) so hovering works from the first frame,
       then re-lock once the real font face is in — glyph widths differ
       between the fallback and Inter. */
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {
        if (cancelled || !chars.current.length) return;
        lockWidths();
        measure();
      });
    }

    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
      for (const c of chars.current) gsap.killTweensOf(c);
      split?.revert();
      chars.current = [];
    };
  }, [reduced, measure]);

  /**
   * Re-measure character geometry whenever interaction begins, so the
   * effect can't be thrown off by anything that moved the paragraph
   * since mount (the page-transition transform, fonts, images, the
   * code window growing beside it). 126 reads once per enter is cheap.
   */
  const onPointerEnter = () => {
    if (reduced) return;
    measure();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || !chars.current.length) return;
    /* Read the paragraph's own box fresh every move: ONE rect read per
       event. Caching it across events is what broke this — the page
       transition shifts <main> by 14px with no scroll to invalidate a
       cached rect, which at radius 30 is enough to kill every hit. */
    const r = pRef.current?.getBoundingClientRect();
    if (!r) return;
    pointer.current.x = e.clientX - r.left;
    pointer.current.y = e.clientY - r.top;
    pointer.current.inside = true;
    if (!raf.current) raf.current = requestAnimationFrame(frame);
  };

  const onPointerLeave = () => {
    pointer.current.inside = false;
  };

  return (
    <p
      ref={pRef}
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </p>
  );
}
