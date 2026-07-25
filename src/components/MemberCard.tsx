import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { SILK_EASE } from "./ui/Reveal";

export interface Member {
  name: string;
  role: "Frontend Developer" | "Backend Developer";
  stack: string[];
  /** pravatar image number (1–70). */
  img: number;
}

interface MemberCardProps {
  member: Member;
  index: number;
}

/** Gradient + initials shown while the avatar loads (or if it fails). */
function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Team "box" — the page's signature scroll animation: each card rises,
 * fades, and settles with a quick column stagger as the grid
 * assembles. Hover lifts it with an electric border glow.
 */
export function MemberCard({ member, index }: MemberCardProps) {
  const reduced = useReducedMotion();
  const [imgOk, setImgOk] = useState(true);

  const anim = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 26, scale: 0.96 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.2, margin: "0px 0px -8% 0px" },
        transition: {
          duration: 0.4,
          delay: (index % 4) * 0.06,
          ease: [...SILK_EASE],
        },
      };

  return (
    <motion.article
      {...anim}
      className="group rounded-xl bg-white/[0.04] p-4 transition-[transform,box-shadow,background-color] duration-300 ease-silk hover:-translate-y-1.5 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-20px_rgba(53,113,255,0.4)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-navy-2 to-navy-1">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-display text-3xl font-600 text-silk/50"
        >
          {initials(member.name)}
        </span>
        {imgOk && (
          <img
            src={`https://i.pravatar.cc/300?img=${member.img}`}
            alt={`Portrait of ${member.name}`}
            loading="lazy"
            width={300}
            height={300}
            onError={() => setImgOk(false)}
            className="relative h-full w-full object-cover transition-transform duration-500 ease-silk group-hover:scale-105"
          />
        )}
      </div>

      <h3 className="mt-4 font-display text-base font-600 tracking-display text-white">
        {member.name}
      </h3>
      <p className="mt-0.5 text-xs text-silk/80">{member.role}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {member.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-navy-1/80 px-2 py-0.5 text-[10.5px] font-500 text-muted transition-colors duration-300 group-hover:text-sky"
          >
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
