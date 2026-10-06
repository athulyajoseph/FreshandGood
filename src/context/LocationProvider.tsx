import { useMemo, type ReactNode } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { LocationContext } from './locationContext'

/** Holds one geolocation state for the whole app, so location is requested at most once. */
export function LocationProvider({ children }: { children: ReactNode }) {
  const { coords, status, error, requestLocation, clearLocation } = useGeolocation()
  const value = useMemo(
    () => ({ coords, status, error, requestLocation, clearLocation }),
    [coords, status, error, requestLocation, clearLocation],
  )
  return <LocationContext value={value}>{children}</LocationContext>
}
