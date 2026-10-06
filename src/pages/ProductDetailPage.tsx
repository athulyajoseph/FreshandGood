import { MapPin, MessageCircle, PackageSearch, Star } from 'lucide-react'
import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductGallery, ProductGrid, ProductShopAvailability } from '@/components/product'
import { PageMeta } from '@/components/seo/PageMeta'
import {
  Badge,
  Breadcrumbs,
  ButtonAnchor,
  ButtonLink,
  Container,
  DietBadge,
  EmptyState,
  ErrorState,
  SectionHeading,
  Skeleton,
} from '@/components/ui'
import { siteConfig, whatsappLink } from '@/config/site'
import { useAsync } from '@/hooks'
import { categoryService, productService } from '@/services'
import type { CategoryWithCount, Product } from '@/types'
import { categoryPath, formatPrice, productsWithTagPath } from '@/utils'

const RELATED_LIMIT = 4
const META_DESCRIPTION_LENGTH = 160

function metaDescription(product: Product): string {
  const text = `${product.name} (${product.unit}) for ${formatPrice(product.price)}. ${product.description}`
  return text.length > META_DESCRIPTION_LENGTH
    ? `${text.slice(0, META_DESCRIPTION_LENGTH - 1).trimEnd()}…`
    : text
}

function ProductInfo({
  product,
  category,
}: {
  product: Product
  category: CategoryWithCount | null
}) {
  const facts = [
    { label: 'Unit', value: product.unit },
    { label: 'Origin', value: product.origin },
    { label: 'Shelf life', value: product.shelfLife },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <DietBadge isVeg={product.isVeg} />
        {product.isFeatured && (
          <Badge variant="accent">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Featured
          </Badge>
        )}
        {category && (
          <Link
            to={categoryPath(category.slug)}
            className="rounded text-xs font-medium text-brand-700 hover:underline"
          >
            {category.name}
          </Link>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        {product.name}
      </h1>
      <p lang="ml" className="mt-1 text-lg text-stone-500">
        {product.malayalamName}
      </p>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-brand-800">{formatPrice(product.price)}</span>
        <span className="text-stone-500">per {product.unit}</span>
      </p>

      <p className="mt-5 text-stone-700">{product.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonAnchor
          href="#availability"
          leftIcon={<MapPin className="size-4" aria-hidden="true" />}
        >
          See where to buy
        </ButtonAnchor>
        <ButtonAnchor
          href={whatsappLink(
            `Hi ${siteConfig.name}! Is ${product.name} (${product.unit}) in stock?`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          leftIcon={<MessageCircle className="size-4" aria-hidden="true" />}
        >
          Ask on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </ButtonAnchor>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
              {fact.label}
            </dt>
            <dd className="mt-1 text-sm text-stone-800">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="ingredients-heading" className="mt-8">
        <h2 id="ingredients-heading" className="text-lg font-semibold text-stone-900">
          Ingredients
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-700">
          {product.ingredients.map((ingredient) => (
            <li key={ingredient} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      {product.tags.length > 0 && (
        <section aria-labelledby="tags-heading" className="mt-8">
          <h2 id="tags-heading" className="text-lg font-semibold text-stone-900">
            Tags
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <li key={tag}>
                <ButtonLink
                  to={productsWithTagPath(tag)}
                  variant="soft"
                  size="xs"
                  aria-label={`See all products tagged ${tag}`}
                >
                  #{tag}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function RelatedProducts({ productId }: { productId: string }) {
  const { data, status, retry } = useAsync(
    useCallback(() => productService.getRelated(productId, RELATED_LIMIT), [productId]),
  )

  // Nothing to suggest: leave the section out rather than show an empty state.
  if (status === 'success' && data?.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <SectionHeading title="You may also like" headingId="related-heading" />
      <ProductGrid products={data} status={status} onRetry={retry} skeletonCount={RELATED_LIMIT} />
    </section>
  )
}

function ProductDetailSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Loading product…</span>
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-2 h-9 w-32" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

function ProductNotFound({ slug }: { slug: string }) {
  return (
    <>
      <PageMeta
        title="Product not found"
        description="This product doesn't exist or is no longer available."
        noIndex
      />
      <Breadcrumbs
        items={[{ label: 'Products', to: '/products' }, { label: 'Not found' }]}
        className="mb-6"
      />
      <EmptyState
        icon={<PackageSearch />}
        title="Product not found"
        description={
          <>
            We couldn&apos;t find a product called{' '}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 break-all">{slug}</code>. It may
            have been renamed or removed.
          </>
        }
        action={
          <>
            <ButtonLink to="/products">Browse all products</ButtonLink>
            <ButtonLink to="/categories" variant="outline">
              View categories
            </ButtonLink>
          </>
        }
      />
    </>
  )
}

export default function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data, status, retry } = useAsync(
    useCallback(async () => {
      const product = await productService.getBySlug(slug)
      if (!product) return null
      const category = await categoryService.getById(product.categoryId)
      return { product, category }
    }, [slug]),
  )

  return (
    <Container className="py-8 sm:py-12">
      {status === 'loading' ? (
        <ProductDetailSkeleton />
      ) : status === 'error' ? (
        <>
          <PageMeta title="Product" />
          <ErrorState title="Couldn’t load this product" onRetry={retry} />
        </>
      ) : !data ? (
        <ProductNotFound slug={slug} />
      ) : (
        <>
          <PageMeta title={data.product.name} description={metaDescription(data.product)} />
          <Breadcrumbs
            items={[
              ...(data.category
                ? [{ label: data.category.name, to: categoryPath(data.category.slug) }]
                : [{ label: 'Products', to: '/products' }]),
              { label: data.product.name },
            ]}
            className="mb-6"
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              key={data.product.id}
              images={data.product.images}
              name={data.product.name}
              className="lg:sticky lg:top-24 lg:self-start"
            />
            <ProductInfo product={data.product} category={data.category} />
          </div>

          <ProductShopAvailability
            productId={data.product.id}
            productSlug={data.product.slug}
            className="mt-16 scroll-mt-24"
          />
          <RelatedProducts productId={data.product.id} />
        </>
      )}
    </Container>
  )
}
