import { createContext } from 'react'
import type { GeolocationState } from '@/hooks/useGeolocation'

/** The user's location, shared app-wide by `LocationProvider`. */
export const LocationContext = createContext<GeolocationState | null>(null)
