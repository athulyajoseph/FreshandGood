import { ProductBrowser } from '@/components/product'
import { PageMeta } from '@/components/seo/PageMeta'
import { Breadcrumbs, Container, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useProductFilters } from '@/hooks'

export default function ProductsPage() {
  const state = useProductFilters({ enableCategoryFilter: true })

  return (
    <>
      <PageMeta
        title="All Products"
        description={`Shop every ${siteConfig.name} product: Kerala produce, spices, snacks, seafood and breakfast staples. Filter by category, price, veg or non-veg.`}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Products' }]} className="mb-6" />
        <SectionHeading
          as="h1"
          title="All Products"
          subtitle="Filter by category, food type, price and tags to find exactly what you need."
        />
        <ProductBrowser state={state} />
      </Container>
    </>
  )
}
