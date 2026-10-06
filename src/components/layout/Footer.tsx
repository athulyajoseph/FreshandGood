import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui'
import { formatAddress, siteConfig, telLink, whatsappLink } from '@/config/site'
import { formatOpeningHours } from '@/utils'
import { Logo } from './Logo'

const shopLinks = [
  { label: 'All products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'Fruits & Vegetables', to: '/category/fruits-and-vegetables' },
  { label: 'Spices & Masalas', to: '/category/spices-and-masalas' },
  { label: 'Seafood & Meat', to: '/category/seafood-and-meat' },
]

const companyLinks = [
  { label: 'Find a Shop', to: '/shops' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function FooterLinks({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-brand-100/80 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { contact } = siteConfig
  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-brand-100/80">
            Fresh Kerala produce, spices and staples from trusted neighbourhood shops across{' '}
            {siteConfig.city}.
          </p>
        </div>

        <FooterLinks title="Shop" links={shopLinks} />
        <FooterLinks title="Company" links={companyLinks} />

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-100/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{formatAddress()}</span>
            </li>
            <li>
              <a href={telLink(contact.phone)} className="flex gap-2 hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex gap-2 break-all hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(`Hi ${siteConfig.name}! I have a question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 hover:text-white"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Chat on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{formatOpeningHours(contact.hours)}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-brand-100/60 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Made with coconut oil in Kochi, Kerala.</p>
        </Container>
      </div>
    </footer>
  )
}
