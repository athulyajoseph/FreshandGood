import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Product, ProductFilters, ProductSortOption } from '@/types'
import { clone, simulateLatency } from './delay'

function matchesQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [product.name, product.malayalamName, product.description, product.origin, ...product.tags]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

function applyFilters(list: Product[], filters: ProductFilters): Product[] {
  const categoryId = filters.category
    ? categories.find((c) => c.slug === filters.category)?.id
    : undefined

  // An unknown category slug matches nothing rather than everything.
  if (filters.category && !categoryId) return []

  return list.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false
    if (filters.diet === 'veg' && !p.isVeg) return false
    if (filters.diet === 'non-veg' && p.isVeg) return false
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
    if (filters.shopId && !p.shopIds.includes(filters.shopId)) return false
    if (filters.query && !matchesQuery(p, filters.query)) return false
    return true
  })
}

function applySort(list: Product[], sort: ProductSortOption): Product[] {
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

export const productService = {
  /** Products matching the given filters, sorted. */
  async getAll(
    filters: ProductFilters = {},
    sort: ProductSortOption = 'featured',
  ): Promise<Product[]> {
    return simulateLatency(clone(applySort(applyFilters(products, filters), sort)))
  },

  /** A single product by slug, or `null` if none matches. */
  async getBySlug(slug: string): Promise<Product | null> {
    const product = products.find((p) => p.slug === slug)
    return simulateLatency(product ? clone(product) : null)
  },

  /** Featured products for the home page. */
  async getFeatured(limit = 8): Promise<Product[]> {
    return simulateLatency(clone(products.filter((p) => p.isFeatured).slice(0, limit)))
  },

  /** All products in a category, identified by category slug. */
  async getByCategory(
    categorySlug: string,
    sort: ProductSortOption = 'featured',
  ): Promise<Product[]> {
    return productService.getAll({ category: categorySlug }, sort)
  },

  /** Other products from the same category, excluding the given product. */
  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    const product = products.find((p) => p.id === productId)
    if (!product) return simulateLatency([])
    const related = products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, limit)
    return simulateLatency(clone(related))
  },

  /** Products stocked by a given shop, sorted by name. */
  async getByShop(shopId: string): Promise<Product[]> {
    return productService.getAll({ shopId }, 'name-asc')
  },
}
