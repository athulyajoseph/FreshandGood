import { PackageOpen } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState, ErrorState } from '@/components/ui'
import type { AsyncStatus } from '@/hooks'
import type { Product } from '@/types'
import { cn } from '@/utils'
import { ProductCard, ProductCardSkeleton } from './ProductCard'

const columnClasses = {
  /** For full-width sections. */
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  /** For layouts with a sidebar. */
  3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
} as const

interface ProductGridProps {
  products: Product[] | undefined
  status: AsyncStatus
  onRetry?: () => void
  columns?: keyof typeof columnClasses
  skeletonCount?: number
  /** Replaces the default "no products" message. */
  empty?: ReactNode
  headingAs?: 'h2' | 'h3'
  className?: string
}

/** Responsive product grid with loading, error and empty states. */
export function ProductGrid({
  products,
  status,
  onRetry,
  columns = 4,
  skeletonCount = 8,
  empty,
  headingAs,
  className,
}: ProductGridProps) {
  const gridClass = cn('grid gap-4 sm:gap-6', columnClasses[columns], className)

  if (status === 'error') {
    return <ErrorState className={className} title="Couldn’t load products" onRetry={onRetry} />
  }

  if (status === 'loading' || !products) {
    return (
      <div className={gridClass} aria-busy="true">
        <span className="sr-only">Loading products…</span>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      empty ?? (
        <EmptyState
          className={className}
          icon={<PackageOpen />}
          title="No products yet"
          description="Please check back soon."
        />
      )
    )
  }

  return (
    <ul className={gridClass}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} headingAs={headingAs} />
        </li>
      ))}
    </ul>
  )
}
