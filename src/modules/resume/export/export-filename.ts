export function generateResumeExportFileName(): string {
  const STORAGE_KEY = "resume_tailor_export_counter";
  let counter = 1;

  if (typeof window !== "undefined") {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsed = Number.parseInt(storedValue, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          counter = parsed;
        }
      }
    } catch {
      counter = 1;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const formattedCounter = String(counter).padStart(4, "0");
  const fileName = `resume-tailor-${today}-${formattedCounter}.pdf`;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(counter + 1));
    } catch {
      
    }
  }

  return fileName;
}
