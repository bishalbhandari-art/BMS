export function sortData<T>(items: T[], comparator: (a: T, b: T) => number): T[] {
  return [...items].sort(comparator);
}

