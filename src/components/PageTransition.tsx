import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { SILK_EASE } from "./ui/Reveal";

/** Quick fade/slide shared by all route changes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <main>{children}</main>;

  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [...SILK_EASE] }}
    >
      {children}
    </motion.main>
  );
}
