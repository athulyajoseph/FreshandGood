import { ArrowRight, MapPin, Store } from 'lucide-react'
import { useCallback, useState } from 'react'
import { LazyShopMap, LocationPrompt, ShopCard, ShopCardSkeleton } from '@/components/shop'
import { ButtonLink, EmptyState, ErrorState, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useAsync, useUserLocation } from '@/hooks'
import { shopService } from '@/services'
import type { Coordinates, ShopResult } from '@/types'
import { pluralize, shopsForProductPath } from '@/utils'

interface ProductShopAvailabilityProps {
  productId: string
  productSlug: string
  className?: string
}

/**
 * "Available at": the shops that stock a product, nearest first once the user shares their
 * location, with a small map and a link to the full Find a Shop page.
 */
export function ProductShopAvailability({
  productId,
  productSlug,
  className,
}: ProductShopAvailabilityProps) {
  const { coords } = useUserLocation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const {
    data: shops,
    status,
    isLoading,
    retry,
  } = useAsync(
    useCallback(
      () => shopService.getShopsForProduct(productId, coords ?? undefined),
      [productId, coords],
    ),
    { keepPreviousData: true },
  )

  const viewAllLink = (
    <ButtonLink
      to={shopsForProductPath(productSlug)}
      variant="outline"
      size="sm"
      leftIcon={<MapPin className="size-4" aria-hidden="true" />}
    >
      View all shops with this product
    </ButtonLink>
  )

  return (
    <section id="availability" aria-labelledby="availability-heading" className={className}>
      <SectionHeading
        title="Available at"
        headingId="availability-heading"
        subtitle={
          shops?.length
            ? `In stock at ${pluralize(shops.length, `${siteConfig.name} shop`)} across ${siteConfig.city}${coords ? ', nearest first' : ''}.`
            : `${siteConfig.name} shops that stock this product.`
        }
        action={shops?.length ? viewAllLink : undefined}
      />

      {status === 'error' ? (
        <ErrorState title="Couldn’t load shops" onRetry={retry} />
      ) : !shops ? (
        <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
          <span className="sr-only">Loading shops…</span>
          <ShopCardSkeleton />
          <ShopCardSkeleton />
        </div>
      ) : shops.length === 0 ? (
        <EmptyState
          icon={<Store />}
          title="Not in stock right now"
          description="This product isn’t stocked at any of our shops at the moment. Please check back soon, or ask us on WhatsApp when it’s due back."
          action={
            <ButtonLink
              to="/shops"
              variant="outline"
              rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
            >
              Browse all shops
            </ButtonLink>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {!coords && (
            <LocationPrompt intro="Share your location to see which of these shops is nearest to you." />
          )}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ShopList
              shops={shops}
              userCoords={coords}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isLoading={isLoading}
            />
            <LazyShopMap
              shops={shops}
              userCoords={coords}
              selectedShopId={selectedId}
              onSelectShop={setSelectedId}
              label="Map of shops stocking this product"
              className="h-72 lg:sticky lg:top-24 lg:h-96 lg:self-start"
            />
          </div>
          {coords && <LocationPrompt variant="compact" />}
        </div>
      )}
    </section>
  )
}

function ShopList({
  shops,
  userCoords,
  selectedId,
  onSelect,
  isLoading,
}: {
  shops: ShopResult[]
  userCoords: Coordinates | null
  selectedId: string | null
  onSelect: (shopId: string) => void
  isLoading: boolean
}) {
  return (
    <ul
      className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
      aria-busy={isLoading || undefined}
    >
      {shops.map((shop, index) => (
        <li key={shop.id}>
          <ShopCard
            shop={shop}
            userCoords={userCoords}
            selected={shop.id === selectedId}
            onSelect={onSelect}
            isNearest={Boolean(userCoords) && index === 0}
            showProducts={false}
          />
        </li>
      ))}
    </ul>
  )
}
