import { ArrowRight, Clock, Navigation, Store } from 'lucide-react'
import { useCallback } from 'react'
import { LocationPrompt, ShopCard, ShopCardSkeleton } from '@/components/shop'
import { ButtonLink, Container, ErrorState, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useAsync, useUserLocation } from '@/hooks'
import { shopService } from '@/services'
import type { Coordinates } from '@/types'

const NEARBY_LIMIT = 3

function NearestShops({ coords }: { coords: Coordinates }) {
  const { data, status, retry } = useAsync(
    useCallback(() => shopService.getNearby(coords, { limit: NEARBY_LIMIT }), [coords]),
  )

  return (
    <>
      <SectionHeading
        eyebrow="Shop locally"
        title="Shops near you"
        subtitle={`The ${NEARBY_LIMIT} ${siteConfig.name} shops closest to where you are.`}
        headingId="nearby-shops-heading"
        action={
          <ButtonLink
            to="/shops"
            variant="ghost"
            size="sm"
            className="text-brand-700"
            rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            See all shops
          </ButtonLink>
        }
      />
      {status === 'error' ? (
        <ErrorState title="Couldn’t load nearby shops" onRetry={retry} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy={!data || undefined}>
          {data
            ? data.map((shop, index) => (
                <li key={shop.id}>
                  <ShopCard shop={shop} userCoords={coords} isNearest={index === 0} />
                </li>
              ))
            : Array.from({ length: NEARBY_LIMIT }, (_, i) => (
                <li key={i}>
                  <ShopCardSkeleton />
                </li>
              ))}
        </ul>
      )}
      <LocationPrompt variant="compact" className="mt-6" />
    </>
  )
}

function FindUsBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-800 px-6 py-12 text-white sm:px-12 sm:py-16">
      <div
        className="absolute -top-16 -right-16 size-64 rounded-full bg-brand-700/60"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 left-1/3 size-56 rounded-full bg-brand-900/50"
        aria-hidden="true"
      />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent-300 uppercase">
            Shop locally
          </p>
          <h2 id="nearby-shops-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find us near you
          </h2>
          <p className="mt-3 max-w-xl text-brand-100">
            {siteConfig.name} products are stocked at partner shops across {siteConfig.city}, from
            Fort Kochi to Aluva. Share your location to see the three closest, or browse them all.
          </p>
          <LocationPrompt variant="inverse" intro="" className="mt-6" />
          <ButtonLink
            to="/shops"
            variant="ghost"
            size="sm"
            className="mt-2 -ml-3 text-white hover:bg-white/10 active:bg-white/20"
            rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            Browse all shops
          </ButtonLink>
        </div>
        <ul className="hidden gap-3 text-sm text-brand-50 lg:grid" aria-label="Highlights">
          {[
            { icon: Store, text: 'Neighbourhood partner shops' },
            { icon: Clock, text: 'Open early, close late' },
            { icon: Navigation, text: 'Directions to the nearest store' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
              <Icon className="size-5 shrink-0 text-accent-300" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Home page shops section: the nearest shops once location is shared, otherwise a prompt. */
export function NearbyShops() {
  const { coords } = useUserLocation()

  return (
    <section aria-labelledby="nearby-shops-heading" className="py-14 sm:py-20">
      <Container>{coords ? <NearestShops coords={coords} /> : <FindUsBanner />}</Container>
    </section>
  )
}
