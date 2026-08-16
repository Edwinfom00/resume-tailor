import { toUniqueWords } from "@/modules/shared/text/normalize-text";

const genericWords = new Set([
  "and",
  "avec",
  "das",
  "dem",
  "den",
  "der",
  "des",
  "die",
  "for",
  "les",
  "mit",
  "not",
  "our",
  "pour",
  "the",
  "und",
  "une",
  "von",
  "with",
  "you",
  "your",
]);

function meaningfulWords(value: string) {
  return toUniqueWords(value).filter((word) => !genericWords.has(word));
}

export function jaccardSimilarity(first: string, second: string) {
  const firstWords = new Set(meaningfulWords(first));
  const secondWords = new Set(meaningfulWords(second));

  if (firstWords.size === 0 || secondWords.size === 0) {
    return 0;
  }

  let intersectionSize = 0;

  firstWords.forEach((word) => {
    if (secondWords.has(word)) {
      intersectionSize += 1;
    }
  });

  const unionSize = firstWords.size + secondWords.size - intersectionSize;

  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

export function overlapRatio(needle: string, haystack: string) {
  const needleWords = meaningfulWords(needle);

  if (needleWords.length === 0) {
    return 0;
  }

  const haystackWords = new Set(meaningfulWords(haystack));
  const matches = needleWords.filter((word) => haystackWords.has(word));

  return matches.length / needleWords.length;
}
