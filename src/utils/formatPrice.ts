const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const inrDecimal = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formats a rupee amount using Indian digit grouping, e.g. `1250` → "₹1,250".
 * Fractional amounts keep two decimals: `49.5` → "₹49.50".
 */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) return '—'
  return Number.isInteger(amount) ? inrWhole.format(amount) : inrDecimal.format(amount)
}
