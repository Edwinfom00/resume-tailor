import { FiBriefcase, FiCheckCircle, FiFileText, FiTarget, FiUpload, FiZap } from "react-icons/fi";

export function UploadWorkflowVisual() {
  return (
    <div className="relative w-full max-w-xs rounded-card bg-surface-subtle p-(--rt-space-5)">
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-brand-line bg-surface px-(--rt-space-4)">
        <span className="inline-flex h-(--rt-control-height-lg) w-(--rt-control-height-lg) items-center justify-center rounded-full bg-surface-brand text-brand">
          <FiUpload aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="mt-(--rt-space-3) h-2 w-2/5 rounded-full bg-brand-subtle" />
        <span className="mt-(--rt-space-2) h-1.5 w-3/5 rounded-full bg-surface-subtle" />
      </div>
      <div className="absolute -bottom-(--rt-space-4) left-(--rt-space-4) right-(--rt-space-4) flex items-center gap-(--rt-space-3) rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) shadow-sm">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-surface-brand text-brand">
          <FiFileText aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="flex-1 space-y-1.5">
          <span className="block h-1.5 w-4/5 rounded-full bg-surface-subtle" />
          <span className="block h-1.5 w-2/5 rounded-full bg-surface-subtle" />
        </span>
        <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-positive" />
      </div>
    </div>
  );
}

export function JobOfferWorkflowVisual() {
  return (
    <div className="relative w-full max-w-xs rounded-card border border-line-subtle bg-surface p-(--rt-space-4) shadow-xs">
      <div className="flex items-center gap-(--rt-space-3)">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-brand text-brand">
          <FiBriefcase aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="flex-1 space-y-2">
          <span className="block h-2 w-3/4 rounded-full bg-brand-subtle" />
          <span className="block h-1.5 w-2/5 rounded-full bg-surface-subtle" />
        </span>
      </div>
      <div className="mt-(--rt-space-5) space-y-(--rt-space-3) rounded-lg bg-canvas p-(--rt-space-3)">
        {["first", "second", "third"].map((key) => (
          <div key={key} className="flex items-center gap-(--rt-space-2)">
            <FiCheckCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-positive" />
            <span className="h-1.5 flex-1 rounded-full bg-surface-subtle" />
            <span className="h-1.5 w-8 rounded-full bg-brand-subtle" />
          </div>
        ))}
      </div>
      <span className="absolute -right-(--rt-space-3) -top-(--rt-space-3) inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-full border border-brand-line bg-surface text-brand shadow-sm">
        <FiZap aria-hidden="true" className="h-4 w-4" />
      </span>
    </div>
  );
}

export function RecommendationsWorkflowVisual() {
  return (
    <div className="relative w-full max-w-xs rounded-card bg-surface-subtle p-(--rt-space-5)">
      <div className="space-y-(--rt-space-3)">
        {["profile", "skills", "projects"].map((key, index) => (
          <div
            key={key}
            className={`flex items-center gap-(--rt-space-3) rounded-lg border p-(--rt-space-3) shadow-xs ${index === 1 ? "border-brand-line bg-surface" : "border-line-subtle bg-surface/80"}`}
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
              {index === 0 ? <FiTarget aria-hidden="true" className="h-4 w-4" /> : null}
              {index === 1 ? <FiZap aria-hidden="true" className="h-4 w-4" /> : null}
              {index === 2 ? <FiFileText aria-hidden="true" className="h-4 w-4" /> : null}
            </span>
            <span className="flex-1 space-y-1.5">
              <span className="block h-1.5 w-2/3 rounded-full bg-brand-subtle" />
              <span className="block h-1.5 w-full rounded-full bg-surface-subtle" />
            </span>
            <span className="h-8 w-8 rounded-full border-2 border-caution" />
          </div>
        ))}
      </div>
    </div>
  );
}
