import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { SILK_EASE } from "./Reveal";

/* Syntax colors tuned to the blue theme. */
export const T: Record<string, string> = {
  comment: "text-muted/50 italic",
  keyword: "text-lightblue",
  fn: "text-sky",
  string: "text-silk",
  type: "text-[#7ee3c3]",
  punct: "text-muted/80",
  plain: "text-white/90",
  prop: "text-[#c9b8ff]",
  num: "text-[#f2c98f]",
};

/** One colored fragment of a code line. */
export interface Token {
  t: string;
  c?: keyof typeof T | string;
}

interface CodeWindowProps {
  filename: string;
  lines: Token[][];
  className?: string;
  /** Typing pace, characters per second. */
  speed?: number;
  /** Seconds before typing starts once in view. */
  startDelay?: number;
}

/**
 * Glassy editor window that TYPES its code out — character by
 * character at a deliberate, readable pace, syntax colors intact as it
 * writes, caret blinking at the insertion point. Starts when it enters
 * view; renders instantly under prefers-reduced-motion.
 */
export function CodeWindow({
  filename,
  lines,
  className = "",
  speed = 42,
  startDelay = 0.7,
}: CodeWindowProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const lineLengths = useMemo(
    () => lines.map((line) => line.reduce((n, tok) => n + tok.t.length, 0)),
    [lines]
  );
  const total = useMemo(
    () => lineLengths.reduce((n, len) => n + len + 1, 0),
    [lineLengths]
  );

  const [count, setCount] = useState(0);
  const done = count >= total;

  useEffect(() => {
    if (reduced) {
      setCount(total);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now + startDelay * 1000;
      const elapsed = Math.max(0, (now - start) / 1000);
      const next = Math.min(total, Math.floor(elapsed * speed));
      setCount((c) => (next !== c ? next : c));
      if (next < total) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, speed, startDelay, total]);

  // Which line holds the caret right now?
  let caretLine = lines.length - 1;
  {
    let consumed = 0;
    for (let i = 0; i < lines.length; i++) {
      if (count < consumed + lineLengths[i] + 1) {
        caretLine = i;
        break;
      }
      consumed += lineLengths[i] + 1;
    }
  }

  let consumed = 0;

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [...SILK_EASE] }}
      className={`rounded-2xl border border-hairline bg-navy-1/60 shadow-[0_40px_100px_-30px_rgba(3,5,11,0.9)] backdrop-blur-xl ${className}`}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-hairline px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-body text-xs text-muted/60">{filename}</span>
      </div>

      <div className="overflow-x-auto p-5 sm:p-6">
        <pre className="font-mono text-[12.5px] leading-[1.7] sm:text-[13px]">
          <code>
            {lines.map((line, i) => {
              const local = Math.max(
                0,
                Math.min(lineLengths[i], count - consumed)
              );
              consumed += lineLengths[i] + 1;

              let used = 0;
              const showCaret = i === caretLine && (inView || reduced);

              return (
                <span key={i} className="flex min-h-[1.7em]">
                  <span className="mr-5 w-5 select-none text-right text-muted/30">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {line.map((tok, j) => {
                      const take = Math.max(
                        0,
                        Math.min(tok.t.length, local - used)
                      );
                      used += tok.t.length;
                      if (take === 0) return null;
                      return (
                        <span key={j} className={T[tok.c ?? "plain"] ?? tok.c}>
                          {tok.t.slice(0, take)}
                        </span>
                      );
                    })}
                  </span>
                  {showCaret && (
                    <span
                      aria-hidden="true"
                      className={`ml-0.5 inline-block h-[1.15em] w-[7px] self-center bg-silk/80 ${
                        done ? "animate-caret" : ""
                      }`}
                    />
                  )}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
