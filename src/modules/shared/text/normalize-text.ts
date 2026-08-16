const combiningMarks = /\p{M}/gu;
const collapsibleWhitespace = /\s+/g;

export function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(combiningMarks, "");
}

export function collapseWhitespace(value: string) {
  return value.replace(collapsibleWhitespace, " ").trim();
}

export function normalizeToken(value: string) {
  return collapseWhitespace(stripDiacritics(value).toLowerCase())
    .replace(/[^a-z0-9+#.\-/ ]/g, " ")
    .replace(collapsibleWhitespace, " ")
    .trim();
}

export function normalizeComparable(value: string) {
  return normalizeToken(value).replace(/[.\-/]/g, "");
}

export function toWords(value: string) {
  return normalizeToken(value)
    .split(" ")
    .filter((word) => word.length > 1);
}

export function toUniqueWords(value: string) {
  return Array.from(new Set(toWords(value)));
}

export function truncateText(value: string, maximumLength: number) {
  const cleaned = collapseWhitespace(value);

  return cleaned.length <= maximumLength
    ? cleaned
    : `${cleaned.slice(0, maximumLength - 1).trimEnd()}…`;
}

export function containsPhrase(haystack: string, needle: string) {
  const normalizedHaystack = ` ${normalizeToken(haystack)} `;
  const normalizedNeedle = normalizeToken(needle);

  return (
    normalizedNeedle.length > 0 &&
    normalizedHaystack.includes(` ${normalizedNeedle} `)
  );
}

function comparableTokens(value: string) {
  return normalizeToken(value)
    .split(" ")
    .map((token) => normalizeComparable(token))
    .filter(Boolean);
}

export function containsLooseTerm(haystack: string, needle: string) {
  if (containsPhrase(haystack, needle)) {
    return true;
  }

  const needleTokens = comparableTokens(needle);

  if (needleTokens.length === 0) {
    return false;
  }

  const haystackTokens = comparableTokens(haystack);

  if (needleTokens.length === 1) {
    return haystackTokens.includes(needleTokens[0]);
  }

  return haystackTokens.some((_, index) =>
    needleTokens.every(
      (token, offset) => haystackTokens[index + offset] === token,
    ),
  );
}
