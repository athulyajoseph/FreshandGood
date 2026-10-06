import { Clock, MapPin, Phone, Store } from 'lucide-react'
import { useCallback } from 'react'
import {
  ButtonLink,
  Card,
  CardBody,
  EmptyState,
  ErrorState,
  SectionHeading,
  Skeleton,
} from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useAsync } from '@/hooks'
import { shopService } from '@/services'
import type { Shop } from '@/types'
import { cn, formatOpeningHours, pluralize } from '@/utils'

interface ProductShopAvailabilityProps {
  productId: string
  className?: string
}

/**
 * "Available at": the shops that stock a product. Phase 3 extends this with distance sorting
 * (via `shopService.getForProductNearby`) and a map; `ShopAvailabilityList` already accepts
 * `ShopWithDistance`, since it extends `Shop`.
 */
export function ProductShopAvailability({ productId, className }: ProductShopAvailabilityProps) {
  const {
    data: shops,
    status,
    retry,
  } = useAsync(useCallback(() => shopService.getForProduct(productId), [productId]))

  return (
    <section id="availability" aria-labelledby="availability-heading" className={className}>
      <SectionHeading
        title="Available at"
        headingId="availability-heading"
        subtitle={
          status === 'success' && shops?.length
            ? `In stock at ${pluralize(shops.length, `${siteConfig.name} shop`)} across ${siteConfig.city}.`
            : `${siteConfig.name} shops that stock this product.`
        }
        action={
          <ButtonLink
            to="/shops"
            variant="outline"
            size="sm"
            leftIcon={<MapPin className="size-4" aria-hidden="true" />}
          >
            Find a shop near you
          </ButtonLink>
        }
      />
      {status === 'error' ? (
        <ErrorState title="Couldn’t load shops" onRetry={retry} />
      ) : status === 'loading' || !shops ? (
        <ShopListSkeleton />
      ) : shops.length === 0 ? (
        <EmptyState
          icon={<Store />}
          title="Not in stock right now"
          description="This product isn’t stocked at any shop at the moment. Please check back soon."
        />
      ) : (
        <ShopAvailabilityList shops={shops} />
      )}
    </section>
  )
}

export function ShopAvailabilityList({ shops, className }: { shops: Shop[]; className?: string }) {
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {shops.map((shop) => (
        <li key={shop.id}>
          <Card className="h-full">
            <CardBody className="flex h-full flex-col gap-3">
              <div>
                <h3 className="font-semibold text-stone-900">{shop.name}</h3>
                <p className="text-xs font-medium tracking-wide text-brand-700 uppercase">
                  {shop.area}
                </p>
              </div>
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
                className="mt-auto inline-flex items-center gap-2 self-start rounded text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
                aria-label={`Call ${shop.name} on ${shop.phone}`}
              >
                <Phone className="size-4" aria-hidden="true" />
                {shop.phone}
              </a>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}

function ShopListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <span className="sr-only">Loading shops…</span>
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i}>
          <CardBody className="flex flex-col gap-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-32" />
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
