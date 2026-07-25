import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const SILK_EASE = [0.2, 0.7, 0.2, 1] as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay — use to stagger siblings. */
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  duration?: number;
  className?: string;
  /** Portion of the element that must be visible before it animates. */
  amount?: number;
}

/**
 * Scroll reveal: rises and fades in once when it enters the viewport.
 * Collapses to a plain wrapper under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  duration = 0.45,
  className,
  amount = 0.2,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // Fires when the element crosses ~92% of the viewport — early and
      // reliable, so nothing sits invisible waiting for a late trigger.
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: [...SILK_EASE] }}
    >
      {children}
    </motion.div>
  );
}
