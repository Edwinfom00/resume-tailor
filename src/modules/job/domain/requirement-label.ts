import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

const requirementPrefixes =
  /^(?:(?:sehr\s+)?(?:gute|fundierte|nachweisliche|solide)\s+)?(?:erfahrung(?:en)?\s+(?:mit|im\s+umgang\s+mit|in)|kenntnisse\s+(?:in|von|mit)|sicherer\s+umgang\s+mit|vertraut\s+mit|experience\s+(?:with|in|of)|proficiency\s+(?:with|in)|knowledge\s+of|familiarity\s+with|hands[- ]on\s+(?:experience\s+)?(?:with|in)|strong\s+(?:experience|knowledge)\s+(?:with|in|of)|expérience\s+(?:avec|en|dans)|connaissance(?:s)?\s+(?:de|en|du)|maîtrise\s+(?:de|du|des))\s+/i;

export function stripRequirementPrefix(label: string) {
  const stripped = collapseWhitespace(label.replace(requirementPrefixes, ""));

  return stripped.length >= 2 ? stripped : collapseWhitespace(label);
}
