import { products } from '@/data/products'
import { shops } from '@/data/shops'
import type { Coordinates, Shop, ShopWithDistance } from '@/types'
import { haversineKm } from '@/utils'
import { clone, simulateLatency } from './delay'

function withDistance(list: Shop[], origin: Coordinates): ShopWithDistance[] {
  return list
    .map((shop) => ({ ...shop, distanceKm: haversineKm(origin, shop.coordinates) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

const byName = (a: Shop, b: Shop) => a.name.localeCompare(b.name)

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

  /** Shops that stock a product, sorted by name. */
  async getForProduct(productId: string): Promise<Shop[]> {
    const product = products.find((p) => p.id === productId)
    if (!product) return simulateLatency([])
    const stocking = shops.filter((s) => product.shopIds.includes(s.id)).sort(byName)
    return simulateLatency(clone(stocking))
  },

  /** Shops that stock a product, sorted nearest-first from `origin`. */
  async getForProductNearby(productId: string, origin: Coordinates): Promise<ShopWithDistance[]> {
    const product = products.find((p) => p.id === productId)
    if (!product) return simulateLatency([])
    const stocking = shops.filter((s) => product.shopIds.includes(s.id))
    return simulateLatency(clone(withDistance(stocking, origin)))
  },
}
