import type {
  ResumeDate,
  ResumeDateRange,
  ResumeLocation,
} from "@/@types/resume-data";

export function formatResumeDate(date: ResumeDate) {
  return date.month
    ? `${String(date.month).padStart(2, "0")}/${date.year}`
    : String(date.year);
}

export function formatResumeDateRange(
  range: ResumeDateRange,
  presentLabel: string,
) {
  return `${formatResumeDate(range.start)} – ${
    range.end ? formatResumeDate(range.end) : presentLabel
  }`;
}

export function formatResumeLocation(location?: ResumeLocation) {
  if (!location) {
    return undefined;
  }

  const label = [location.city, location.region, location.country]
    .filter((part): part is string => Boolean(part))
    .join(", ");

  return label || undefined;
}
