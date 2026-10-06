import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { shops } from '@/data/shops'
import type { Coordinates, Product, Shop, ShopFilters, ShopResult, ShopWithDistance } from '@/types'
import { haversineKm } from '@/utils'
import { clone, simulateLatency } from './delay'

function withDistance(list: Shop[], origin: Coordinates): ShopWithDistance[] {
  return list
    .map((shop) => ({ ...shop, distanceKm: haversineKm(origin, shop.coordinates) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

const byName = (a: Shop, b: Shop) => a.name.localeCompare(b.name)

/** Nearest-first with distances when `origin` is given, otherwise alphabetical. */
function arrange(list: Shop[], origin?: Coordinates): ShopResult[] {
  return origin ? withDistance(list, origin) : [...list].sort(byName)
}

/** IDs of every shop that stocks at least one of `stocked`. */
function stockingShopIds(stocked: Product[]): Set<string> {
  return new Set(stocked.flatMap((p) => p.shopIds))
}

const normalise = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim()

/** Every word of `query` must appear in the shop's name, area, address, city or pincode. */
function matchesQuery(shop: Shop, query: string): boolean {
  const words = normalise(query).split(' ').filter(Boolean)
  if (words.length === 0) return true
  const haystack = normalise(
    [shop.name, shop.area, shop.address, shop.city, shop.pincode].join(' '),
  )
  // Pincodes are often typed with a space ("682 024"), so also match with spaces removed.
  const compact = haystack.replace(/\s/g, '')
  return words.every((word) => haystack.includes(word) || compact.includes(word))
}

function shopsForProductId(productId: string): Shop[] {
  const product = products.find((p) => p.id === productId)
  if (!product) return []
  return shops.filter((s) => product.shopIds.includes(s.id))
}

function shopsForCategoryId(categoryId: string): Shop[] {
  const ids = stockingShopIds(products.filter((p) => p.categoryId === categoryId))
  return shops.filter((s) => ids.has(s.id))
}

export const shopService = {
  /** All shops, sorted by name. */
  async getAll(): Promise<Shop[]> {
    return simulateLatency(clone([...shops].sort(byName)))
  },

  /** A single shop by slug, or `null` if none matches. */
  async getBySlug(slug: string): Promise<Shop | null> {
    const shop = shops.find((s) => s.slug === slug)
    return simulateLatency(shop ? clone(shop) : null)
  },

  /** Every shop with its distance from `coords`, nearest first. */
  async getShopsWithDistance(coords: Coordinates): Promise<ShopWithDistance[]> {
    return simulateLatency(clone(withDistance(shops, coords)))
  },

  /** Shops sorted nearest-first from `origin`, optionally capped by `limit` or `maxKm`. */
  async getNearby(
    origin: Coordinates,
    options: { limit?: number; maxKm?: number } = {},
  ): Promise<ShopWithDistance[]> {
    const { limit, maxKm } = options
    let result = withDistance(shops, origin)
    if (maxKm !== undefined) result = result.filter((s) => s.distanceKm <= maxKm)
    if (limit !== undefined) result = result.slice(0, limit)
    return simulateLatency(clone(result))
  },

  /** Shops whose name, area, address, city or pincode match `query`, sorted by name. */
  async searchShops(query: string): Promise<Shop[]> {
    return simulateLatency(clone(shops.filter((s) => matchesQuery(s, query)).sort(byName)))
  },

  /** Shops that stock a product: nearest-first with distances if `coords` is given, else by name. */
  async getShopsForProduct(productId: string, coords?: Coordinates): Promise<ShopResult[]> {
    return simulateLatency(clone(arrange(shopsForProductId(productId), coords)))
  },

  /** Shops that stock anything in a category: nearest-first if `coords` is given, else by name. */
  async getShopsForCategory(categoryId: string, coords?: Coordinates): Promise<ShopResult[]> {
    return simulateLatency(clone(arrange(shopsForCategoryId(categoryId), coords)))
  },

  /**
   * Shops matching every given filter (text query, category slug, product slug). Unknown slugs
   * match nothing. Nearest-first with distances if `coords` is given, else by name.
   */
  async findShops(filters: ShopFilters, coords?: Coordinates): Promise<ShopResult[]> {
    let result = [...shops]

    if (filters.category) {
      const category = categories.find((c) => c.slug === filters.category)
      const ids = new Set(category ? shopsForCategoryId(category.id).map((s) => s.id) : [])
      result = result.filter((s) => ids.has(s.id))
    }
    if (filters.product) {
      const product = products.find((p) => p.slug === filters.product)
      const ids = new Set(product?.shopIds ?? [])
      result = result.filter((s) => ids.has(s.id))
    }
    if (filters.query) {
      const query = filters.query
      result = result.filter((s) => matchesQuery(s, query))
    }

    return simulateLatency(clone(arrange(result, coords)))
  },
}
