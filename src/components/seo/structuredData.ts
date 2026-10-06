import { siteConfig } from '@/config/site'
import type { BreadcrumbItem } from '@/components/ui'
import type { Category, Product, Shop, Weekday } from '@/types'
import { productPath } from '@/utils'

/** schema.org JSON-LD object. */
export type JsonLdObject = Record<string, unknown>

/** Absolute URL on the public site for an in-app path. */
export const absoluteUrl = (path: string): string =>
  `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`

const ORGANIZATION_ID = `${siteConfig.url}/#organization`

const SCHEMA_DAYS: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

function postalAddress(street: string, city: string, pincode: string): JsonLdObject {
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: city,
    addressRegion: siteConfig.contact.address.region,
    postalCode: pincode,
    addressCountry: siteConfig.contact.address.country,
  }
}

function openingHours(hours: Shop['hours']): JsonLdObject {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: (Object.keys(SCHEMA_DAYS) as Weekday[])
      .filter((day) => !hours.closedOn.includes(day))
      .map((day) => SCHEMA_DAYS[day]),
    opens: hours.open,
    closes: hours.close,
  }
}

export function organizationLd(): JsonLdObject {
  const { contact } = siteConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl('/icon-512.png'),
    foundingDate: String(siteConfig.foundedYear),
    email: contact.email,
    telephone: contact.phone,
    address: postalAddress(contact.address.street, contact.address.city, contact.address.pincode),
    sameAs: siteConfig.social.map((s) => s.url),
  }
}

export function productLd(product: Product, category: Category | null): JsonLdObject {
  const url = absoluteUrl(productPath(product.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(absoluteUrl),
    sku: product.id,
    url,
    ...(category && { category: category.name }),
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      url,
      price: product.price.toFixed(2),
      priceCurrency: 'INR',
      availability:
        product.shopIds.length > 0
          ? 'https://schema.org/InStoreOnly'
          : 'https://schema.org/OutOfStock',
      seller: { '@id': ORGANIZATION_ID },
    },
  }
}

/** One schema.org Store per shop, as a graph. */
export function storesLd(shops: Shop[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@graph': shops.map((shop) => ({
      '@type': 'Store',
      '@id': absoluteUrl(`/shops#${shop.slug}`),
      name: shop.name,
      telephone: shop.phone,
      address: postalAddress(shop.address, shop.city, shop.pincode),
      geo: {
        '@type': 'GeoCoordinates',
        latitude: shop.coordinates.lat,
        longitude: shop.coordinates.lng,
      },
      openingHoursSpecification: openingHours(shop.hours),
      parentOrganization: { '@id': ORGANIZATION_ID },
    })),
  }
}

/** BreadcrumbList for a trail; "Home" is prepended and the last item is the current page. */
export function breadcrumbLd(items: BreadcrumbItem[], currentPath: string): JsonLdObject {
  const trail = [{ label: 'Home', to: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(index === trail.length - 1 ? currentPath : (item.to ?? currentPath)),
    })),
  }
}
