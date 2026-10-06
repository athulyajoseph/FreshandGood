import { ArrowUpRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, DietBadge, Skeleton, SmartImage } from '@/components/ui'
import type { Product } from '@/types'
import { cn, formatPrice, productPath } from '@/utils'

interface ProductCardProps {
  product: Product
  /** Heading level for the product name, to keep the page outline correct (default: h3). */
  headingAs?: 'h2' | 'h3'
  className?: string
}

export function ProductCard({ product, headingAs: Heading = 'h3', className }: ProductCardProps) {
  return (
    <Card
      variant="elevated"
      interactive
      className={cn(
        'group relative flex h-full flex-col p-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-600',
        className,
      )}
    >
      <div className="relative">
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          width={800}
          height={600}
          className="aspect-[4/3] rounded-2xl"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {product.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-accent-700 shadow-sm ring-1 ring-stone-900/5 backdrop-blur">
            <Star className="size-3 fill-accent-400 text-accent-500" aria-hidden="true" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pt-4 pb-3">
        <DietBadge isVeg={product.isVeg} />
        <Heading className="leading-snug font-semibold tracking-tight text-stone-900">
          {/* Stretched link: the whole card is clickable, but only the name is announced. */}
          <Link
            to={productPath(product.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </Heading>
        <p lang="ml" className="text-sm text-stone-500">
          {product.malayalamName}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-3">
          <p className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-tight text-stone-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-500">/ {product.unit}</span>
          </p>
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition duration-300 group-hover:bg-brand-700 group-hover:text-white motion-reduce:transition-none"
            aria-hidden="true"
          >
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card variant="elevated" className="flex h-full flex-col p-2">
      <Skeleton className="aspect-[4/3] rounded-2xl" />
      <div className="flex flex-col gap-2.5 px-3 pt-4 pb-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </Card>
  )
}
