function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, entryValue]) => [key, sortValue(entryValue)]),
    );
  }

  return value;
}

export function stableSerialize(value: unknown) {
  return JSON.stringify(sortValue(value)) ?? "";
}

export function stableHash(value: unknown) {
  const serialized = stableSerialize(value);
  let high = 0x811c9dc5;
  let low = 0x01000193;

  for (let index = 0; index < serialized.length; index += 1) {
    const codePoint = serialized.charCodeAt(index);

    high ^= codePoint;
    high = Math.imul(high, 0x01000193);
    low ^= codePoint + index;
    low = Math.imul(low, 0x85ebca6b);
  }

  const highPart = (high >>> 0).toString(36).padStart(7, "0");
  const lowPart = (low >>> 0).toString(36).padStart(7, "0");

  return `${highPart}${lowPart}`;
}
