import type { ResumeData, ResumeProject } from "@/@types/resume-data";
import { formatResumeDateRange } from "./resume-formatters";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeProjectsProps = Readonly<{
  resume: ResumeData;
  title: string;
  roleLabel: string;
  technologiesLabel: string;
}>;

type ResumeProjectItemProps = Readonly<{
  project: ResumeProject;
  roleLabel: string;
  technologiesLabel: string;
}>;

function ResumeProjectItem({
  project,
  roleLabel,
  technologiesLabel,
}: ResumeProjectItemProps) {
  const [overview, ...outcomes] = project.highlights;

  return (
    <article>
      <h3 className="m-0 text-sm leading-tight font-bold text-(--rt-color-resume-copy)">
        {project.name} – {project.description}
      </h3>
      {project.period ? (
        <time className="block [font-size:var(--rt-font-size-resume-meta)] leading-tight text-(--rt-color-resume-body)">
          {formatResumeDateRange(project.period)}
        </time>
      ) : null}
      {project.role ? (
        <p className="m-0 [font-size:var(--rt-font-size-resume-meta)] leading-tight italic text-(--rt-color-resume-heading)">
          {roleLabel}: {project.role}
        </p>
      ) : null}
      <ul className="mt-1 mb-0 list-disc space-y-0 pl-6 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
        {overview ? <li>{overview}</li> : null}
        {project.technologies.length ? (
          <li>
            {technologiesLabel}: {project.technologies.join(", ")}
          </li>
        ) : null}
        {outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
    </article>
  );
}

export function ResumeProjects({
  resume,
  title,
  roleLabel,
  technologiesLabel,
}: ResumeProjectsProps) {
  return (
    <section>
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <div className="mt-3 space-y-(--rt-resume-entry-gap)">
        {resume.projects.map((project) => (
          <ResumeProjectItem
            key={project.id}
            project={project}
            roleLabel={roleLabel}
            technologiesLabel={technologiesLabel}
          />
        ))}
      </div>
    </section>
  );
}
