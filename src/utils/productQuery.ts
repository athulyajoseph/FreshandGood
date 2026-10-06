import type { DietFilter, Product, ProductFacets, ProductSortOption } from '@/types'

/**
 * Filter criteria with categories already resolved to IDs. Shared by `productService` and
 * `useProductFilters` so filtering behaves identically on the "server" and in the browser.
 */
export interface ProductCriteria {
  /** A product matches if it is in any of these categories. */
  categoryIds?: string[]
  diet?: DietFilter
  minPrice?: number
  maxPrice?: number
  /** A product matches if it has any of these tags. */
  tags?: string[]
  shopId?: string
  /** Free-text search across name, Malayalam name, description, origin and tags. */
  query?: string
}

function matchesQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [product.name, product.malayalamName, product.description, product.origin, ...product.tags]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

export function filterProducts(list: Product[], criteria: ProductCriteria): Product[] {
  const { categoryIds, diet, minPrice, maxPrice, tags, shopId, query } = criteria
  return list.filter((p) => {
    if (categoryIds?.length && !categoryIds.includes(p.categoryId)) return false
    if (diet === 'veg' && !p.isVeg) return false
    if (diet === 'non-veg' && p.isVeg) return false
    if (minPrice !== undefined && p.price < minPrice) return false
    if (maxPrice !== undefined && p.price > maxPrice) return false
    if (tags?.length && !tags.some((tag) => p.tags.includes(tag))) return false
    if (shopId && !p.shopIds.includes(shopId)) return false
    if (query && !matchesQuery(p, query)) return false
    return true
  })
}

export function sortProducts(list: Product[], sort: ProductSortOption): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'featured':
      // Featured first; the stable sort keeps the curated seed order otherwise.
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
  }
}

/** Price bounds and tag counts for a set of products. */
export function getProductFacets(list: Product[]): ProductFacets {
  const prices = list.map((p) => p.price)
  const tagCounts = new Map<string, number>()
  for (const product of list) {
    for (const tag of product.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }
  return {
    priceRange: prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : { min: 0, max: 0 },
    tags: [...tagCounts]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
  }
}
