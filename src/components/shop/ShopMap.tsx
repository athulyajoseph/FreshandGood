import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { Navigation, Phone } from 'lucide-react'
import { useEffect, useRef, type RefObject } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Coordinates, ShopResult } from '@/types'
import { cn, directionsUrl, formatDistance } from '@/utils'
import type { ShopMapProps } from './shopMapTypes'

// Vite fingerprints asset URLs, which breaks Leaflet's CSS-based guess of where its default
// marker images live. Point the default icon at the imported assets explicitly.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const markerOptions: L.IconOptions = {
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}

/** Shop markers are tinted brand green (and turmeric when selected) via CSS in index.css. */
const shopIcon = new L.Icon({ ...markerOptions, className: 'fg-shop-marker' })
const selectedShopIcon = new L.Icon({ ...markerOptions, className: 'fg-shop-marker-selected' })

const userIcon = L.divIcon({
  className: 'fg-user-marker',
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
})

/** Fallback view when there is nothing to show: central Kochi. */
const DEFAULT_CENTER: L.LatLngTuple = [9.9816, 76.2999]
const DEFAULT_ZOOM = 11
const FOCUS_ZOOM = 15

const toLatLng = ({ lat, lng }: Coordinates): L.LatLngTuple => [lat, lng]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Leaflet caches the container size and only re-measures on window resize. When the map has
 * just been revealed (e.g. the mobile List → Map toggle) the cache still says 0×0, and view
 * changes like `flyTo` then divide by zero and throw "Invalid LatLng (NaN, NaN)". Re-measure
 * first; this is a no-op when the size hasn't changed.
 */
function syncSize(map: L.Map) {
  map.invalidateSize({ pan: false })
}

interface MapControllerProps {
  shops: ShopResult[]
  userCoords?: Coordinates | null
  selectedShopId?: string | null
  markers: RefObject<Map<string, L.Marker>>
}

/** Keeps the view in sync with the data: fits all markers, follows the selection, resizes. */
function MapController({ shops, userCoords, selectedShopId, markers }: MapControllerProps) {
  const map = useMap()
  // Set when the map couldn't be fitted because it was hidden (e.g. the mobile List view).
  const pendingFit = useRef<(() => void) | null>(null)

  // Scroll-wheel zoom stays off until the user clicks or focuses the map, so scrolling the page
  // never gets trapped by the map; it switches off again when the pointer or focus leaves.
  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable()
    const disable = () => map.scrollWheelZoom.disable()
    map.on('click focus', enable)
    map.on('mouseout blur', disable)
    return () => {
      map.off('click focus', enable)
      map.off('mouseout blur', disable)
    }
  }, [map])

  // Recalculate the map size whenever its container is resized or revealed.
  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
      if (container.clientWidth > 0 && pendingFit.current) {
        const fit = pendingFit.current
        pendingFit.current = null
        fit()
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  // Fit every shop and the user in view whenever the set of markers changes.
  useEffect(() => {
    const points = shops.map((shop) => toLatLng(shop.coordinates))
    if (userCoords) points.push(toLatLng(userCoords))

    const fit = () => {
      if (points.length === 0) map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false })
      else if (points.length === 1) map.setView(points[0], FOCUS_ZOOM, { animate: false })
      else map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: FOCUS_ZOOM })
    }

    if (map.getContainer().clientWidth === 0) pendingFit.current = fit
    else {
      pendingFit.current = null
      syncSize(map)
      fit()
    }
  }, [map, shops, userCoords])

  // Pan to the selected shop and open its popup.
  useEffect(() => {
    if (!selectedShopId) return
    const shop = shops.find((s) => s.id === selectedShopId)
    if (!shop) return

    const target = toLatLng(shop.coordinates)
    const zoom = Math.max(map.getZoom(), FOCUS_ZOOM - 1)
    const openPopup = () => markers.current.get(selectedShopId)?.openPopup()

    // Hidden (e.g. mobile List view): centre on the shop once the map is shown.
    if (map.getContainer().clientWidth === 0) {
      pendingFit.current = () => {
        map.setView(target, zoom, { animate: false })
        openPopup()
      }
      return
    }

    pendingFit.current = null
    syncSize(map)
    if (prefersReducedMotion()) {
      map.setView(target, zoom, { animate: false })
      openPopup()
      return
    }
    // Open the popup after the flight, so its auto-pan doesn't fight the animation.
    map.once('moveend', openPopup)
    map.flyTo(target, zoom, { duration: 0.6 })
    return () => {
      map.off('moveend', openPopup)
    }
  }, [map, shops, selectedShopId, markers])

  return null
}

function ShopPopup({ shop, userCoords }: { shop: ShopResult; userCoords?: Coordinates | null }) {
  return (
    <div className="flex min-w-48 flex-col gap-1.5 font-sans text-stone-700">
      <p className="text-sm font-semibold text-stone-900">{shop.name}</p>
      <p className="text-xs">
        {shop.address}, {shop.city} {shop.pincode}
      </p>
      {shop.distanceKm !== undefined && (
        <p className="text-xs font-medium text-brand-700">{formatDistance(shop.distanceKm)} away</p>
      )}
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
        <a
          href={`tel:${shop.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-1 text-brand-700! hover:underline"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          {shop.phone}
        </a>
        <a
          href={directionsUrl(shop.coordinates, userCoords)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-brand-700! hover:underline"
        >
          <Navigation className="size-3.5" aria-hidden="true" />
          Get Directions
          <span className="sr-only"> to {shop.name} (opens in a new tab)</span>
        </a>
      </div>
    </div>
  )
}

/**
 * OpenStreetMap of shops (via Leaflet). Heavy: import it through `LazyShopMap` so Leaflet is
 * split out of the main bundle.
 */
export default function ShopMap({
  shops,
  userCoords,
  selectedShopId,
  onSelectShop,
  label = 'Map of shops',
  className,
}: ShopMapProps) {
  const markers = useRef(new Map<string, L.Marker>())

  return (
    // `isolate z-0` contains Leaflet's internal z-indexes (up to 1000) in their own stacking
    // context, so the map never covers the sticky header, mobile menu or drawers.
    <div
      role="region"
      aria-label={label}
      className={cn(
        'relative isolate z-0 h-80 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100',
        className,
      )}
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapController
          shops={shops}
          userCoords={userCoords}
          selectedShopId={selectedShopId}
          markers={markers}
        />

        {userCoords && (
          <Marker
            position={toLatLng(userCoords)}
            icon={userIcon}
            zIndexOffset={-100}
            title="You are here"
            alt="Your location"
          >
            <Popup>
              <p className="font-sans text-sm font-semibold text-stone-900">You are here</p>
            </Popup>
          </Marker>
        )}

        {shops.map((shop) => {
          const selected = shop.id === selectedShopId
          return (
            <Marker
              key={shop.id}
              position={toLatLng(shop.coordinates)}
              icon={selected ? selectedShopIcon : shopIcon}
              zIndexOffset={selected ? 1000 : 0}
              title={shop.name}
              alt={shop.name}
              ref={(marker) => {
                if (!marker) return
                markers.current.set(shop.id, marker)
                return () => {
                  markers.current.delete(shop.id)
                }
              }}
              eventHandlers={{ click: () => onSelectShop?.(shop.id) }}
            >
              <Popup>
                <ShopPopup shop={shop} userCoords={userCoords} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
