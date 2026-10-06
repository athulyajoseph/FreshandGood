import {
  ArrowRight,
  ChefHat,
  Fish,
  HandHeart,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Seo } from '@/components/seo'
import { Breadcrumbs, ButtonLink, Card, CardBody, Container, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { contentService } from '@/services'
import type { AboutValueIcon } from '@/types'

const VALUE_ICONS: Record<AboutValueIcon, LucideIcon> = {
  HandHeart,
  Sprout,
  Users,
  Store,
  Leaf,
  Heart,
  ChefHat,
  Sparkles,
  ShieldCheck,
  Fish,
}

const STEP_EMOJI = ['👩‍🍳', '🏪', '📍']

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export default function AboutPage() {
  const about = contentService.getAboutContent()

  return (
    <>
      <Seo
        title="About Us"
        description={`The story behind ${siteConfig.name}: homemade Kerala food from local kitchens and farms, stocked at neighbourhood shops across ${siteConfig.city}.`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-cream">
        <Container className="py-8 sm:py-12">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <div className="max-w-3xl py-10 sm:py-16">
            <p className="mb-3 text-xs font-semibold tracking-widest text-accent-600 uppercase">
              {about.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance text-stone-900 sm:text-5xl">
              {about.hero.title}
            </h1>
            <p className="mt-6 text-lg text-stone-600">{about.hero.intro}</p>
          </div>
        </Container>
      </section>

      {/* Story + mission */}
      <section aria-labelledby="story-heading" className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title={about.story.title} headingId="story-heading" />
            <div className="flex flex-col gap-5 text-base leading-relaxed text-stone-700">
              {about.story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside
            aria-labelledby="mission-heading"
            className="self-start rounded-3xl bg-brand-800 p-8 text-white sm:p-10"
          >
            <Target className="size-8 text-accent-300" aria-hidden="true" />
            <h2 id="mission-heading" className="mt-4 text-xl font-bold">
              {about.mission.title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-brand-50">{about.mission.text}</p>
            <p className="mt-6 text-sm text-brand-200">
              Serving {siteConfig.city} since {siteConfig.foundedYear}
            </p>
          </aside>
        </Container>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="Our values"
            align="center"
            headingId="values-heading"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value) => {
              const Icon = VALUE_ICONS[value.icon]
              return (
                <li key={value.title}>
                  <Card className="h-full">
                    <CardBody className="flex h-full flex-col gap-3">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3 className="font-semibold text-stone-900">{value.title}</h3>
                      <p className="text-sm text-stone-600">{value.description}</p>
                    </CardBody>
                  </Card>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="From our kitchen to your table"
            title={about.howItWorks.title}
            align="center"
            headingId="how-heading"
          />
          <ol className="grid gap-6 md:grid-cols-3">
            {about.howItWorks.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-stone-200 bg-white p-6 text-center sm:p-8"
              >
                <span
                  className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent-100 text-3xl"
                  aria-hidden="true"
                >
                  {STEP_EMOJI[index] ?? '✨'}
                </span>
                <p className="mt-4 text-xs font-semibold tracking-widest text-accent-600 uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Team */}
      <section aria-labelledby="team-heading" className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Meet the team"
            title={about.team.title}
            subtitle={about.team.intro}
            align="center"
            headingId="team-heading"
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.team.members.map((member) => (
              <li key={member.name} className="flex flex-col items-center text-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`Portrait of ${member.name}`}
                    width={112}
                    height={112}
                    loading="lazy"
                    decoding="async"
                    className="size-28 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex size-28 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-800"
                    aria-hidden="true"
                  >
                    {initials(member.name)}
                  </span>
                )}
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{member.name}</h3>
                <p className="text-sm font-medium text-brand-700">{member.role}</p>
                <p className="mt-2 max-w-xs text-sm text-stone-600">{member.bio}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section aria-labelledby="about-cta-heading" className="py-14 sm:py-20">
        <Container>
          <div className="rounded-3xl bg-accent-100 px-6 py-12 text-center sm:px-12">
            <h2
              id="about-cta-heading"
              className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl"
            >
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-700">{about.cta.text}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink
                to="/shops"
                size="lg"
                leftIcon={<MapPin className="size-5" aria-hidden="true" />}
              >
                Find a shop near you
              </ButtonLink>
              <ButtonLink
                to="/products"
                variant="ghost"
                size="lg"
                rightIcon={<ArrowRight className="size-5" aria-hidden="true" />}
              >
                Browse products
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
