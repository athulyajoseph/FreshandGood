import { ChefHat, Leaf, MapPin, ScrollText, type LucideIcon } from 'lucide-react'
import { Card, CardBody, Container, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'

const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ChefHat,
    title: 'Homemade',
    description:
      'Snacks, sweets and batters are made in small batches by home cooks and family kitchens, not factories.',
  },
  {
    icon: Leaf,
    title: 'Fresh',
    description:
      'Produce arrives every morning and seafood comes straight from the harbour, so what you buy today was picked or caught today.',
  },
  {
    icon: ScrollText,
    title: 'Traditional Recipes',
    description:
      'Masalas are stone-ground and chips are fried in pure coconut oil, the way Kerala kitchens have always done it.',
  },
  {
    icon: MapPin,
    title: 'Available Locally',
    description: `Pick everything up from a trusted neighbourhood shop near you, anywhere in ${siteConfig.city}.`,
  },
]

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our promise"
          title={`Why ${siteConfig.name}`}
          subtitle="Real Kerala food, made with care and sold close to home."
          align="center"
          headingId="why-heading"
        />
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Card className="h-full">
                <CardBody>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm text-stone-600">{description}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
