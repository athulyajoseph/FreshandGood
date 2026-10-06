import { useContext } from 'react'
import { LocationContext } from '@/context/locationContext'
import type { GeolocationState } from './useGeolocation'

/** The app-wide user location from `LocationProvider`. */
export function useUserLocation(): GeolocationState {
  const value = useContext(LocationContext)
  if (!value) throw new Error('useUserLocation must be used inside <LocationProvider>.')
  return value
}
