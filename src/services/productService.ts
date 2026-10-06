import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Product, ProductFilters, ProductSortOption } from '@/types'
import { filterProducts, sortProducts } from '@/utils'
import { clone, simulateLatency } from './delay'

function applyFilters(list: Product[], filters: ProductFilters): Product[] {
  const { category, categories: categorySlugs, ...rest } = filters
  const slugs = [...(category ? [category] : []), ...(categorySlugs ?? [])]
  const categoryIds = slugs.flatMap((slug) => {
    const id = categories.find((c) => c.slug === slug)?.id
    return id ? [id] : []
  })

  // Unknown category slugs match nothing rather than everything.
  if (slugs.length > 0 && categoryIds.length === 0) return []

  return filterProducts(list, { ...rest, categoryIds })
}

export const productService = {
  /** Products matching the given filters, sorted. */
  async getAll(
    filters: ProductFilters = {},
    sort: ProductSortOption = 'featured',
  ): Promise<Product[]> {
    return simulateLatency(clone(sortProducts(applyFilters(products, filters), sort)))
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
