import { PageTransition } from "../components/PageTransition";
import { ProjectCard, type Project } from "../components/ProjectCard";
import { SectionHeading } from "../components/ui/SectionHeading";

/* Demo projects — swap for real work. */
const PROJECTS: Project[] = [
  {
    title: "Ekaton",
    tag: "Product · Real-time",
    blurb: "Anonymous communication, engineered end-to-end.",
    art: "radial-gradient(120% 120% at 80% 20%, #3571ff 0%, #14315f 45%, #05070f 100%)",
  },
  {
    title: "Helios Treasury",
    tag: "Fintech · Platform",
    blurb: "A settlement engine moving nine figures a day, quietly.",
    art: "radial-gradient(120% 120% at 20% 80%, #5c83cc 0%, #1e4079 50%, #05070f 100%)",
  },
  {
    title: "Arclight Triage",
    tag: "Health · AI",
    blurb: "Clinical intake copilot that clinicians actually kept using.",
    art: "radial-gradient(140% 140% at 70% 90%, #a9c8ef 0%, #14315f 55%, #05070f 100%)",
  },
  {
    title: "Ferrostack Ops",
    tag: "Industrial · Enterprise",
    blurb: "Factory telemetry, from sensor to decision in 400ms.",
    art: "radial-gradient(120% 120% at 30% 20%, #94b4ff 0%, #0a1730 55%, #05070f 100%)",
  },
  {
    title: "Kitefield CMS",
    tag: "Media · Web",
    blurb: "An editorial platform serving 40M pages a month.",
    art: "radial-gradient(130% 130% at 85% 70%, #5c83cc 0%, #0a1730 55%, #05070f 100%)",
  },
  {
    title: "Statice Analytics",
    tag: "Data · SaaS",
    blurb: "Privacy-safe product analytics, from event to insight.",
    art: "radial-gradient(120% 120% at 15% 30%, #cfe0ff 0%, #14315f 50%, #05070f 100%)",
  },
];

export function Projects() {
  return (
    <PageTransition>
      <section className="bg-silk relative min-h-screen overflow-hidden pb-24 pt-36 sm:pb-32">
        {/* Blend down toward the dark footer — no seam. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#05070f]"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Projects"
            title="Work *we've done.*"
            lead="A few things we've shipped. Every one carries our name, so every one gets the same care. These are placeholders for now, real cases are on the way."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
