export function formatTemplate(
  template: string,
  values: Readonly<Record<string, string | number>>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
