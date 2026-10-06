import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, CardBody, DietBadge, Skeleton, SmartImage } from '@/components/ui'
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
      interactive
      className={cn(
        'group relative flex h-full flex-col has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-600',
        className,
      )}
    >
      <div className="relative">
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
        {product.isFeatured && (
          <Badge variant="accent" className="absolute top-3 left-3 shadow-sm">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Featured
          </Badge>
        )}
      </div>

      <CardBody className="flex flex-1 flex-col gap-1.5">
        <DietBadge isVeg={product.isVeg} />
        <Heading className="leading-snug font-semibold text-stone-900">
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
        <p className="mt-auto flex items-baseline gap-1.5 pt-2">
          <span className="text-lg font-bold text-brand-800">{formatPrice(product.price)}</span>
          <span className="text-xs text-stone-500">/ {product.unit}</span>
        </p>
      </CardBody>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <CardBody className="flex flex-col gap-2.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-6 w-24" />
      </CardBody>
    </Card>
  )
}
