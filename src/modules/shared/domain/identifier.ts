const identifierAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

const combiningMarks = /\p{M}/gu;

function randomSegment(length: number) {
  const values = new Uint8Array(length);

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < length; index += 1) {
      values[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(
    values,
    (value) => identifierAlphabet[value % identifierAlphabet.length],
  ).join("");
}

export function createIdentifier(prefix: string) {
  return `${prefix}_${randomSegment(10)}`;
}

export function createSlugIdentifier(prefix: string, label: string) {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(combiningMarks, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug ? `${prefix}_${slug}` : createIdentifier(prefix);
}
