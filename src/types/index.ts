/** Latitude/longitude pair in decimal degrees (WGS 84). */
export interface Coordinates {
  lat: number
  lng: number
}

export interface Category {
  id: string
  slug: string
  name: string
  /** Malayalam name shown alongside the English one. */
  malayalamName: string
  description: string
  /** Decorative emoji used as a lightweight visual until real imagery exists. */
  emoji: string
  /** Banner / card image path (relative to the site root). */
  image: string
}

/** A category plus the number of products it contains. */
export interface CategoryWithCount extends Category {
  productCount: number
}

export interface Product {
  id: string
  slug: string
  name: string
  malayalamName: string
  categoryId: string
  description: string
  /** Price in Indian rupees for one `unit`. */
  price: number
  /** Selling unit, e.g. "1 kg", "500 g", "250 ml". */
  unit: string
  isVeg: boolean
  /** Where the product is typically sourced from, e.g. "Wayanad". */
  origin: string
  tags: string[]
  isFeatured: boolean
  emoji: string
  /** Gallery image paths; the first is the primary image. */
  images: string[]
  ingredients: string[]
  /** Human-readable shelf life, e.g. "6 months in an airtight container". */
  shelfLife: string
  /** IDs of shops that stock this product. Every ID must exist in the shop list. */
  shopIds: string[]
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface OpeningHours {
  /** 24h "HH:mm" */
  open: string
  /** 24h "HH:mm" */
  close: string
  /** Days the shop is closed. */
  closedOn: Weekday[]
}

export interface Shop {
  id: string
  slug: string
  name: string
  /** Neighbourhood, e.g. "Edappally". */
  area: string
  address: string
  city: string
  pincode: string
  phone: string
  coordinates: Coordinates
  hours: OpeningHours
}

/** A shop annotated with its distance from a reference point. */
export interface ShopWithDistance extends Shop {
  distanceKm: number
}

export type DietFilter = 'all' | 'veg' | 'non-veg'

export interface ProductFilters {
  /** Category slug. */
  category?: string
  /** Category slugs; a product matches if it is in any of them. */
  categories?: string[]
  /** A product matches if it has any of these tags. */
  tags?: string[]
  /** Free-text search across name, Malayalam name, description and tags. */
  query?: string
  diet?: DietFilter
  minPrice?: number
  maxPrice?: number
  /** Only products stocked by this shop. */
  shopId?: string
}

/** Filter options available for a set of products. */
export interface ProductFacets {
  /** Lowest and highest price in the set (both 0 when the set is empty). */
  priceRange: { min: number; max: number }
  /** Every tag in the set with the number of products carrying it, most common first. */
  tags: { value: string; count: number }[]
}

export type ProductSortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export type ShopSortOption = 'distance' | 'name'

/** A shop that carries `distanceKm` only when the user's location is known. */
export type ShopResult = Shop & Partial<Pick<ShopWithDistance, 'distanceKm'>>

/** Criteria for the Find a Shop page. Category and product are identified by slug. */
export interface ShopFilters {
  /** Free-text search across shop name, area, address, city and pincode. */
  query?: string
  category?: string
  product?: string
}
