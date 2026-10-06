/** "1 product", "6 products". Pass `plural` for irregular words. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
