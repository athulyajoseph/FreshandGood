import { useCallback, useMemo } from 'react'
import { categoryService, productService } from '@/services'
import type {
  CategoryWithCount,
  DietFilter,
  Product,
  ProductFacets,
  ProductSortOption,
} from '@/types'
import { filterProducts, formatPrice, getProductFacets, sortProducts } from '@/utils'
import { useAsync } from './useAsync'
import { useQueryParams } from './useQueryParams'

export const PRODUCT_SORT_OPTIONS: readonly { value: ProductSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

const DEFAULT_SORT: ProductSortOption = 'featured'

/** URL query parameter names. */
const PARAM = {
  diet: 'diet',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  tags: 'tags',
  categories: 'categories',
  sort: 'sort',
} as const

const FILTER_PARAMS = [PARAM.diet, PARAM.minPrice, PARAM.maxPrice, PARAM.tags, PARAM.categories]

export interface ProductFilterValues {
  diet: DietFilter
  minPrice?: number
  maxPrice?: number
  tags: string[]
  /** Category slugs (only used where the category filter is enabled). */
  categories: string[]
}

export const EMPTY_PRODUCT_FILTERS: ProductFilterValues = { diet: 'all', tags: [], categories: [] }

export interface CategoryFacetOption {
  value: string
  label: string
  count: number
}

export interface FilterChip {
  id: string
  label: string
}

interface UseProductFiltersOptions {
  /** Limit the products to one category (the category page). */
  categorySlug?: string
  /** Offer a multi-select category filter (the all-products page). */
  enableCategoryFilter?: boolean
}

const NO_PRODUCTS: Product[] = []
const NO_CATEGORIES: CategoryWithCount[] = []

const isSortOption = (value: string | null): value is ProductSortOption =>
  PRODUCT_SORT_OPTIONS.some((option) => option.value === value)

const validPrice = (value: number | undefined) =>
  value !== undefined && value >= 0 ? value : undefined

function priceChipLabel(min: number | undefined, max: number | undefined): string {
  if (min !== undefined && max !== undefined) return `${formatPrice(min)} – ${formatPrice(max)}`
  if (min !== undefined) return `From ${formatPrice(min)}`
  return `Up to ${formatPrice(max ?? 0)}`
}

/**
 * Product listing state for the category and all-products pages. Loads the products in scope
 * once, then filters and sorts them in memory from URL query parameters, so filters survive a
 * refresh, can be shared as links, and update instantly.
 *
 * URL shape: `?diet=veg&minPrice=50&maxPrice=300&tags=sweet,teatime&categories=a,b&sort=price-asc`
 */
export function useProductFilters({
  categorySlug,
  enableCategoryFilter = false,
}: UseProductFiltersOptions = {}) {
  const { get, getNumber, getList, set } = useQueryParams()

  const load = useCallback(async () => {
    const [categories, products] = await Promise.all([
      categoryService.getAll(),
      categorySlug ? productService.getByCategory(categorySlug) : productService.getAll(),
    ])
    return { categories, products }
  }, [categorySlug])
  const { status, data, error, retry } = useAsync(load)

  const allCategories = data?.categories ?? NO_CATEGORIES
  const scope = data?.products ?? NO_PRODUCTS
  const category = categorySlug
    ? (allCategories.find((c) => c.slug === categorySlug) ?? null)
    : null

  // ── Read and validate the URL ──────────────────────────────────────────────────
  const filters = useMemo<ProductFilterValues>(() => {
    const dietParam = get(PARAM.diet)
    let minPrice = validPrice(getNumber(PARAM.minPrice))
    let maxPrice = validPrice(getNumber(PARAM.maxPrice))
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      ;[minPrice, maxPrice] = [maxPrice, minPrice]
    }
    return {
      diet: dietParam === 'veg' || dietParam === 'non-veg' ? dietParam : 'all',
      minPrice,
      maxPrice,
      tags: getList(PARAM.tags),
      categories: enableCategoryFilter ? getList(PARAM.categories) : [],
    }
  }, [get, getNumber, getList, enableCategoryFilter])

  const sortParam = get(PARAM.sort)
  const sort: ProductSortOption = isSortOption(sortParam) ? sortParam : DEFAULT_SORT

  // ── Derive results and facets ──────────────────────────────────────────────────
  const categoryIdBySlug = useMemo(
    () => new Map(allCategories.map((c) => [c.slug, c.id])),
    [allCategories],
  )

  const toCategoryIds = useCallback(
    (slugs: string[]) =>
      slugs.flatMap((slug) => {
        const id = categoryIdBySlug.get(slug)
        return id ? [id] : []
      }),
    [categoryIdBySlug],
  )

  const applyTo = useCallback(
    (values: ProductFilterValues) =>
      filterProducts(scope, {
        categoryIds: toCategoryIds(values.categories),
        diet: values.diet,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        tags: values.tags,
      }),
    [scope, toCategoryIds],
  )

  const products = useMemo(() => sortProducts(applyTo(filters), sort), [applyTo, filters, sort])

  /** Number of products that would match `values`; used for the drawer's Apply button. */
  const countFor = useCallback((values: ProductFilterValues) => applyTo(values).length, [applyTo])

  /**
   * Facets for a set of filter values. The price range always spans the whole scope so the
   * bounds stay put; tags narrow to the selected categories, and selected tags always stay listed.
   */
  const facetsFor = useCallback(
    (values: ProductFilterValues): ProductFacets => {
      const { priceRange } = getProductFacets(scope)
      const categoryIds = toCategoryIds(values.categories)
      const tagScope = categoryIds.length
        ? scope.filter((p) => categoryIds.includes(p.categoryId))
        : scope
      const { tags } = getProductFacets(tagScope)
      const missing = values.tags
        .filter((tag) => !tags.some((t) => t.value === tag))
        .map((value) => ({ value, count: 0 }))
      return { priceRange, tags: [...tags, ...missing] }
    },
    [scope, toCategoryIds],
  )

  const facets = useMemo(() => facetsFor(filters), [facetsFor, filters])

  const categoryOptions = useMemo<CategoryFacetOption[]>(
    () =>
      enableCategoryFilter
        ? allCategories.map((c) => ({ value: c.slug, label: c.name, count: c.productCount }))
        : [],
    [allCategories, enableCategoryFilter],
  )

  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = []
    if (filters.diet !== 'all') {
      list.push({ id: 'diet', label: filters.diet === 'veg' ? 'Veg only' : 'Non-veg only' })
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      list.push({ id: 'price', label: priceChipLabel(filters.minPrice, filters.maxPrice) })
    }
    for (const slug of filters.categories) {
      const match = allCategories.find((c) => c.slug === slug)
      if (match) list.push({ id: `category:${slug}`, label: match.name })
    }
    for (const tag of filters.tags) list.push({ id: `tag:${tag}`, label: `#${tag}` })
    return list
  }, [filters, allCategories])

  // ── Update the URL ─────────────────────────────────────────────────────────────
  const setFilters = useCallback(
    (changes: Partial<ProductFilterValues>) => {
      const updates: Record<string, string | number | string[] | null | undefined> = {}
      if ('diet' in changes) updates[PARAM.diet] = changes.diet === 'all' ? null : changes.diet
      if ('minPrice' in changes) updates[PARAM.minPrice] = changes.minPrice
      if ('maxPrice' in changes) updates[PARAM.maxPrice] = changes.maxPrice
      if ('tags' in changes) updates[PARAM.tags] = changes.tags
      if ('categories' in changes) updates[PARAM.categories] = changes.categories
      set(updates)
    },
    [set],
  )

  const setSort = useCallback(
    (next: ProductSortOption) => set({ [PARAM.sort]: next === DEFAULT_SORT ? null : next }),
    [set],
  )

  const removeChip = useCallback(
    (id: string) => {
      if (id === 'diet') setFilters({ diet: 'all' })
      else if (id === 'price') setFilters({ minPrice: undefined, maxPrice: undefined })
      else if (id.startsWith('category:')) {
        const slug = id.slice('category:'.length)
        setFilters({ categories: filters.categories.filter((c) => c !== slug) })
      } else if (id.startsWith('tag:')) {
        const tag = id.slice('tag:'.length)
        setFilters({ tags: filters.tags.filter((t) => t !== tag) })
      }
    },
    [filters, setFilters],
  )

  /** Removes every filter but keeps the sort order. */
  const clearAll = useCallback(
    () => set(Object.fromEntries(FILTER_PARAMS.map((key) => [key, null]))),
    [set],
  )

  return {
    status,
    error,
    retry,
    /** The category for `categorySlug`; `null` if it doesn't exist or isn't loaded yet. */
    category,
    /** True once loading succeeded and `categorySlug` matched no category. */
    categoryNotFound: status === 'success' && Boolean(categorySlug) && !category,
    /** Filtered and sorted products. */
    products,
    /** Number of products before filtering. */
    totalCount: scope.length,
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
  }
}

export type ProductFiltersState = ReturnType<typeof useProductFilters>
