import { AnimatedText } from "./AnimatedText";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  /** Editorial section number — "01", "02"… part of the site's signature. */
  index?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  index,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`max-w-4xl ${centered ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <p
          className={`mb-5 flex items-baseline gap-3 font-body text-xs font-600 uppercase tracking-[0.28em] text-lightblue ${
            centered ? "justify-center" : ""
          }`}
        >
          {index ? (
            <span className="font-display text-sm font-600 tracking-normal text-electric">
              {index}
            </span>
          ) : null}
          {index ? <span className="h-px w-8 self-center bg-silk/25" /> : null}
          {eyebrow}
        </p>
      </Reveal>
      <AnimatedText
        as="h2"
        onView
        text={title}
        className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-600 leading-[1.05] tracking-display text-white"
      />
      {lead ? (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
