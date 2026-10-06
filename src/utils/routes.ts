/** Builders for in-app URLs, so route shapes live in one place. */

export const categoryPath = (slug: string): string => `/category/${slug}`

export const productPath = (slug: string): string => `/product/${slug}`

/** All products filtered to a single tag, e.g. `/products?tags=sweet`. */
export const productsWithTagPath = (tag: string): string =>
  `/products?${new URLSearchParams({ tags: tag })}`

export const searchPath = (query: string): string =>
  `/search?${new URLSearchParams({ q: query.trim() })}`
