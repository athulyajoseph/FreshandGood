import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ContactForm } from '@/components/contact/ContactForm'
import { Seo } from '@/components/seo'
import { LazyShopMap } from '@/components/shop'
import { Breadcrumbs, ButtonAnchor, Card, CardBody, Container } from '@/components/ui'
import { contactFormConfig, formatAddress, siteConfig, telLink, whatsappLink } from '@/config/site'
import type { ShopResult } from '@/types'
import { directionsUrl, formatOpeningHours } from '@/utils'

const { contact } = siteConfig
const formConfigured = Boolean(contactFormConfig.endpoint && contactFormConfig.accessKey)
const whatsappHref = whatsappLink(`Hi ${siteConfig.name}! I have a question.`)

/** The office, shaped like a shop so the shared map component can show it. */
const office: ShopResult = {
  id: 'office',
  slug: 'office',
  name: siteConfig.legalName,
  area: 'Head office',
  address: contact.address.street,
  city: contact.address.city,
  pincode: contact.address.pincode,
  phone: contact.phone,
  coordinates: contact.coordinates,
  hours: contact.hours,
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <li>
      <Card className="h-full">
        <CardBody className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 text-sm">
            <h2 className="font-semibold text-stone-900">{title}</h2>
            <div className="mt-1 text-stone-600">{children}</div>
          </div>
        </CardBody>
      </Card>
    </li>
  )
}

const linkClass = 'rounded font-medium text-brand-700 hover:text-brand-800 hover:underline'

const OFFICE_SHOPS = [office]

/** Shown instead of the form when the form service isn't configured. */
function ContactFallback() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-stone-900">Send us a message</h2>
      <p className="mt-2 text-sm text-stone-600">
        Our online form is taking a break right now, but we’d still love to hear from you. Drop us
        an email or a WhatsApp message and we’ll get back to you within one working day.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonAnchor
          href={`mailto:${contact.email}`}
          leftIcon={<Mail className="size-4" aria-hidden="true" />}
        >
          Email us
        </ButtonAnchor>
        <ButtonAnchor
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          leftIcon={<MessageCircle className="size-4" aria-hidden="true" />}
        >
          Chat on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </ButtonAnchor>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Us"
        description={`Questions about our products, want to stock ${siteConfig.name} in your shop, or have feedback? Call, email or WhatsApp our team in ${siteConfig.city}.`}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Contact' }]} className="mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Have a question about a product, want to stock {siteConfig.name} in your shop, or just
          want to say hello? We’re a friendly bunch — send us a message and we’ll reply soon.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="sr-only">
              Contact form
            </h2>
            {formConfigured ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
                <ContactForm />
              </div>
            ) : (
              <ContactFallback />
            )}
          </section>

          <section aria-label="Contact details" className="flex flex-col gap-6">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard icon={MapPin} title="Visit us">
                <p>{formatAddress()}</p>
                <a
                  href={directionsUrl(contact.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} mt-1 inline-block`}
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </InfoCard>
              <InfoCard icon={Phone} title="Call us">
                <a href={telLink(contact.phone)} className={linkClass}>
                  {contact.phone}
                </a>
              </InfoCard>
              <InfoCard icon={Mail} title="Email us">
                <a href={`mailto:${contact.email}`} className={`${linkClass} break-all`}>
                  {contact.email}
                </a>
              </InfoCard>
              <InfoCard icon={MessageCircle} title="WhatsApp">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Chat with us on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </InfoCard>
              <InfoCard icon={Clock} title="Office hours">
                <p>{formatOpeningHours(contact.hours)}</p>
                <p className="mt-1 text-xs text-stone-500">
                  Shop hours vary — see{' '}
                  <Link to="/shops" className={linkClass}>
                    Find a Shop
                  </Link>
                  .
                </p>
              </InfoCard>
            </ul>

            <LazyShopMap
              shops={OFFICE_SHOPS}
              label={`Map showing the ${siteConfig.name} office`}
              className="h-64"
            />
          </section>
        </div>
      </Container>
    </>
  )
}
