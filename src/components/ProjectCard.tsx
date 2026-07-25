import { Reveal } from "./ui/Reveal";

export interface Project {
  title: string;
  tag: string;
  blurb: string;
  /** CSS background for the cover art — gradients keep us image-free. */
  art: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** Work card: cover zooms and title slides on hover. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Reveal delay={(index % 3) * 0.07} amount={0.15}>
      <article
        className="group overflow-hidden rounded-2xl border border-hairline transition-[border-color,box-shadow,transform] duration-300 ease-silk hover:-translate-y-1 hover:border-silk/40 hover:shadow-[0_30px_80px_-30px_rgba(53,113,255,0.3)]"
        aria-label={`${project.title} — ${project.blurb}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-transform duration-500 ease-silk group-hover:scale-105"
            style={{ background: project.art }}
          />
          {/* Dotted texture nod to the mark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep/90 to-transparent" />
          <p className="absolute bottom-4 left-5 font-body text-xs font-500 uppercase tracking-[0.22em] text-silk/80">
            {project.tag}
          </p>
        </div>
        <div className="flex items-center justify-between bg-white/[0.02] px-5 py-5">
          <div className="overflow-hidden">
            <h3 className="font-display text-xl font-600 tracking-display text-white transition-transform duration-300 ease-silk group-hover:-translate-y-0.5">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{project.blurb}</p>
          </div>
          <span
            aria-hidden="true"
            className="ml-4 shrink-0 text-lg text-silk/50 transition-all duration-300 ease-silk group-hover:translate-x-1 group-hover:text-silk"
          >
            →
          </span>
        </div>
      </article>
    </Reveal>
  );
}
