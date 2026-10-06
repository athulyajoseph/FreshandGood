import type { OpeningHours, Weekday } from '@/types'

const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

/** "07:30" → "7:30 am", "21:00" → "9 pm". */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const suffix = hours >= 12 ? 'pm' : 'am'
  const hour12 = hours % 12 || 12
  return minutes ? `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}` : `${hour12} ${suffix}`
}

/** e.g. "7 am – 9:30 pm · Closed Sun", or "7 am – 9:30 pm daily". */
export function formatOpeningHours({ open, close, closedOn }: OpeningHours): string {
  const range = `${formatTime(open)} – ${formatTime(close)}`
  return closedOn.length
    ? `${range} · Closed ${closedOn.map((day) => WEEKDAY_LABELS[day]).join(', ')}`
    : `${range} daily`
}
