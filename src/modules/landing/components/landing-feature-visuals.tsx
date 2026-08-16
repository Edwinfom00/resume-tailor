import { FiBriefcase, FiCheckCircle, FiDownload, FiFileText, FiTarget, FiZap } from "react-icons/fi";

export function ProfileOptimizationVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-card bg-surface-subtle p-(--rt-space-6)">
      <div className="absolute bottom-[28%] left-[18%] right-[18%] h-px bg-brand-line" />
      <div className="absolute bottom-[28%] left-[51%] top-[22%] w-px bg-brand-line" />
      <div className="absolute left-[51%] right-[18%] top-[22%] h-px bg-brand-line" />
      <div className="absolute bottom-[28%] left-[51%] right-[18%] h-px bg-brand-line" />
      <span className="absolute bottom-[26.5%] left-[50.5%] h-3 w-3 rounded-full border-2 border-brand bg-surface" />
      <div className="absolute bottom-[20%] left-(--rt-space-6) w-48 rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) shadow-sm">
        <div className="flex items-center gap-(--rt-space-2)">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface-brand text-brand">
            <FiFileText aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="flex-1 space-y-1.5">
            <span className="block h-1.5 w-3/4 rounded-full bg-brand-subtle" />
            <span className="block h-1.5 w-full rounded-full bg-surface-subtle" />
          </span>
        </div>
        <span className="mt-(--rt-space-3) block h-1.5 w-4/5 rounded-full bg-surface-subtle" />
      </div>
      <div className="absolute right-(--rt-space-6) top-(--rt-space-6) w-52 rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) shadow-sm">
        <div className="flex items-center gap-(--rt-space-2)">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface-brand text-brand">
            <FiTarget aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="flex-1 space-y-1.5">
            <span className="block h-1.5 w-2/3 rounded-full bg-brand-subtle" />
            <span className="block h-1.5 w-full rounded-full bg-surface-subtle" />
          </span>
        </div>
        <span className="mt-(--rt-space-3) block h-1.5 w-5/6 rounded-full bg-surface-subtle" />
      </div>
      <div className="absolute bottom-(--rt-space-6) right-(--rt-space-6) w-52 rounded-lg border border-brand-line bg-surface p-(--rt-space-3) shadow-sm">
        <div className="flex items-center gap-(--rt-space-2)">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface-brand text-brand">
            <FiZap aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="flex-1 space-y-1.5">
            <span className="block h-1.5 w-3/4 rounded-full bg-brand-subtle" />
            <span className="block h-1.5 w-full rounded-full bg-surface-subtle" />
          </span>
        </div>
        <span className="mt-(--rt-space-3) block h-1.5 w-2/3 rounded-full bg-surface-subtle" />
      </div>
      <span className="absolute bottom-(--rt-space-8) right-[13%] inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-full border border-brand-line bg-surface-brand text-brand shadow-sm">
        <FiZap aria-hidden="true" className="h-4 w-4" />
      </span>
    </div>
  );
}

export function SkillsSuggestionsVisual() {
  const skills = ["TypeScript", "React", "PostgreSQL", "AWS", "Kubernetes"];

  return (
    <div className="flex h-full flex-col justify-end rounded-card bg-surface-subtle p-(--rt-space-4)">
      <div className="space-y-(--rt-space-3)">
        {skills.map((skill, index) => (
          <div
            key={skill}
            className={`flex items-center gap-(--rt-space-3) rounded-lg border p-(--rt-space-3) shadow-xs ${index === 2 ? "border-brand-line bg-surface" : "border-line-subtle bg-surface/80"}`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-surface-brand text-brand">
              {index < 3 ? <FiCheckCircle aria-hidden="true" className="h-4 w-4" /> : <FiZap aria-hidden="true" className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{skill}</span>
            <span className={index < 3 ? "h-2.5 w-2.5 rounded-full bg-positive" : "h-2.5 w-2.5 rounded-full bg-caution"} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPriorityVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-card bg-surface-subtle p-(--rt-space-5)">
      <div className="mx-auto max-w-sm rounded-lg border border-line-subtle bg-surface p-(--rt-space-4) shadow-sm">
        <div className="flex items-center gap-(--rt-space-3)">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-brand text-brand">
            <FiBriefcase aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="flex-1 space-y-(--rt-space-2)">
            <span className="block h-2 w-3/5 rounded-full bg-brand-subtle" />
            <span className="block h-1.5 w-full rounded-full bg-surface-subtle" />
          </span>
          <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-positive" />
        </div>
        <div className="mt-(--rt-space-5) space-y-(--rt-space-3)">
          {["first", "second", "third"].map((project, index) => (
            <div key={project} className={`flex items-center gap-(--rt-space-3) rounded-md p-(--rt-space-2) ${index === 0 ? "bg-surface-brand" : "bg-canvas"}`}>
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="h-1.5 flex-1 rounded-full bg-surface-subtle" />
              <span className="h-5 w-8 rounded-full bg-brand-subtle" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-(--rt-space-5) left-1/2 flex -translate-x-1/2 items-center gap-(--rt-space-2) rounded-full border border-brand-line bg-surface px-(--rt-space-3) py-(--rt-space-2) shadow-sm">
        <FiTarget aria-hidden="true" className="h-4 w-4 text-brand" />
        <span className="h-1.5 w-24 rounded-full bg-brand-subtle" />
      </div>
    </div>
  );
}

export function ExportReadinessVisual() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-card bg-surface-subtle p-(--rt-space-6)">
      <div className="w-56 rounded-lg border border-line-subtle bg-surface p-(--rt-space-5) shadow-sm">
        <div className="flex items-center gap-(--rt-space-2)">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-surface-brand text-brand">
            <FiFileText aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="h-2 flex-1 rounded-full bg-brand-subtle" />
        </div>
        <div className="mt-(--rt-space-5) space-y-(--rt-space-3)">
          {["first", "second", "third", "fourth"].map((line, index) => (
            <div key={line} className="flex items-center gap-(--rt-space-2)">
              <FiCheckCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-positive" />
              <span className={`block h-1.5 rounded-full bg-surface-subtle ${index === 1 ? "w-3/5" : "flex-1"}`} />
            </div>
          ))}
        </div>
      </div>
      <span className="absolute bottom-(--rt-space-6) right-(--rt-space-6) inline-flex h-(--rt-control-height-lg) w-(--rt-control-height-lg) items-center justify-center rounded-md bg-brand text-white shadow-brand">
        <FiDownload aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="absolute left-(--rt-space-6) top-(--rt-space-6) h-20 w-20 rounded-full bg-surface-brand" />
    </div>
  );
}
