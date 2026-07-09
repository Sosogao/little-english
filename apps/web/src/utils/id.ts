export function makeId(prefix: string, value: string) {
  return `${prefix}_${value.toLowerCase().replace(/\s+/g, '_')}`;
}
