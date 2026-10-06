import { SearchX, SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import { Button, Drawer, EmptyState, ErrorState, Skeleton } from '@/components/ui'
import { EMPTY_PRODUCT_FILTERS, type ProductFiltersState, type ProductFilterValues } from '@/hooks'
import { pluralize } from '@/utils'
import { ActiveFilterChips } from './ActiveFilterChips'
import { ProductFilters } from './ProductFilters'
import { ProductGrid } from './ProductGrid'
import { ProductSort } from './ProductSort'

interface ProductBrowserProps {
  /** The result of `useProductFilters`. */
  state: ProductFiltersState
  /** Heading for the results, read by screen readers (default: "Products"). */
  resultsLabel?: string
}

/**
 * Filterable, sortable product listing: a filter sidebar on desktop, a slide-in filter drawer
 * on mobile, a toolbar with the result count and sort order, active filter chips and the grid.
 */
export function ProductBrowser({ state, resultsLabel = 'Products' }: ProductBrowserProps) {
  const headingId = useId()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draft, setDraft] = useState<ProductFilterValues>(EMPTY_PRODUCT_FILTERS)

  const {
    status,
    retry,
    products,
    filters,
    sort,
    facets,
    facetsFor,
    countFor,
    categoryOptions,
    chips,
    setFilters,
    setSort,
    removeChip,
    clearAll,
  } = state

  if (status === 'error') {
    return <ErrorState title="Couldn’t load products" onRetry={retry} />
  }

  const isLoading = status === 'loading'

  const openDrawer = () => {
    setDraft(filters)
    setDrawerOpen(true)
  }
  const applyDraft = () => {
    setFilters(draft)
    setDrawerOpen(false)
  }
  const draftCount = countFor(draft)

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-24">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-900">Filters</h2>
            {chips.length > 0 && (
              <Button variant="ghost" size="xs" onClick={clearAll} className="underline">
                Clear all
              </Button>
            )}
          </div>
          {isLoading ? (
            <FiltersSkeleton />
          ) : (
            <ProductFilters
              value={filters}
              onChange={setFilters}
              facets={facets}
              categoryOptions={categoryOptions}
            />
          )}
        </div>
      </aside>

      <section aria-labelledby={headingId}>
        <h2 id={headingId} className="sr-only">
          {resultsLabel}
        </h2>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-stone-600" role="status" aria-live="polite">
            {isLoading ? (
              <Skeleton className="h-4 w-36" />
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-stone-900">
                  {pluralize(products.length, 'product')}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={openDrawer}
              disabled={isLoading}
              aria-haspopup="dialog"
              leftIcon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
            >
              Filters
              {chips.length > 0 && (
                <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-brand-700 text-xs text-white">
                  {chips.length}
                  <span className="sr-only"> active</span>
                </span>
              )}
            </Button>
            <ProductSort value={sort} onChange={setSort} />
          </div>
        </div>

        <ActiveFilterChips
          chips={chips}
          onRemove={removeChip}
          onClearAll={clearAll}
          className="mb-5"
        />

        <ProductGrid
          products={products}
          status={status}
          onRetry={retry}
          columns={3}
          skeletonCount={6}
          empty={
            <EmptyState
              icon={<SearchX />}
              title="No products match these filters"
              description="Try removing a filter or widening the price range."
              action={
                <Button variant="outline" onClick={clearAll}>
                  Clear all filters
                </Button>
              }
            />
          }
        />
      </section>

      {/* Mobile drawer: edits a draft that is applied on "Apply". */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        className="lg:hidden"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDraft(EMPTY_PRODUCT_FILTERS)}>
              Clear all
            </Button>
            <Button fullWidth onClick={applyDraft}>
              Apply · {pluralize(draftCount, 'product')}
            </Button>
          </div>
        }
      >
        <ProductFilters
          value={draft}
          onChange={(changes) => setDraft((current) => ({ ...current, ...changes }))}
          facets={facetsFor(draft)}
          categoryOptions={categoryOptions}
          commitPriceOnChange
        />
      </Drawer>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-7" aria-hidden="true">
      <div>
        <Skeleton className="mb-3 h-4 w-20" />
        <Skeleton className="h-10 rounded-full" />
      </div>
      <div>
        <Skeleton className="mb-3 h-4 w-12" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-14" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
      </div>
    </div>
  )
}
