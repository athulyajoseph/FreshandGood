import { ArrowLeft, Home, MapPin, ShoppingBasket } from 'lucide-react'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CategoryLinks } from '@/components/category'
import { SearchBar } from '@/components/search'
import { Seo } from '@/components/seo'
import { Button, ButtonLink, Container } from '@/components/ui'
import { useAsync } from '@/hooks'
import { categoryService } from '@/services'

function CategorySuggestions() {
  const { data: categories, status } = useAsync(useCallback(() => categoryService.getAll(), []))

  // Suggestions are a nice-to-have; hide them quietly if they fail to load.
  if (status === 'error') return null

  return (
    <section aria-labelledby="popular-categories" className="mt-14 w-full">
      <h2
        id="popular-categories"
        className="text-sm font-semibold tracking-widest text-stone-500 uppercase"
      >
        Or browse a category
      </h2>
      <CategoryLinks categories={categories} className="mt-4" />
    </section>
  )
}

export default function NotFoundPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for doesn't exist or has moved."
        noIndex
      />
      <Container className="flex flex-col items-center py-16 text-center sm:py-24">
        <div className="relative">
          <p
            className="text-[7rem] leading-none font-extrabold tracking-tighter text-brand-100 select-none sm:text-[10rem]"
            aria-hidden="true"
          >
            404
          </p>
          <span
            className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl"
            aria-hidden="true"
          >
            🥥
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          This page has rolled away
        </h1>
        <p className="mt-3 max-w-lg text-stone-600">
          We couldn&apos;t find{' '}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm break-all text-stone-800">
            {pathname}
          </code>
          . It may have moved, or the link might be mistyped. Try searching for what you need:
        </p>

        <SearchBar showSubmitButton className="mt-6 w-full max-w-lg text-left" />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" leftIcon={<Home className="size-4" aria-hidden="true" />}>
            Go to home
          </ButtonLink>
          <ButtonLink
            to="/products"
            variant="secondary"
            leftIcon={<ShoppingBasket className="size-4" aria-hidden="true" />}
          >
            Browse products
          </ButtonLink>
          <ButtonLink
            to="/shops"
            variant="outline"
            leftIcon={<MapPin className="size-4" aria-hidden="true" />}
          >
            Find a shop
          </ButtonLink>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>

        <CategorySuggestions />
      </Container>
    </>
  )
}
