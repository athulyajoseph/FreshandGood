import { SearchX } from 'lucide-react'
import { useCallback, useId, useRef, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { CategoryLinks } from '@/components/category'
import { ProductGrid } from '@/components/product'
import { SearchBar } from '@/components/search'
import { Seo } from '@/components/seo'
import { Breadcrumbs, Container, EmptyState, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { MIN_SEARCH_LENGTH, useAsync, useQueryParams, useSearch } from '@/hooks'
import { categoryService, productService, searchService } from '@/services'
import { cn, pluralize, searchPath } from '@/utils'

const TABS = ['all', 'products', 'categories'] as const
type Tab = (typeof TABS)[number]

const TAB_LABELS: Record<Tab, string> = {
  all: 'All',
  products: 'Products',
  categories: 'Categories',
}

const FEATURED_LIMIT = 4

const isTab = (value: string | null): value is Tab => TABS.includes(value as Tab)

/** Popular categories and featured products, for empty and no-query states. */
function Discover() {
  const categories = useAsync(useCallback(() => categoryService.getAll(), []))
  const featured = useAsync(useCallback(() => productService.getFeatured(FEATURED_LIMIT), []))

  return (
    <div className="flex flex-col gap-12">
      {categories.status !== 'error' && (
        <section aria-labelledby="search-popular-categories">
          <SectionHeading title="Popular categories" headingId="search-popular-categories" />
          <CategoryLinks categories={categories.data} />
        </section>
      )}
      <section aria-labelledby="search-featured">
        <SectionHeading title="Featured products" headingId="search-featured" />
        <ProductGrid
          products={featured.data}
          status={featured.status}
          onRetry={featured.retry}
          skeletonCount={FEATURED_LIMIT}
          headingAs="h3"
        />
      </section>
    </div>
  )
}

function DidYouMean({ query }: { query: string }) {
  const { data } = useAsync(useCallback(() => searchService.suggest(query), [query]))
  if (!data?.length) return null

  return (
    <p className="mt-3 text-sm text-stone-700">
      Did you mean{' '}
      {data.map((term, index) => (
        <span key={term}>
          {index > 0 && (index === data.length - 1 ? ' or ' : ', ')}
          <Link
            to={searchPath(term)}
            className="rounded font-semibold text-brand-700 hover:underline"
          >
            {term}
          </Link>
        </span>
      ))}
      ?
    </p>
  )
}

export default function SearchPage() {
  const { get, set } = useQueryParams()
  const q = get('q') ?? ''
  const tabParam = get('tab')
  const tab: Tab = isTab(tabParam) ? tabParam : 'all'
  const { results, isLoading, isActive, query } = useSearch(q, { delayMs: 250 })

  const tabsId = useId()
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    all: null,
    products: null,
    categories: null,
  })

  const trimmed = q.trim()
  const productCount = results.products.length
  const categoryCount = results.categories.length
  const total = productCount + categoryCount
  const settled = isActive && query === trimmed && !isLoading
  const noResults = settled && total === 0
  const counts: Record<Tab, number> = {
    all: total,
    products: productCount,
    categories: categoryCount,
  }

  const selectTab = (next: Tab) => set({ tab: next === 'all' ? null : next })

  // Roving focus between tabs with the arrow keys (WAI-ARIA tabs pattern).
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(tab)
    const next =
      event.key === 'ArrowRight'
        ? TABS[(index + 1) % TABS.length]
        : event.key === 'ArrowLeft'
          ? TABS[(index - 1 + TABS.length) % TABS.length]
          : event.key === 'Home'
            ? TABS[0]
            : event.key === 'End'
              ? TABS[TABS.length - 1]
              : null
    if (!next) return
    event.preventDefault()
    selectTab(next)
    tabRefs.current[next]?.focus()
  }

  const showProducts = tab !== 'categories'
  const showCategories = tab !== 'products'
  const products = results.products.map((hit) => hit.item)
  const categories = results.categories.map((hit) => hit.item)

  return (
    <>
      <Seo
        title={trimmed ? `Search results for '${trimmed}'` : 'Search'}
        description={
          trimmed
            ? `Kerala products and categories matching “${trimmed}” at ${siteConfig.name}.`
            : 'Search Kerala produce, spices, snacks, seafood and breakfast staples.'
        }
        canonicalPath="/search"
        noIndex
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Search' }]} className="mb-6" structuredData={false} />

        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {trimmed ? (
            <>
              Results for <span className="text-brand-700">“{trimmed}”</span>
            </>
          ) : (
            'Search'
          )}
        </h1>

        <SearchBar
          size="lg"
          suggestions={false}
          showSubmitButton
          value={q}
          onValueChange={(value) => set({ q: value })}
          onSubmit={(value) => set({ q: value })}
          className="mt-6 max-w-2xl"
        />

        <p className="mt-3 min-h-5 text-sm text-stone-600" aria-live="polite">
          {!trimmed
            ? 'Search by product, category or ingredient. Small typos are fine.'
            : trimmed.length < MIN_SEARCH_LENGTH
              ? `Type at least ${MIN_SEARCH_LENGTH} characters to search.`
              : !settled
                ? 'Searching…'
                : total === 0
                  ? `No results for “${trimmed}”.`
                  : `${pluralize(productCount, 'product')} and ${pluralize(categoryCount, 'category', 'categories')} found.`}
        </p>

        {!isActive ? (
          <div className="mt-10">
            <Discover />
          </div>
        ) : noResults ? (
          <div className="mt-8 flex flex-col gap-14">
            <EmptyState
              icon={<SearchX />}
              title={`Nothing matched “${trimmed}”`}
              description={
                <>
                  Check the spelling, try a more general word like “chips” or “masala”, or browse
                  the categories below.
                  <DidYouMean query={trimmed} />
                </>
              }
            />
            <Discover />
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label="Filter results"
              className="mt-8 flex gap-1 overflow-x-auto border-b border-stone-200"
            >
              {TABS.map((value) => {
                const selected = tab === value
                return (
                  <button
                    key={value}
                    ref={(element) => {
                      tabRefs.current[value] = element
                    }}
                    type="button"
                    role="tab"
                    id={`${tabsId}-tab-${value}`}
                    aria-selected={selected}
                    aria-controls={`${tabsId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(value)}
                    onKeyDown={handleTabKeyDown}
                    className={cn(
                      '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                      selected
                        ? 'border-brand-700 text-brand-800'
                        : 'border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-900',
                    )}
                  >
                    {TAB_LABELS[value]}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
                        selected ? 'bg-brand-100 text-brand-800' : 'bg-stone-100 text-stone-600',
                      )}
                    >
                      {settled ? counts[value] : '…'}
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              id={`${tabsId}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabsId}-tab-${tab}`}
              className={cn('mt-8 flex flex-col gap-12', !settled && 'opacity-60')}
              aria-busy={!settled || undefined}
            >
              {showCategories && (tab === 'categories' || categoryCount > 0) && (
                <section aria-labelledby="search-categories-heading">
                  <h2
                    id="search-categories-heading"
                    className="mb-4 text-lg font-semibold text-stone-900"
                  >
                    Categories
                  </h2>
                  {settled && categoryCount === 0 ? (
                    <p className="text-sm text-stone-600">No categories match “{trimmed}”.</p>
                  ) : (
                    <CategoryLinks
                      categories={settled || categoryCount ? categories : undefined}
                      skeletonCount={2}
                    />
                  )}
                </section>
              )}
              {showProducts && (
                <section aria-labelledby="search-products-heading">
                  <h2
                    id="search-products-heading"
                    className="mb-4 text-lg font-semibold text-stone-900"
                  >
                    Products
                  </h2>
                  <ProductGrid
                    products={settled || productCount ? products : undefined}
                    status={settled || productCount ? 'success' : 'loading'}
                    skeletonCount={4}
                    headingAs="h3"
                    empty={<p className="text-sm text-stone-600">No products match “{trimmed}”.</p>}
                  />
                </section>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  )
}
