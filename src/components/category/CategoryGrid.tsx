import { ErrorState } from '@/components/ui'
import type { AsyncStatus } from '@/hooks'
import type { CategoryWithCount } from '@/types'
import { cn } from '@/utils'
import { CategoryCard, CategoryCardSkeleton } from './CategoryCard'

interface CategoryGridProps {
  categories: CategoryWithCount[] | undefined
  status: AsyncStatus
  onRetry?: () => void
  skeletonCount?: number
  headingAs?: 'h2' | 'h3'
  className?: string
}

/** Responsive grid of category cards with loading and error states. */
export function CategoryGrid({
  categories,
  status,
  onRetry,
  skeletonCount = 5,
  headingAs,
  className,
}: CategoryGridProps) {
  const gridClass = cn('grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5', className)

  if (status === 'error') {
    return <ErrorState className={className} title="Couldn’t load categories" onRetry={onRetry} />
  }

  if (status === 'loading' || !categories) {
    return (
      <div className={gridClass} aria-busy="true">
        <span className="sr-only">Loading categories…</span>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <ul className={gridClass}>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} headingAs={headingAs} />
        </li>
      ))}
    </ul>
  )
}
