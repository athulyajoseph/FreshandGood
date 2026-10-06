import { List, Map as MapIcon, Search, Store, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import {
  LazyShopMap,
  LocationPrompt,
  ShopCard,
  ShopCardSkeleton,
  shopCardId,
} from '@/components/shop'
import {
  Breadcrumbs,
  Button,
  Combobox,
  Container,
  EmptyState,
  ErrorState,
  Input,
  Select,
  type ComboboxOption,
} from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useAsync, useDebounce, useQueryParams, useUserLocation } from '@/hooks'
import { categoryService, productService, shopService } from '@/services'
import type { ShopResult } from '@/types'
import { cn, pluralize } from '@/utils'

type View = 'list' | 'map'

const NO_SHOPS: ShopResult[] = []
const DESKTOP_QUERY = '(min-width: 1024px)'

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

export default function ShopsPage() {
  const { coords, status: locationStatus, requestLocation } = useUserLocation()
  const { get, set, clear } = useQueryParams()
  const query = get('q') ?? ''
  const category = get('category') ?? ''
  const product = get('product') ?? ''
  const debouncedQuery = useDebounce(query.trim(), 250)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<View>('list')
  const mapPanelRef = useRef<HTMLDivElement>(null)

  const filterOptions = useAsync(
    useCallback(async () => {
      const [categories, products] = await Promise.all([
        categoryService.getAll(),
        productService.getAll({}, 'name-asc'),
      ])
      return { categories, products }
    }, []),
  )

  const results = useAsync(
    useCallback(
      () =>
        shopService.findShops({ query: debouncedQuery, category, product }, coords ?? undefined),
      [debouncedQuery, category, product, coords],
    ),
    { keepPreviousData: true },
  )
  const shops = results.data ?? NO_SHOPS
  const selectedShopId = shops.some((shop) => shop.id === selectedId) ? selectedId : null

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All categories' },
      ...(filterOptions.data?.categories ?? []).map((c) => ({ value: c.slug, label: c.name })),
    ],
    [filterOptions.data],
  )

  // When a category is chosen, only offer products from it.
  const productOptions = useMemo<ComboboxOption[]>(() => {
    const data = filterOptions.data
    if (!data) return []
    const categoryNames = new Map(data.categories.map((c) => [c.id, c.name]))
    const categoryId = data.categories.find((c) => c.slug === category)?.id
    return data.products
      .filter((p) => !categoryId || p.categoryId === categoryId)
      .map((p) => ({ value: p.slug, label: p.name, description: categoryNames.get(p.categoryId) }))
  }, [filterOptions.data, category])

  const selectedProductName = filterOptions.data?.products.find((p) => p.slug === product)?.name
  const hasFilters = Boolean(query || category || product)

  const handleCategoryChange = (slug: string) => {
    const data = filterOptions.data
    const categoryId = data?.categories.find((c) => c.slug === slug)?.id
    const productCategoryId = data?.products.find((p) => p.slug === product)?.categoryId
    // Drop a product filter that no longer fits the chosen category.
    const keepProduct = !slug || !product || productCategoryId === categoryId
    set({ category: slug, product: keepProduct ? product : null })
  }

  const clearFilters = () => clear(['q', 'category', 'product'])

  // Marker clicked: highlight the card and bring it into view (when the list is showing).
  const selectFromMap = useCallback((shopId: string) => {
    setSelectedId(shopId)
    const card = document.getElementById(shopCardId(shopId))
    if (card && card.offsetParent !== null) {
      card.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
    }
  }, [])

  // "Show on map": on small screens the map is behind the List/Map toggle, so switch to it.
  const showOnMap = (shopId: string) => {
    setSelectedId(shopId)
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      setView('map')
      mapPanelRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
    }
  }

  const resultsSummary =
    results.status === 'error'
      ? ''
      : !results.data
        ? 'Loading shops…'
        : `${pluralize(shops.length, 'shop')}${selectedProductName ? ` stocking ${selectedProductName}` : ''} · ${coords ? 'nearest first' : 'sorted A–Z'}`

  return (
    <>
      <PageMeta
        title="Find a Shop"
        description={`Find your nearest ${siteConfig.name} partner shop in ${siteConfig.city}. Search by area or pincode, see opening hours, and get directions on the map.`}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Find a Shop' }]} className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Find a Shop
            </h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              {siteConfig.name} products are stocked at partner shops across {siteConfig.city}. Find
              the one nearest you, check its hours and see what it stocks.
            </p>
          </div>
          <LocationPrompt />
        </div>

        <form
          role="search"
          aria-label="Filter shops"
          onSubmit={(event) => event.preventDefault()}
          className="mt-8 grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] lg:items-end"
        >
          <Input
            type="search"
            label="Search"
            placeholder="City, area, pincode or shop name"
            icon={<Search />}
            value={query}
            onChange={(event) => set({ q: event.target.value })}
            autoComplete="off"
            containerClassName="sm:col-span-2 lg:col-span-1"
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={!filterOptions.data}
            containerClassName="flex-col items-stretch gap-1.5"
            className="h-11"
          />
          <Combobox
            label="Product"
            options={productOptions}
            value={product || null}
            onChange={(slug) => set({ product: slug })}
            placeholder="Any product"
            emptyText="No products match"
            disabled={!filterOptions.data}
          />
          <Button
            variant="ghost"
            onClick={clearFilters}
            disabled={!hasFilters}
            leftIcon={<X className="size-4" aria-hidden="true" />}
            className="justify-self-start"
          >
            Clear
          </Button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-stone-800" aria-live="polite">
              {resultsSummary}
            </p>
            {!coords && locationStatus === 'idle' && (
              <p className="mt-1 text-sm text-stone-600">
                Showing shops alphabetically.{' '}
                <button
                  type="button"
                  onClick={requestLocation}
                  className="rounded font-medium text-brand-700 hover:underline"
                >
                  Use my location
                </button>{' '}
                to sort them by distance.
              </p>
            )}
          </div>

          <div
            role="group"
            aria-label="Results view"
            className="inline-flex rounded-full border border-stone-300 bg-white p-1 lg:hidden"
          >
            {(
              [
                { value: 'list', label: 'List', icon: List },
                { value: 'map', label: 'Map', icon: MapIcon },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  view === value ? 'bg-brand-700 text-white' : 'text-stone-700 hover:bg-stone-100',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {results.status === 'error' ? (
            <ErrorState title="Couldn’t load shops" onRetry={results.retry} />
          ) : results.data && shops.length === 0 ? (
            <EmptyState
              icon={<Store />}
              title="No shops match"
              description={
                selectedProductName
                  ? `We couldn’t find a shop stocking ${selectedProductName} with these filters. Try clearing the search or picking another product.`
                  : 'No shops match these filters. Try a different area, pincode or product.'
              }
              action={
                hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
              <div
                className={cn(view === 'map' && 'hidden lg:block')}
                aria-busy={results.isLoading || undefined}
              >
                {!results.data ? (
                  <ul className="flex flex-col gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <li key={i}>
                        <ShopCardSkeleton />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul
                    className={cn(
                      'flex flex-col gap-4 transition-opacity',
                      results.isLoading && 'opacity-60',
                    )}
                  >
                    {shops.map((shop, index) => (
                      <li key={shop.id}>
                        <ShopCard
                          shop={shop}
                          userCoords={coords}
                          selected={shop.id === selectedShopId}
                          onSelect={setSelectedId}
                          onShowOnMap={showOnMap}
                          isNearest={Boolean(coords) && index === 0}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                ref={mapPanelRef}
                className={cn(
                  'scroll-mt-24 lg:sticky lg:top-24 lg:self-start',
                  view === 'list' && 'hidden lg:block',
                )}
              >
                <LazyShopMap
                  shops={shops}
                  userCoords={coords}
                  selectedShopId={selectedShopId}
                  onSelectShop={selectFromMap}
                  label="Map of matching shops"
                  className="h-[65vh] min-h-80 lg:h-[calc(100vh-8rem)]"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}
