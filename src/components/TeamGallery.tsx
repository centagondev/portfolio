import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getLenis } from "../hooks/useLenis";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { MemberCard, type Member } from "./MemberCard";

/* Left padding that lines the row up with the max-w-7xl container. */
const ALIGN_PAD = "pl-[max(1.25rem,calc((100vw-80rem)/2+2rem))]";

interface TeamGalleryProps {
  members: Member[];
  /** Section heading, kept visible while the gallery is pinned. */
  header?: ReactNode;
}

/**
 * The team as a horizontal-scroll gallery.
 *
 * Desktop: the section pins (sticky) while vertical scroll translates
 * the row sideways — synced with Lenis because it's driven by real
 * scroll position. Click-and-drag also works: horizontal drag is
 * mapped onto the page's scroll, so both inputs share one source of
 * truth and stay buttery. A progress line tracks the journey.
 *
 * Mobile/tablet: a native swipe carousel with scroll-snap — no
 * pinning, which is janky on touch devices.
 */
export function TeamGallery({ members, header }: TeamGalleryProps) {
  const reduced = usePrefersReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure how far the row must translate to show its tail.
  useEffect(() => {
    if (!desktop) return;
    const measure = () => {
      const row = rowRef.current;
      const vp = viewportRef.current;
      if (!row || !vp) return;
      setTravel(Math.max(0, row.scrollWidth - vp.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [desktop, members.length]);

  // Drive the row from the live section rect on each scroll frame —
  // motion values bypass React re-renders, and measuring fresh avoids
  // the stale-offset bugs of cached scroll targets.
  const x = useMotionValue(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!desktop || reduced) return;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      progress.set(p);
      x.set(-p * travel);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [desktop, reduced, travel, x, progress]);

  // Click-and-drag: horizontal drag drives the page scroll, which
  // drives the row — one source of truth, no fighting animations.
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!desktop) return;
    drag.current = { startX: e.clientX, startScroll: window.scrollY };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = drag.current.startX - e.clientX;
    const target = drag.current.startScroll + dx * 1.4;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  /* ------- Mobile / reduced motion: native snap carousel ------- */
  if (!desktop || reduced) {
    return (
      <div>
        {header ? (
          <div className="mx-auto max-w-7xl px-5 sm:px-8">{header}</div>
        ) : null}
        <div
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Team members"
        >
          {members.map((member, i) => (
            <div
              key={member.name}
              role="listitem"
              className="w-[225px] shrink-0 snap-start"
            >
              <MemberCard member={member} index={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ------------- Desktop: pinned horizontal journey ------------- */
  return (
    <div ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header ? (
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{header}</div>
        ) : null}

        <div
          ref={viewportRef}
          className={`mt-12 ${ALIGN_PAD} ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <motion.div
            ref={rowRef}
            style={{ x, willChange: "transform" }}
            // Trailing pad mirrors the leading alignment pad, so the
            // last card fully clears the container edge at journey end.
            className="flex w-max select-none gap-5 pr-[max(1.25rem,calc((100vw-80rem)/2+2rem))]"
            role="list"
            aria-label="Team members"
          >
            {members.map((member, i) => (
              <div key={member.name} role="listitem" className="w-[225px] shrink-0">
                <MemberCard member={member} index={i} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress line + drag hint */}
        <div className={`mt-12 flex items-center gap-6 pr-10 ${ALIGN_PAD}`}>
          <div className="h-px flex-1 bg-white/10">
            <motion.div
              className="h-full origin-left bg-electric"
              style={{ scaleX: progress }}
            />
          </div>
          <p className="shrink-0 font-body text-xs font-500 uppercase tracking-[0.24em] text-muted/60">
            Scroll or drag →
          </p>
        </div>
      </div>
    </div>
  );
}
