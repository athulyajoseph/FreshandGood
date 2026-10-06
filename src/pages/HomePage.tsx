import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { CategoryGrid } from '@/components/category'
import { HomeHero } from '@/components/home/HomeHero'
import { NearbyShops } from '@/components/home/NearbyShops'
import { Testimonials } from '@/components/home/Testimonials'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductGrid } from '@/components/product'
import { PageMeta } from '@/components/seo/PageMeta'
import { ButtonLink, Container, SectionHeading } from '@/components/ui'
import { useAsync } from '@/hooks'
import { categoryService, productService } from '@/services'

const FEATURED_LIMIT = 8

function ViewAllLink({ to, children }: { to: string; children: string }) {
  return (
    <ButtonLink
      to={to}
      variant="ghost"
      size="sm"
      className="text-brand-700"
      rightIcon={<ArrowRight className="size-4" aria-hidden="true" />}
    >
      {children}
    </ButtonLink>
  )
}

export default function HomePage() {
  const categories = useAsync(useCallback(() => categoryService.getAll(), []))
  const featured = useAsync(useCallback(() => productService.getFeatured(FEATURED_LIMIT), []))

  return (
    <>
      <PageMeta description="Homemade Kerala snacks, stone-ground masalas, fresh produce and the morning's catch, stocked at partner shops near you across Kochi." />

      <HomeHero />

      <section aria-labelledby="categories-heading" className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Shop by Category"
            subtitle="From the farm, the backwaters and Kerala's spice hills."
            headingId="categories-heading"
            action={<ViewAllLink to="/categories">All categories</ViewAllLink>}
          />
          <CategoryGrid
            categories={categories.data}
            status={categories.status}
            onRetry={categories.retry}
          />
        </Container>
      </section>

      <section aria-labelledby="featured-heading" className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured Products"
            subtitle="Our customers' favourites, made fresh this week."
            headingId="featured-heading"
            action={<ViewAllLink to="/products">View all products</ViewAllLink>}
          />
          <ProductGrid
            products={featured.data}
            status={featured.status}
            onRetry={featured.retry}
            skeletonCount={FEATURED_LIMIT}
          />
        </Container>
      </section>

      <WhyChooseUs />
      <NearbyShops />
      <Testimonials />
    </>
  )
}
