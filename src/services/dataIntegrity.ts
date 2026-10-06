import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { shops } from '@/data/shops'

/**
 * Checks that every cross-reference in the seed data resolves and that IDs and slugs are
 * unique. Returns a list of problems (empty when the data is consistent).
 */
export function findDataIntegrityProblems(): string[] {
  const problems: string[] = []
  const categoryIds = new Set(categories.map((c) => c.id))
  const shopIds = new Set(shops.map((s) => s.id))

  const checkUnique = (label: string, values: string[]) => {
    const seen = new Set<string>()
    for (const value of values) {
      if (seen.has(value)) problems.push(`Duplicate ${label}: "${value}"`)
      seen.add(value)
    }
  }
  checkUnique(
    'category id',
    categories.map((c) => c.id),
  )
  checkUnique(
    'category slug',
    categories.map((c) => c.slug),
  )
  checkUnique(
    'product id',
    products.map((p) => p.id),
  )
  checkUnique(
    'product slug',
    products.map((p) => p.slug),
  )
  checkUnique(
    'shop id',
    shops.map((s) => s.id),
  )
  checkUnique(
    'shop slug',
    shops.map((s) => s.slug),
  )

  for (const product of products) {
    if (!categoryIds.has(product.categoryId)) {
      problems.push(`Product "${product.id}" references unknown category "${product.categoryId}"`)
    }
    if (product.shopIds.length === 0) {
      problems.push(`Product "${product.id}" is not stocked by any shop`)
    }
    for (const shopId of product.shopIds) {
      if (!shopIds.has(shopId)) {
        problems.push(`Product "${product.id}" references unknown shop "${shopId}"`)
      }
    }
  }

  for (const shop of shops) {
    if (!products.some((p) => p.shopIds.includes(shop.id))) {
      problems.push(`Shop "${shop.id}" stocks no products`)
    }
  }
  for (const category of categories) {
    if (!products.some((p) => p.categoryId === category.id)) {
      problems.push(`Category "${category.id}" has no products`)
    }
  }

  return problems
}
