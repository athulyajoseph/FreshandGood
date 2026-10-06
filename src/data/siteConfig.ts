import type { SiteInfo } from '@/types'

/**
 * Business and contact details, edited in one place. Used by the header, footer, WhatsApp
 * button, Contact page, About page and SEO structured data.
 *
 * The WhatsApp number and public site URL can also be overridden per deployment with the
 * `VITE_WHATSAPP_NUMBER` and `VITE_SITE_URL` environment variables.
 */
export const siteInfo: SiteInfo = {
  name: 'Fresh & Good',
  legalName: 'Fresh & Good Foods',
  tagline: 'Kerala groceries from shops near you',
  description:
    'Discover fresh Kerala produce, spices, snacks, seafood and breakfast staples, and find a Fresh & Good partner shop near you in Kochi.',
  city: 'Kochi',
  foundedYear: 2019,
  contact: {
    phone: '+91 484 240 0000',
    email: 'hello@freshandgood.example.com',
    /** Digits only, with country code. */
    whatsappNumber: '919800000000',
    address: {
      street: 'Fresh & Good Foods, MG Road, Ernakulam',
      city: 'Kochi',
      region: 'Kerala',
      pincode: '682035',
      country: 'IN',
    },
    /** Office location, shown on the Contact page map. */
    coordinates: { lat: 9.9696, lng: 76.2856 },
    /** Office / phone line hours. */
    hours: { open: '09:00', close: '18:00', closedOn: ['sun'] },
  },
  /** Social profile URLs, used for links and the Organization structured data. */
  social: [],
}
