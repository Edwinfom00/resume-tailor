const strippedBlocks =
  /<(script|style|noscript|svg|template|iframe|form|nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi;

const selfClosingNoise = /<(br|hr)\s*\/?>/gi;
const blockBoundaries =
  /<\/(p|div|section|article|li|ul|ol|h1|h2|h3|h4|h5|h6|tr|td|table|dl|dd|dt)\s*>/gi;
const listItemStart = /<li\b[^>]*>/gi;
const remainingTags = /<[^>]+>/g;

const htmlEntities: Readonly<Record<string, string>> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  eacute: "é",
  egrave: "è",
  agrave: "à",
  ccedil: "ç",
  uuml: "ü",
  ouml: "ö",
  auml: "ä",
  szlig: "ß",
};

const noiseLinePatterns: readonly RegExp[] = [
  /^(accept|manage|allow)?\s*(all )?cookies?\b/i,
  /^(we use|this (site|website) uses) cookies/i,
  /^(privacy|cookie) (policy|settings|preferences)/i,
  /^(sign|log) ?(in|up)\b/i,
  /^(skip to|back to|return to) /i,
  /^(share|apply|save) (this )?(job|offer|position)?$/i,
  /^(follow us|newsletter|subscribe)/i,
  /^(all rights reserved|©|copyright)/i,
  /^(terms|imprint|impressum|legal|datenschutz|mentions légales)/i,
  /^(home|menu|search|close|next|previous|more)$/i,
  /^(go|back|scroll) to top$/i,
  /^(nach oben|zum seitenanfang|zurück nach oben)$/i,
  /^(haut de page|retour en haut)$/i,
];

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      return htmlEntities[name.toLowerCase()] ?? match;
    });
}

export function extractHtmlTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  return match ? decodeHtmlEntities(match[1]).trim() : undefined;
}

export function extractMetaContent(html: string, propertyName: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${propertyName}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const alternatePattern = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${propertyName}["']`,
    "i",
  );
  const match = html.match(pattern) ?? html.match(alternatePattern);

  return match ? decodeHtmlEntities(match[1]).trim() : undefined;
}

function isNoiseLine(line: string) {
  if (line.length < 3) {
    return true;
  }

  return noiseLinePatterns.some((pattern) => pattern.test(line));
}

export function htmlToText(html: string) {
  const withoutBlocks = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(strippedBlocks, " ");

  const withBoundaries = withoutBlocks
    .replace(selfClosingNoise, "\n")
    .replace(listItemStart, "\n• ")
    .replace(blockBoundaries, "\n")
    .replace(remainingTags, " ");

  const decoded = decodeHtmlEntities(withBoundaries);

  const lines = decoded
    .split("\n")
    .map((line) => line.replace(/[ \t ]+/g, " ").trim())
    .filter((line) => line.length > 0);

  const deduplicated: string[] = [];
  const seen = new Set<string>();

  lines.forEach((line) => {
    const key = line.toLowerCase();

    if (seen.has(key) && line.length < 80) {
      return;
    }

    seen.add(key);

    if (!isNoiseLine(line)) {
      deduplicated.push(line);
    }
  });

  return deduplicated.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function extractJsonLdJobPosting(html: string) {
  const scripts = Array.from(
    html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  );

  for (const [, payload] of scripts) {
    try {
      const parsed: unknown = JSON.parse(payload.trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed];

      for (const candidate of candidates) {
        const graph = (candidate as { "@graph"?: unknown[] })?.["@graph"];
        const nodes = Array.isArray(graph) ? graph : [candidate];

        for (const node of nodes) {
          const typed = node as Record<string, unknown>;

          if (typed?.["@type"] === "JobPosting") {
            return typed;
          }
        }
      }
    } catch {
      continue;
    }
  }

  return undefined;
}
