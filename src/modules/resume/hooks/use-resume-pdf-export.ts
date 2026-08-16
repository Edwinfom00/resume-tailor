"use client";

import { useCallback, useRef, useState } from "react";
import { exportResumePdf } from "../export/resume-pdf";

export function useResumePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isExportingRef = useRef(false);

  const exportPdf = useCallback(async () => {
    if (isExportingRef.current) {
      return;
    }

    isExportingRef.current = true;
    setError(null);
    setIsExporting(true);

    try {
      await exportResumePdf();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error("Unable to export the resume as a PDF."),
      );
    } finally {
      isExportingRef.current = false;
      setIsExporting(false);
    }
  }, []);

  return {
    error,
    exportPdf,
    isExporting,
  };
}
