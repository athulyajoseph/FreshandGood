import { Quote, Star } from 'lucide-react'
import { Card, CardBody, Container, SectionHeading } from '@/components/ui'

const TESTIMONIALS = [
  {
    quote:
      'The banana chips taste exactly like the ones my ammachi used to make. Crisp, not greasy, and you can smell the coconut oil.',
    name: 'Anjali Menon',
    area: 'Edappally',
  },
  {
    quote:
      'I pick up karimeen on my way home from work. It’s always cleaned and fresh, and the shop staff know my order by now.',
    name: 'Joseph Varghese',
    area: 'Kakkanad',
  },
  {
    quote:
      'Their sambar masala has replaced the packet brand in our kitchen. My mother-in-law approves, which says everything.',
    name: 'Fathima Rasheed',
    area: 'Kaloor',
  },
  {
    quote:
      'Appam batter that actually ferments properly! Sunday breakfast is sorted, and the shop is a five-minute walk away.',
    name: 'Arun Nair',
    area: 'Tripunithura',
  },
]

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-accent-50/60 py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Kind words"
          title="Loved across Kochi"
          align="center"
          headingId="testimonials-heading"
        />
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col">
                  <Quote className="size-7 text-accent-400" aria-hidden="true" />
                  <div
                    className="mt-3 flex gap-0.5 text-accent-500"
                    role="img"
                    aria-label="Rated 5 out of 5"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm text-stone-700">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold text-stone-900">{testimonial.name}</span>
                    <span className="text-stone-500"> · {testimonial.area}</span>
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
