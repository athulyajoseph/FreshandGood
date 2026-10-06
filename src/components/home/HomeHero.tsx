import { MapPin, Search } from 'lucide-react'
import { useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ButtonLink, Container, Input } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { cn, searchPath } from '@/utils'

const HERO_TILES = [
  { emoji: '🍌', className: 'bg-accent-100' },
  { emoji: '🌶️', className: 'bg-red-100' },
  { emoji: '🐟', className: 'bg-sky-100' },
  { emoji: '🥥', className: 'bg-brand-100' },
]

export function HomeHero() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
    if (!query) {
      inputRef.current?.focus()
      return
    }
    navigate(searchPath(query))
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream">
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-widest text-accent-600 uppercase">
            {siteConfig.tagline}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Homemade, fresh and <span className="text-brand-700">proudly Keralan</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600">
            Banana chips fried in coconut oil, stone-ground masalas, the morning&apos;s catch and
            soft appam batter, made the traditional way and stocked at neighbourhood shops across{' '}
            {siteConfig.city}.
          </p>

          <form
            role="search"
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <Input
              ref={inputRef}
              type="search"
              name="q"
              label="Search products"
              hideLabel
              placeholder="Try “banana chips” or “sambar masala”"
              icon={<Search />}
              autoComplete="off"
              containerClassName="flex-1"
              className="h-12"
            />
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink
              to="/shops"
              variant="secondary"
              size="lg"
              leftIcon={<MapPin className="size-5" aria-hidden="true" />}
            >
              Find a Shop Near You
            </ButtonLink>
            <ButtonLink to="/products" variant="ghost" size="lg">
              Browse all products
            </ButtonLink>
          </div>
        </div>

        <div className="hidden grid-cols-2 gap-4 sm:grid" aria-hidden="true">
          {HERO_TILES.map((tile, i) => (
            <div
              key={tile.emoji}
              className={cn(
                'flex aspect-square items-center justify-center rounded-3xl text-7xl shadow-sm',
                tile.className,
                i % 2 === 1 && 'translate-y-6',
              )}
            >
              {tile.emoji}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
