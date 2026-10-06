import { contentService } from '@/services'

const info = contentService.getSiteInfo()

/**
 * Site-wide config: business details from src/data/siteConfig.ts, with per-deployment
 * overrides from environment variables.
 */
export const siteConfig = {
  ...info,
  /** Public site URL without a trailing slash, resolved at build time by vite.config.ts. */
  url: import.meta.env.VITE_SITE_URL,
  contact: {
    ...info.contact,
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER ?? info.contact.whatsappNumber).replace(
      /\D/g,
      '',
    ),
  },
} as const

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Products', to: '/products' },
  { label: 'Find a Shop', to: '/shops' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

/** Builds a wa.me deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** The office address on one line, e.g. "MG Road, Ernakulam, Kochi, Kerala 682035". */
export function formatAddress(address = siteConfig.contact.address): string {
  return `${address.street}, ${address.city}, ${address.region} ${address.pincode}`
}

/** `tel:` link for a display phone number. */
export const telLink = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`

/** Contact form settings. The form falls back to email / WhatsApp links when either is unset. */
export const contactFormConfig = {
  endpoint: import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim() || '',
  accessKey: import.meta.env.VITE_CONTACT_FORM_KEY?.trim() || '',
}
