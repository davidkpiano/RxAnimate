export default function mapValues<T, R>(
  object: Record<string, T>,
  project: (value: T, index: string) => R
): Record<string, R> {
  const result: Record<string, R> = {};

  Object.keys(object).forEach(key => {
    result[key] = project(object[key], key);
  });

  return result;
}
