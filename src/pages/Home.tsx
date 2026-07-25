import { motion, useReducedMotion } from "framer-motion";
import { AnimatedText } from "../components/ui/AnimatedText";
import { Button } from "../components/ui/Button";
import { CodeWindow, type Token } from "../components/ui/CodeWindow";
import { Reveal, SILK_EASE } from "../components/ui/Reveal";
import { ScrambledText } from "../components/ui/ScrambledText";
import { PageTransition } from "../components/PageTransition";

/* The hero snippet — the team and its values, as code. Tokenized by
   hand so the typing animation keeps syntax colors correct mid-word. */
const SNIPPET: Token[][] = [
  [{ t: "// centagon — every side matters", c: "comment" }],
  [
    { t: "const", c: "keyword" },
    { t: " team " },
    { t: "= {", c: "punct" },
  ],
  [
    { t: "  " },
    { t: "curiosity", c: "prop" },
    { t: ": (", c: "punct" },
    { t: "p" },
    { t: ": ", c: "punct" },
    { t: "Problem", c: "type" },
    { t: ") => ", c: "punct" },
    { t: "explore", c: "fn" },
    { t: "(", c: "punct" },
    { t: "p" },
    { t: "),", c: "punct" },
  ],
  [
    { t: "  " },
    { t: "collaboration", c: "prop" },
    { t: ": (", c: "punct" },
    { t: "w" },
    { t: ") => ", c: "punct" },
    { t: "buildTogether", c: "fn" },
    { t: "(", c: "punct" },
    { t: "w" },
    { t: "),", c: "punct" },
  ],
  [
    { t: "  " },
    { t: "creation", c: "prop" },
    { t: ": (", c: "punct" },
    { t: "w" },
    { t: ") => ", c: "punct" },
    { t: "ship", c: "fn" },
    { t: "(", c: "punct" },
    { t: "w" },
    { t: "),", c: "punct" },
  ],
  [{ t: "};", c: "punct" }],
  [{ t: "" }],
  [
    { t: "export function", c: "keyword" },
    { t: " " },
    { t: "centagon", c: "fn" },
    { t: "(", c: "punct" },
    { t: "problem" },
    { t: ": ", c: "punct" },
    { t: "Problem", c: "type" },
    { t: "): ", c: "punct" },
    { t: "Product", c: "type" },
    { t: " {", c: "punct" },
  ],
  [
    { t: "  " },
    { t: "return", c: "keyword" },
    { t: " " },
    { t: "pipeline", c: "fn" },
    { t: "(", c: "punct" },
    { t: "problem" },
    { t: ", ", c: "punct" },
    { t: "team" },
    { t: ")", c: "punct" },
    { t: "      " },
    { t: "// curiosity → collaboration → creation", c: "comment" },
  ],
  [
    { t: "    " },
    { t: ".", c: "punct" },
    { t: "review", c: "fn" },
    { t: "({ ", c: "punct" },
    { t: "everySide", c: "prop" },
    { t: ": ", c: "punct" },
    { t: "true", c: "keyword" },
    { t: " })", c: "punct" },
    { t: "      " },
    { t: "// code, design, performance, security", c: "comment" },
  ],
  [
    { t: "    " },
    { t: ".", c: "punct" },
    { t: "deliver", c: "fn" },
    { t: "({ ", c: "punct" },
    { t: "effort", c: "prop" },
    { t: ": ", c: "punct" },
    { t: "1.0", c: "num" },
    { t: " });", c: "punct" },
    { t: "     " },
    { t: "// 100% on every side", c: "comment" },
  ],
  [{ t: "}", c: "punct" }],
];

const VALUES = [
  {
    title: "Curiosity",
    body: "We ask, explore, and learn before we build.",
  },
  {
    title: "Collaboration",
    body: "We build together, with each other and with clients.",
  },
  {
    title: "Creation",
    body: "We make real, working things.",
  },
  {
    title: "Every Side Matters",
    body: "We put 100% into every detail: code, design, performance, security.",
    accent: true,
  },
  {
    title: "Impact over quantity",
    body: "We'd rather build a few things that genuinely matter than many that don't. Depth and outcomes over output.",
  },
];

