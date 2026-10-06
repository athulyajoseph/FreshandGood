const PLACEHOLDER_WHATSAPP = '919800000000'

export const siteConfig = {
  name: 'Fresh & Good',
  tagline: 'Kerala groceries from shops near you',
  description:
    'Discover fresh Kerala produce, spices, snacks, seafood and breakfast staples, and find a Fresh & Good partner shop near you in Kochi.',
  url: (import.meta.env.VITE_SITE_URL ?? 'https://freshandgood.example.com').replace(/\/$/, ''),
  city: 'Kochi',
  contact: {
    phone: '+91 484 240 0000',
    email: 'hello@freshandgood.example.com',
    address: 'Fresh & Good Foods, MG Road, Ernakulam, Kochi 682035',
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER ?? PLACEHOLDER_WHATSAPP).replace(
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
