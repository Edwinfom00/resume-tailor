"use client";

import { useResumePdfExport } from "../hooks/use-resume-pdf-export";

type ResumeDownloadButtonProps = Readonly<{
  downloadLabel: string;
  errorLabel: string;
  exportingLabel: string;
}>;

export function ResumeDownloadButton({
  downloadLabel,
  errorLabel,
  exportingLabel,
}: ResumeDownloadButtonProps) {
  const { error, exportPdf, isExporting } = useResumePdfExport();

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void exportPdf()}
        disabled={isExporting}
        className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
      >
        {isExporting ? exportingLabel : downloadLabel}
      </button>
      {error ? (
        <p role="alert" className="m-0 text-xs text-negative">
          {errorLabel}
        </p>
      ) : null}
    </div>
  );
}
