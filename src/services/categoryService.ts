import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Category, CategoryWithCount } from '@/types'
import { clone, simulateLatency } from './delay'

function withCount(category: Category): CategoryWithCount {
  return {
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }
}

export const categoryService = {
  /** All categories with their product counts, in display order. */
  async getAll(): Promise<CategoryWithCount[]> {
    return simulateLatency(clone(categories.map(withCount)))
  },

  /** A single category by slug, or `null` if none matches. */
  async getBySlug(slug: string): Promise<CategoryWithCount | null> {
    const category = categories.find((c) => c.slug === slug)
    return simulateLatency(category ? clone(withCount(category)) : null)
  },

  /** A single category by ID, or `null` if none matches. */
  async getById(id: string): Promise<CategoryWithCount | null> {
    const category = categories.find((c) => c.id === id)
    return simulateLatency(category ? clone(withCount(category)) : null)
  },
}
