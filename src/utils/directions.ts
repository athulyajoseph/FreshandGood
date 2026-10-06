import type { Coordinates } from '@/types'

const toParam = ({ lat, lng }: Coordinates): string => `${lat},${lng}`

/**
 * Google Maps directions link to `destination`. When `origin` is known the route starts there;
 * otherwise Google Maps uses the device's current location. The link is only followed when the
 * user clicks it, so coordinates never leave the browser on their own.
 */
export function directionsUrl(destination: Coordinates, origin?: Coordinates | null): string {
  const params = new URLSearchParams({ api: '1', destination: toParam(destination) })
  if (origin) params.set('origin', toParam(origin))
  return `https://www.google.com/maps/dir/?${params}`
}
