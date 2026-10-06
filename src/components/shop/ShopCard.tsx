import { ChevronDown, Clock, MapPin, Navigation, Phone, Star } from 'lucide-react'
import { useCallback, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, ButtonAnchor, Card, CardBody, Skeleton } from '@/components/ui'
import { useAsync } from '@/hooks'
import { productService } from '@/services'
import type { Coordinates, ShopResult } from '@/types'
import { cn, directionsUrl, formatDistance, formatOpeningHours, productPath } from '@/utils'
import { shopCardId } from './shopCardId'

const PRODUCT_PREVIEW_LIMIT = 5

function ShopProducts({ shopId }: { shopId: string }) {
  const { data, status, retry } = useAsync(
    useCallback(() => productService.getByShop(shopId), [shopId]),
  )

  if (status === 'loading' || !data) {
    if (status === 'error') {
      return (
        <p className="text-sm text-stone-600">
          Couldn’t load products.{' '}
          <button
            type="button"
            onClick={retry}
            className="font-medium text-brand-700 hover:underline"
          >
            Try again
          </button>
        </p>
      )
    }
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        <span className="sr-only">Loading products…</span>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="text-sm text-stone-600">No products listed for this shop yet.</p>
  }

  const remaining = data.length - PRODUCT_PREVIEW_LIMIT
  return (
    <>
      <ul className="flex flex-col gap-1.5 text-sm">
        {data.slice(0, PRODUCT_PREVIEW_LIMIT).map((product) => (
          <li key={product.id}>
            <Link
              to={productPath(product.slug)}
              className="rounded text-stone-700 hover:text-brand-700 hover:underline"
            >
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
      {remaining > 0 && <p className="mt-2 text-xs text-stone-500">and {remaining} more</p>}
    </>
  )
}

interface ShopCardProps {
  shop: ShopResult
  /** Used as the starting point for directions when known. */
  userCoords?: Coordinates | null
  /** Highlights the card, e.g. when its map marker is selected. */
  selected?: boolean
  /** Called when the card is clicked, and (unless `onShowOnMap` is set) by "Show on map". */
  onSelect?: (shopId: string) => void
  /** Called by the "Show on map" button, e.g. to also switch a mobile List/Map toggle. */
  onShowOnMap?: (shopId: string) => void
  /** Shows a "Nearest to you" badge. */
  isNearest?: boolean
  /** Include the expandable "Products available here" list (default: true). */
  showProducts?: boolean
  className?: string
}

/** A partner shop: address, hours, distance, phone, directions and (optionally) its products. */
export function ShopCard({
  shop,
  userCoords,
  selected,
  onSelect,
  onShowOnMap,
  isNearest,
  showProducts = true,
  className,
}: ShopCardProps) {
  const [productsOpen, setProductsOpen] = useState(false)
  const headingId = `${shopCardId(shop.id)}-name`
  const showOnMap = onShowOnMap ?? onSelect

  // Selecting by clicking anywhere on the card is a mouse convenience; keyboard users get the
  // "Show on map" button. Clicks on links, buttons and the products toggle keep their own job.
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!onSelect) return
    if ((event.target as HTMLElement).closest('a, button, summary')) return
    onSelect(shop.id)
  }

  return (
    <Card
      id={shopCardId(shop.id)}
      role="article"
      aria-labelledby={headingId}
      aria-current={selected || undefined}
      onClick={handleClick}
      className={cn(
        'h-full scroll-mt-24 transition-shadow',
        onSelect && 'cursor-pointer',
        selected && 'border-brand-500 ring-2 ring-brand-500',
        isNearest && !selected && 'border-accent-300',
        className,
      )}
    >
      <CardBody className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={headingId} className="font-semibold text-stone-900">
              {shop.name}
            </h3>
            <p className="text-xs font-medium tracking-wide text-brand-700 uppercase">
              {shop.area}
            </p>
          </div>
          {shop.distanceKm !== undefined && (
            <Badge variant="brand" className="shrink-0">
              <Navigation className="size-3" aria-hidden="true" />
              {formatDistance(shop.distanceKm)}
              <span className="sr-only"> away</span>
            </Badge>
          )}
        </div>

        {isNearest && (
          <Badge variant="accent" className="self-start">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Nearest to you
          </Badge>
        )}

        <p className="flex gap-2 text-sm text-stone-600">
          <MapPin className="mt-0.5 size-4 shrink-0 text-stone-400" aria-hidden="true" />
          <span>
            {shop.address}, {shop.city} {shop.pincode}
          </span>
        </p>
        <p className="flex gap-2 text-sm text-stone-600">
          <Clock className="mt-0.5 size-4 shrink-0 text-stone-400" aria-hidden="true" />
          <span>{formatOpeningHours(shop.hours)}</span>
        </p>
        <a
          href={`tel:${shop.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 self-start rounded text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
          aria-label={`Call ${shop.name} on ${shop.phone}`}
        >
          <Phone className="size-4" aria-hidden="true" />
          {shop.phone}
        </a>

        {showProducts && (
          <details
            className="group rounded-xl bg-stone-50 px-3 py-2"
            onToggle={(event) => setProductsOpen(event.currentTarget.open)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded text-sm font-medium text-stone-800 [&::-webkit-details-marker]:hidden">
              Products available here
              <ChevronDown
                className="size-4 text-stone-500 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="pt-3 pb-1">{productsOpen && <ShopProducts shopId={shop.id} />}</div>
          </details>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <ButtonAnchor
            href={directionsUrl(shop.coordinates, userCoords)}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            leftIcon={<Navigation className="size-4" aria-hidden="true" />}
          >
            Get Directions
            <span className="sr-only"> to {shop.name} (opens in a new tab)</span>
          </ButtonAnchor>
          {showOnMap && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => showOnMap(shop.id)}
              aria-pressed={selected}
              leftIcon={<MapPin className="size-4" aria-hidden="true" />}
            >
              Show on map
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export function ShopCardSkeleton() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-1 h-9 w-36 rounded-full" />
      </CardBody>
    </Card>
  )
}
