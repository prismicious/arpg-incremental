export function generateUniqueId(prefix: string = "item"): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}