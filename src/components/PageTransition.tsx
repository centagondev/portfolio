import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { SILK_EASE } from "./ui/Reveal";

/**
 * Route change motion. Because <AnimatePresence mode="wait"> plays the
 * old page out before the new one in, the two durations add up. Keeping
 * the exit short and the entrance modest lands the whole change at
 * roughly a quarter second, so tapping a link feels immediate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <main>{children}</main>;

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.22,
        ease: [...SILK_EASE],
        exit: { duration: 0.1, ease: "linear" },
      }}
    >
      {children}
    </motion.main>
  );
}