export function Home() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45, ease: [...SILK_EASE] },
        };

  return (
    <PageTransition>
      {/* Hero — the BRIGHT two-tone blue-silk surface. */}
      <section className="bg-silk relative overflow-hidden">
        {/* Smooth blend down into the dark values surface — no seam. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#05070f]"
        />
        <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-24">
          <div className="max-w-xl">
            <motion.p
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-silk/20 bg-white/5 px-4 py-1.5 font-body text-xs font-500 uppercase tracking-[0.24em] text-silk"
              {...fadeUp(0.05)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
              Software engineering studio
            </motion.p>

            <AnimatedText
              as="h1"
              text="We build software where *every side matters.*"
              delay={0.15}
              magneticLetters
              className="font-display text-[clamp(2.6rem,6vw,4.4rem)] font-700 leading-[1.05] tracking-display text-white"
            />

            {/* Same type, size, colour and position as before — the
                ScrambledText wrapper only adds the hover behaviour. */}
            <motion.div className="mt-6" {...fadeUp(0.5)}>
              <ScrambledText
                radius={30}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
                className="max-w-md text-base leading-relaxed text-muted sm:text-lg"
              >
                Centagon is a software engineering studio building digital
                products, scalable web applications, AI-powered solutions, and
                enterprise software.
              </ScrambledText>
            </motion.div>

            <motion.div className="mt-9" {...fadeUp(0.65)}>
              <Button href="mailto:centagontech@gmail.com">Contact us</Button>
            </motion.div>
          </div>

          {/* The team's values, written live — a deliberate typing pace. */}
          <CodeWindow
            filename="centagon.ts"
            lines={SNIPPET}
            className="w-full max-w-xl justify-self-center lg:justify-self-end"
          />
        </div>
      </section>

      {/* Values — sticky editorial section: the heading stays pinned
          while each value gets its own tall, spacious moment. */}
      <section className="relative bg-gradient-to-b from-[#05070f] to-[#070b16] py-24 sm:py-28 lg:py-32">
        <div
          aria-hidden="true"
          className="dots pointer-events-none absolute inset-0 opacity-30"
          style={{
            maskImage: "radial-gradient(65% 65% at 25% 15%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(65% 65% at 25% 15%, black, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          {/* Pinned intro */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <Reveal>
              <p className="mb-5 font-body text-xs font-600 uppercase tracking-[0.28em] text-lightblue">
                What we stand for
              </p>
            </Reveal>
            <AnimatedText
              as="h2"
              onView
              text="Five values. *One standard.*"
              className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-700 leading-[1.08] tracking-display text-white"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
                A hundred sides, all held to the same standard. These five
                shape how we work on every project.
              </p>
            </Reveal>
          </div>

          {/* The values scroll past, one editorial row at a time.
              The in-view trigger lives on the (unclipped) row — the
              masked title would never intersect on its own. */}
          <div className="mt-20 lg:mt-0">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                className="relative py-16 pl-8 sm:py-20 lg:py-24"
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "visible"}
                viewport={{ once: true, amount: 0.35 }}
              >
                {/* Thin electric accent line grows in beside the active value. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-10 left-0 top-10 w-px origin-top bg-electric"
                  variants={{
                    hidden: { scaleY: 0 },
                    visible: {
                      scaleY: 1,
                      transition: { duration: 0.5, ease: [...SILK_EASE] },
                    },
                  }}
                />

                {/* Oversized ghosted number behind the text. */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 left-2 select-none font-display text-[clamp(7rem,13vw,11rem)] font-700 leading-none tracking-display text-silk/10 sm:-top-4"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [...SILK_EASE] },
                    },
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>

                <div className="relative">
                  <span className="font-display text-sm font-600 text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="block overflow-hidden pt-3">
                    <motion.h3
                      className={`font-display text-[clamp(2rem,4vw,3.2rem)] font-700 leading-[1.05] tracking-display ${
                        value.accent ? "text-silk" : "text-white"
                      }`}
                      variants={{
                        hidden: { y: "108%" },
                        visible: {
                          y: "0%",
                          transition: { duration: 0.5, ease: [...SILK_EASE] },
                        },
                      }}
                    >
                      {value.title}
                    </motion.h3>
                  </span>
                  <motion.p
                    className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg"
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.45,
                          delay: 0.12,
                          ease: [...SILK_EASE],
                        },
                      },
                    }}
                  >
                    {value.body}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
