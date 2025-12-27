
const cache = new Set<string | number | symbol>();

export function logOnce(id: string | number | symbol, ...args: any[]) {
  if (cache.has(id)) return;
  console.log(...args);
  cache.add(id);
}