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
  presentLabel?: string,
) {
  const end = range.end ? formatResumeDate(range.end) : presentLabel;

  return end ? `${formatResumeDate(range.start)} – ${end}` : formatResumeDate(range.start);
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
