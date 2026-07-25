import { PageTransition } from "../components/PageTransition";
import { AnimatedText } from "../components/ui/AnimatedText";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";

/* ===========================================================
 * TEAM GALLERY — TEMPORARILY DISABLED (no real member photos yet)
 *
 * To re-enable, uncomment:
 *   1. these two imports,
 *   2. the MEMBERS array below,
 *   3. the <section> at the bottom of this file.
 * TeamGallery.tsx and MemberCard.tsx are untouched and still work.
 *
 * import { type Member } from "../components/MemberCard";
 * import { TeamGallery } from "../components/TeamGallery";
 * =========================================================== */

const WHY = [
  {
    title: "Engineering-first quality",
    body: "Senior engineers on every project, from architecture to the last commit. No hand-offs to a B-team.",
  },
  {
    title: "Every side matters",
    body: "Equal care for code, design, performance, and security. The parts you never see are built just as well.",
  },
  {
    title: "Built to scale and maintain",
    body: "Typed, tested, documented systems your own team can grow. Not a black box you rent from us forever.",
  },
  {
    title: "Transparent partnership",
    body: "Short feedback loops, honest estimates, working software every week. You always know where things stand.",
  },
];

/* Demo members, kept ready for when the real photos land.
 *
 * const MEMBERS: Member[] = [
 *   { name: "Alex Rivera", role: "Frontend Developer", stack: ["React", "TypeScript", "Tailwind"], img: 11 },
 *   { name: "Maya Chen", role: "Backend Developer", stack: ["Node.js", "PostgreSQL", "Redis"], img: 47 },
 *   { name: "Jonas Weber", role: "Backend Developer", stack: ["Go", "gRPC", "Kubernetes"], img: 12 },
 *   { name: "Sofia Marino", role: "Frontend Developer", stack: ["React", "Next.js", "Framer Motion"], img: 45 },
 *   { name: "Daniel Osei", role: "Backend Developer", stack: ["Python", "FastAPI", "PostgreSQL"], img: 13 },
 *   { name: "Lena Kovač", role: "Frontend Developer", stack: ["TypeScript", "Vue", "Vite"], img: 44 },
 *   { name: "Ravi Patel", role: "Backend Developer", stack: ["Node.js", "GraphQL", "MongoDB"], img: 14 },
 *   { name: "Clara Duval", role: "Frontend Developer", stack: ["React", "Three.js", "GSAP"], img: 49 },
 *   { name: "Tomás Silva", role: "Backend Developer", stack: ["Rust", "Kafka", "ClickHouse"], img: 15 },
 *   { name: "Nina Petrova", role: "Frontend Developer", stack: ["React", "TypeScript", "Storybook"], img: 41 },
 *   { name: "Omar Haddad", role: "Backend Developer", stack: ["Python", "Django", "AWS"], img: 17 },
 *   { name: "Emma Lindqvist", role: "Frontend Developer", stack: ["Svelte", "TypeScript", "CSS"], img: 43 },
 * ];
 */

export function About() {
  return (
    <PageTransition>
      {/* The whole About page sits on the DARK navy surface: calm deep
          navy with only a faint dotted-grid texture and a blue hint. */}
      <div className="relative bg-gradient-to-b from-[#05070f] via-[#070b16] to-[#05070f]">
        <div
          aria-hidden="true"
          className="dots pointer-events-none absolute inset-0 opacity-25"
          style={{
            maskImage:
              "radial-gradient(80% 60% at 60% 20%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(80% 60% at 60% 20%, black, transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-navy-2/20 blur-3xl"
        />

      {/* Who we are */}
      <section className="relative pb-24 pt-36 sm:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="About"
            title="What is *Centagon?*"
            lead="A software engineering studio that turns ideas into reliable, secure, future-ready software."
          />

          <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 text-base leading-relaxed text-muted sm:text-lg">
            <Reveal>
              <p>
                Centagon builds digital products, scalable web applications,
                AI-powered solutions, and enterprise systems. We take on the
                whole job, from the first sketch of an idea to software running
                in production, and all the changes that come after.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                Our name is our method. A centagon has a hundred sides. From a
                distance it looks like a circle, but every side is still its
                own straight, deliberate line. That's how we treat software.
                Engineering care and thoughtful design go into every part of
                it, including the parts nobody sees.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Centagon — clean typography, no cards. */}
      <section className="relative py-24 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="mb-5 font-body text-xs font-600 uppercase tracking-[0.28em] text-lightblue">
              Why Centagon
            </p>
          </Reveal>
          <AnimatedText
            as="h2"
            onView
            text="Chosen for the sides *others skip.*"
            className="max-w-2xl font-display text-[clamp(1.9rem,4vw,3rem)] font-700 leading-[1.1] tracking-display text-white"
          />

          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
            {WHY.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.06}>
                <div className="grid grid-cols-[auto_1fr] gap-x-6">
                  <p className="font-display text-sm font-600 leading-[1.9] text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-600 tracking-display text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
        * THE TEAM — horizontal-scroll gallery. DISABLED for now until
        * we have real member photos. Uncomment this block (plus the
        * imports and MEMBERS array at the top of this file) to restore
        * it exactly as it was.
        *
        * <section className="relative py-12 sm:py-16">
        *   <TeamGallery
        *     members={MEMBERS}
        *     header={
        *       <SectionHeading
        *         eyebrow="Team"
        *         title="The people *behind Centagon.*"
        *         lead="Twelve engineers, one standard. Demo profiles for now, real faces are on the way."
        *       />
        *     }
        *   />
        * </section>
        * ========================================================== */}
      </div>
    </PageTransition>
  );
}
