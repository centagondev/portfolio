import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

const MotionLink = motion.create(Link);

interface ButtonProps {
  children: ReactNode;
  /** External or anchor href. */
  href?: string;
  /** Internal route — renders a client-side <Link>. */
  to?: string;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}

/**
 * Primary: white pill that lifts with a soft electric glow.
 * Ghost: hairline pill whose arrow nudges forward on hover.
 * Both have a subtle magnetic pull toward the cursor.
 */
export function Button({
  children,
  href,
  to,
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 300, damping: 22, mass: 0.5 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-body text-sm font-600 transition-[box-shadow,background-color,border-color,color] duration-300 ease-silk";
  const styles =
    variant === "primary"
      ? "bg-white text-deep hover:shadow-[0_8px_40px_-8px_rgba(53,113,255,0.65)]"
      : "border border-silk/25 text-white hover:border-silk/60 hover:bg-white/5";

  const content =
    variant === "ghost" ? (
      <>
        <span>{children}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 ease-silk group-hover:translate-x-1"
        >
          →
        </span>
      </>
    ) : (
      children
    );

  const motionProps = reduced
    ? {}
    : {
        style: { x, y },
        whileHover: { y: -2 },
        whileTap: { scale: 0.97 },
        onMouseMove,
        onMouseLeave,
      };

  if (to) {
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        onClick={onClick}
        className={`${base} ${styles} ${className}`}
        {...motionProps}
      >
        {content}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={`${base} ${styles} ${className}`}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
