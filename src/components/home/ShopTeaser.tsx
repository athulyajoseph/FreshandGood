import { Clock, Navigation, Store } from 'lucide-react'
import { ButtonLink, Container } from '@/components/ui'
import { siteConfig } from '@/config/site'

/** Static "find us near you" call to action. Phase 3 replaces this with real nearby shops. */
export function ShopTeaser() {
  return (
    <section aria-labelledby="shop-teaser-heading" className="py-14 sm:py-20">
      <Container>
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
              <h2
                id="shop-teaser-heading"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Find us near you
              </h2>
              <p className="mt-3 max-w-xl text-brand-100">
                {siteConfig.name} products are stocked at partner shops across {siteConfig.city},
                from Fort Kochi to Aluva. Find the one closest to you, check its opening hours and
                call ahead.
              </p>
              <ButtonLink
                to="/shops"
                variant="secondary"
                size="lg"
                className="mt-6"
                leftIcon={<Navigation className="size-5" aria-hidden="true" />}
              >
                Find a Shop Near You
              </ButtonLink>
            </div>
            <ul className="hidden gap-3 text-sm text-brand-50 lg:grid" aria-label="Highlights">
              {[
                { icon: Store, text: 'Neighbourhood partner shops' },
                { icon: Clock, text: 'Open early, close late' },
                { icon: Navigation, text: 'Directions to the nearest store' },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                >
                  <Icon className="size-5 shrink-0 text-accent-300" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
