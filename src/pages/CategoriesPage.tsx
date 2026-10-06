import { useCallback } from 'react'
import { CategoryGrid } from '@/components/category'
import { PageMeta } from '@/components/seo/PageMeta'
import { Breadcrumbs, Container, SectionHeading } from '@/components/ui'
import { useAsync } from '@/hooks'
import { categoryService } from '@/services'

export default function CategoriesPage() {
  const { data, status, retry } = useAsync(useCallback(() => categoryService.getAll(), []))

  return (
    <>
      <PageMeta
        title="Categories"
        description="Browse Kerala fruits and vegetables, spices and masalas, snacks and sweets, seafood and meat, and rice and breakfast staples."
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: 'Categories' }]} className="mb-6" />
        <SectionHeading
          as="h1"
          title="All Categories"
          subtitle="Everything we stock, grouped the way you'd shop for it at the market."
        />
        <CategoryGrid categories={data} status={status} onRetry={retry} headingAs="h2" />
      </Container>
    </>
  )
}
