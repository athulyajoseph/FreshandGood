import { useCallback, useRef, useState } from 'react'
import type { Coordinates } from '@/types'

export type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'error'

export interface GeolocationState {
  coords: Coordinates | null
  status: GeolocationStatus
  /** A friendly, user-facing explanation when the status is a failure. */
  error: string | null
  /** Asks the browser for the user's position. Only call this from a user action. */
  requestLocation: () => void
  /** Forgets the position (including the session cache) and returns to `idle`. */
  clearLocation: () => void
}

const STORAGE_KEY = 'fresh-and-good:location'

const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 5 * 60_000,
}

export const GEOLOCATION_MESSAGES = {
  denied:
    'Location access is blocked for this site. To turn it back on, click the lock or settings icon next to the address bar, set Location to “Allow”, then try again. You can still search by city or pincode.',
  unavailable:
    'We couldn’t work out where you are. Check that location services are turned on for your device, or search by city or pincode instead.',
  timeout:
    'Finding your location took too long. Please try again, or search by city or pincode instead.',
  unsupported:
    'Your browser doesn’t support location sharing. You can still search by city or pincode.',
  insecure:
    'Location only works on a secure (https) connection. You can still search by city or pincode.',
  generic: 'Something went wrong while finding your location. Please try again.',
} as const

function isValidCoords(value: unknown): value is Coordinates {
  if (typeof value !== 'object' || value === null) return false
  const { lat, lng } = value as Record<string, unknown>
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  )
}

function readCachedCoords(): Coordinates | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidCoords(parsed) ? { lat: parsed.lat, lng: parsed.lng } : null
  } catch {
    return null
  }
}

function writeCachedCoords(coords: Coordinates | null) {
  try {
    if (coords) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coords))
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the in-memory state still works.
  }
}

type State = Pick<GeolocationState, 'coords' | 'status' | 'error'>

function initialState(): State {
  const cached = readCachedCoords()
  return cached
    ? { coords: cached, status: 'granted', error: null }
    : { coords: null, status: 'idle', error: null }
}

/**
 * The browser's geolocation, requested on demand. Never prompts by itself: call
 * `requestLocation` from a click. Granted coordinates are cached in sessionStorage so moving
 * between pages doesn't prompt again; they are never sent anywhere.
 *
 * Use the shared instance via `useUserLocation()` rather than calling this directly.
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<State>(initialState)
  // Identifies the latest request so a late answer after `clearLocation` is ignored.
  const requestId = useRef(0)

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState({ coords: null, status: 'unavailable', error: GEOLOCATION_MESSAGES.unsupported })
      return
    }
    if (!window.isSecureContext) {
      setState({ coords: null, status: 'unavailable', error: GEOLOCATION_MESSAGES.insecure })
      return
    }

    const id = ++requestId.current
    setState((current) => ({ ...current, status: 'loading', error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (id !== requestId.current) return
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        writeCachedCoords(coords)
        setState({ coords, status: 'granted', error: null })
      },
      (error) => {
        if (id !== requestId.current) return
        writeCachedCoords(null)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setState({ coords: null, status: 'denied', error: GEOLOCATION_MESSAGES.denied })
            break
          case error.POSITION_UNAVAILABLE:
            setState({
              coords: null,
              status: 'unavailable',
              error: GEOLOCATION_MESSAGES.unavailable,
            })
            break
          case error.TIMEOUT:
            setState({ coords: null, status: 'error', error: GEOLOCATION_MESSAGES.timeout })
            break
          default:
            setState({ coords: null, status: 'error', error: GEOLOCATION_MESSAGES.generic })
        }
      },
      POSITION_OPTIONS,
    )
  }, [])

  const clearLocation = useCallback(() => {
    requestId.current += 1
    writeCachedCoords(null)
    setState({ coords: null, status: 'idle', error: null })
  }, [])

  return { ...state, requestLocation, clearLocation }
}
