const MIN_DELAY_MS = 150
const MAX_DELAY_MS = 400

/** Simulates network latency so loading states are exercised before a real API exists. */
export function simulateLatency<T>(value: T): Promise<T> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Returns a deep copy so callers can never mutate the in-memory seed data. */
export function clone<T>(value: T): T {
  return structuredClone(value)
}
