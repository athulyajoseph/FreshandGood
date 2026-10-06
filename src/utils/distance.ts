import type { Coordinates } from '@/types'

const EARTH_RADIUS_KM = 6371

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/** Great-circle distance between two points in kilometres (Haversine formula). */
export function haversineKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Human-friendly distance: metres under 1 km ("850 m"), one decimal under 10 km ("2.4 km"),
 * whole kilometres beyond that ("14 km").
 */
export function formatDistance(km: number): string {
  if (!Number.isFinite(km) || km < 0) return '—'
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}
