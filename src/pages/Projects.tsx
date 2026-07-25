import { motion, useReducedMotion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Reveal, SILK_EASE } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
/*
 * Swap this file for the real Ekaton screenshot, same path and name.
 * The current image is an on-brand placeholder.
 */
import ekatonPreview from "../assets/ekaton-preview.png";

const PROGRESS = 80;

const TAGS = ["Anonymous chat", "Web app", "In progress"];

export function Projects() {
  const reduced = useReducedMotion();

  return (
    <PageTransition>
      <section className="bg-silk relative min-h-screen overflow-hidden pb-24 pt-36 sm:pb-32">
        {/* Blend down toward the dark footer, no seam. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#05070f]"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Projects"
            title="What we're *building.*"
            lead="One project so far, still in progress. More is on the way."
          />

          {/* ---------- Featured: Ekaton ---------- */}
          <article className="mt-16 grid grid-cols-1 items-center gap-12 lg:mt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal y={28}>
              <figure className="overflow-hidden rounded-2xl bg-white/[0.04] p-2 shadow-[0_40px_100px_-30px_rgba(3,5,11,0.85)] backdrop-blur-sm">
                <img
                  src={ekatonPreview}
                  alt="The Ekaton home screen, showing an anonymous chat entry point for students."
                  width={1256}
                  height={884}
                  loading="lazy"
                  className="w-full rounded-xl"
                />
              </figure>
            </Reveal>

            <div>
              <Reveal delay={0.06}>
                <p className="font-body text-xs font-600 uppercase tracking-[0.28em] text-lightblue">
                  Our first project
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h3 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-700 leading-[1.05] tracking-display text-white">
                  Ekaton
                </h3>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                  An anonymous communication platform. Real conversations that
                  connect students, with no profiles and no pressure. We're
                  building it mostly to learn how GitHub collaboration works as
                  a team.
                </p>
              </Reveal>

              {/* Progress */}
              <Reveal delay={0.18}>
                <div className="mt-8 max-w-sm">
                  <div className="flex items-baseline justify-between">
                    <span className="font-body text-xs font-600 uppercase tracking-[0.2em] text-silk">
                      In progress
                    </span>
                    <span className="font-display text-sm font-600 text-sky">
                      {PROGRESS}%
                    </span>
                  </div>
                  {/*
                    The in-view trigger lives on the track, not the fill.
                    The fill starts at scaleX(0), and a zero-width element
                    has no intersection area, so observing it directly
                    would never fire.
                  */}
                  <motion.div
                    className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-valuenow={PROGRESS}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Ekaton completion"
                    initial={reduced ? "visible" : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-electric"
                      style={{ transformOrigin: "left" }}
                      variants={{
                        hidden: { scaleX: 0 },
                        visible: {
                          scaleX: PROGRESS / 100,
                          transition: { duration: 0.75, ease: [...SILK_EASE] },
                        },
                      }}
                    />
                  </motion.div>
                </div>
              </Reveal>

              {/* Tags */}
              <Reveal delay={0.22}>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-500 text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </article>

        </div>
      </section>
    </PageTransition>
  );
}
