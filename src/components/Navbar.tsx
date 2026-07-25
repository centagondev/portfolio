import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Lockup } from "./Logo";
import { SILK_EASE } from "./ui/Reveal";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen glass overlay menu. Fixed above ALL content, large
 * centered links, animated open/close, Esc to dismiss, focus moved
 * inside while open.
 */
function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Esc closes; focus moves to the close button on open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[95] flex flex-col bg-deep/95 backdrop-blur-2xl md:hidden"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: [...SILK_EASE] }}
        >
          {/* Menu header: logo + close, mirrors the navbar */}
          <div className="flex h-[72px] items-center justify-between px-5">
            <Lockup className="h-6 w-auto" />
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-white/40"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          {/* Large, centered, high-contrast links */}
          <nav
            className="flex flex-1 flex-col items-center justify-center gap-2 pb-16"
            aria-label="Mobile"
          >
            {LINKS.map((link, i) => (
              <motion.div
                key={link.to}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + i * 0.06,
                  duration: 0.35,
                  ease: [...SILK_EASE],
                }}
              >
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-8 py-3 text-center font-display text-4xl font-600 tracking-display transition-colors duration-300 ${
                      isActive ? "text-silk" : "text-white hover:text-silk"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Frosted-glass navbar, shared by all routes. Official logo left,
 * three uppercase wide-tracked links right — no CTA button. Condenses
 * on scroll; the active route carries a silk underline.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on any route change.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative font-body text-[13px] font-500 uppercase tracking-[0.18em] transition-colors duration-300 ${
      isActive ? "text-white" : "text-muted hover:text-white"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-[22px] backdrop-saturate-[1.4] transition-[background-color,box-shadow] duration-300 ease-silk ${
          scrolled
            ? "bg-[rgba(5,7,15,0.72)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_48px_rgba(3,5,11,0.55)]"
            : "bg-[rgba(5,7,15,0.55)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_32px_rgba(3,5,11,0.35)]"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 ease-silk sm:px-8 ${
            scrolled ? "h-[60px]" : "h-[72px]"
          }`}
          aria-label="Main"
        >
          <Link to="/" className="shrink-0" aria-label="Centagon home">
            <Lockup className="h-7 w-auto sm:h-8" />
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === "/"} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-1.5 left-0 h-px bg-silk transition-all duration-300 ease-silk ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open menu"
          >
            <span className="h-px w-6 bg-white" />
            <span className="h-px w-6 bg-white" />
          </button>
        </nav>
      </header>
      {/*
        Outside the header on purpose: the header's backdrop-filter
        creates a containing block, which would trap this fixed
        overlay inside the 72px bar.
      */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
