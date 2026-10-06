import { LayoutGrid } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ProductBrowser } from '@/components/product'
import { Seo } from '@/components/seo'
import {
  Breadcrumbs,
  ButtonLink,
  Container,
  EmptyState,
  Skeleton,
  SmartImage,
} from '@/components/ui'
import { useProductFilters } from '@/hooks'
import type { CategoryWithCount } from '@/types'
import { pluralize } from '@/utils'

function CategoryBanner({ category }: { category: CategoryWithCount }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="mb-2 text-xs font-semibold tracking-widest text-accent-600 uppercase">
          {pluralize(category.productCount, 'product')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {category.name}
        </h1>
        <p lang="ml" className="mt-1 text-stone-500">
          {category.malayalamName}
        </p>
        <p className="mt-4 max-w-xl text-stone-600">{category.description}</p>
      </div>
      <SmartImage
        src={category.image}
        alt=""
        width={1200}
        height={800}
        className="aspect-[3/2] md:aspect-auto"
        priority
      />
    </div>
  )
}

function CategoryBannerSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-3 p-6 sm:p-10">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="aspect-[3/2] rounded-none md:aspect-auto" />
    </div>
  )
}

function CategoryNotFound({ slug }: { slug: string }) {
  return (
    <>
      <Seo
        title="Category not found"
        description="This category doesn't exist or has moved."
        noIndex
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[{ label: 'Categories', to: '/categories' }, { label: 'Not found' }]}
          structuredData={false}
          className="mb-6"
        />
        <EmptyState
          icon={<LayoutGrid />}
          title="Category not found"
          description={
            <>
              We couldn&apos;t find a category called{' '}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 break-all">{slug}</code>.
            </>
          }
          action={
            <>
              <ButtonLink to="/categories">Browse all categories</ButtonLink>
              <ButtonLink to="/products" variant="outline">
                See all products
              </ButtonLink>
            </>
          }
        />
      </Container>
    </>
  )
}

export default function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const state = useProductFilters({ categorySlug: slug })
  const { category, categoryNotFound, status } = state

  if (categoryNotFound) return <CategoryNotFound slug={slug} />

  return (
    <>
      <Seo title={category?.name ?? 'Category'} description={category?.description} />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[{ label: 'Categories', to: '/categories' }, { label: category?.name ?? '…' }]}
          structuredData={Boolean(category)}
          className="mb-6"
        />
        {category ? (
          <CategoryBanner category={category} />
        ) : (
          status === 'loading' && <CategoryBannerSkeleton />
        )}
        <div className="mt-10">
          <ProductBrowser state={state} resultsLabel={`${category?.name ?? 'Category'} products`} />
        </div>
      </Container>
    </>
  )
}
