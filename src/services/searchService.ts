import type Fuse from 'fuse.js'
import type { FuseResult, IFuseOptions } from 'fuse.js'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Category, Product, SearchHit, SearchResults } from '@/types'
import { clone } from './delay'

interface ProductDoc extends Product {
  categoryName: string
}

const SHARED_OPTIONS = {
  includeMatches: true,
  includeScore: true,
  // Match anywhere in a field, not just near the start.
  ignoreLocation: true,
  // 0 is an exact match, 1 matches anything. 0.3 tolerates a typo or two per word
  // ("masla" → Masala, "chiken" → Chicken, "banan chps" → Banana Chips).
  threshold: 0.3,
  minMatchCharLength: 2,
} satisfies IFuseOptions<unknown>

/**
 * Drop weak overall matches. Fuzzy matching against long descriptions can find scattered
 * letters for almost any query; results scoring above this are noise rather than typos.
 */
const MAX_SCORE = 0.6

/** Strong results only, capped at `limit`. */
function relevant<T>(results: FuseResult<T>[], limit?: number): FuseResult<T>[] {
  const strong = results.filter((r) => (r.score ?? 0) <= MAX_SCORE)
  return limit ? strong.slice(0, limit) : strong
}

const PRODUCT_OPTIONS: IFuseOptions<ProductDoc> = {
  ...SHARED_OPTIONS,
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'tags', weight: 0.2 },
    { name: 'malayalamName', weight: 0.1 },
    { name: 'categoryName', weight: 0.1 },
    { name: 'description', weight: 0.1 },
  ],
}

const CATEGORY_OPTIONS: IFuseOptions<Category> = {
  ...SHARED_OPTIONS,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'description', weight: 0.3 },
  ],
}

interface Indexes {
  products: Fuse<ProductDoc>
  categories: Fuse<Category>
  /** Product names, category names and tags, for "Did you mean…?" suggestions. */
  vocabulary: Fuse<string>
}

let indexes: Promise<Indexes> | null = null

/**
 * Builds the search indexes on first use, then reuses them. Fuse.js is loaded on demand, so it
 * stays out of the initial bundle until someone actually searches.
 */
function getIndexes(): Promise<Indexes> {
  indexes ??= import('fuse.js').then(({ default: FuseClass }) => buildIndexes(FuseClass))
  return indexes
}

function buildIndexes(FuseClass: typeof Fuse): Indexes {
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]))
  const productDocs = products.map((p) => ({
    ...p,
    categoryName: categoryNames.get(p.categoryId) ?? '',
  }))
  const terms = new Set([
    ...products.map((p) => p.name),
    ...categories.map((c) => c.name),
    ...products.flatMap((p) => p.tags),
  ])

  return {
    products: new FuseClass(productDocs, PRODUCT_OPTIONS),
    categories: new FuseClass(categories, CATEGORY_OPTIONS),
    vocabulary: new FuseClass([...terms], { threshold: 0.6, ignoreLocation: true }),
  }
}

/** Ranges that matched in the `name` field, ignoring single stray characters. */
function nameMatches<T>(result: FuseResult<T>): [number, number][] {
  return (result.matches ?? [])
    .filter((match) => match.key === 'name')
    .flatMap((match) => match.indices.filter(([start, end]) => end > start))
    .map(([start, end]) => [start, end] as [number, number])
}

function toHit<T>(result: FuseResult<T>): SearchHit<T> {
  return { item: result.item, nameMatches: nameMatches(result) }
}

function stripCategoryName({ categoryName: _categoryName, ...product }: ProductDoc): Product {
  return product
}

export const searchService = {
  /**
   * Typo-tolerant search over products and categories, best matches first. Resolves
   * immediately (no simulated latency) so autocomplete feels instant.
   */
  async search(
    query: string,
    { productLimit, categoryLimit }: { productLimit?: number; categoryLimit?: number } = {},
  ): Promise<SearchResults> {
    const q = query.trim()
    if (!q) return { products: [], categories: [] }

    const { products: productIndex, categories: categoryIndex } = await getIndexes()
    const productResults = relevant(productIndex.search(q), productLimit)
    const categoryResults = relevant(categoryIndex.search(q), categoryLimit)

    return clone({
      products: productResults.map((r) => {
        const hit = toHit(r)
        return { ...hit, item: stripCategoryName(hit.item) }
      }),
      categories: categoryResults.map(toHit),
    })
  },

  /** Up to `limit` known product, category or tag names that look like `query`. */
  async suggest(query: string, limit = 3): Promise<string[]> {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return (await getIndexes()).vocabulary
      .search(q, { limit: limit + 1 })
      .map((r) => r.item)
      .filter((term) => term.toLowerCase() !== q)
      .slice(0, limit)
  },
}
