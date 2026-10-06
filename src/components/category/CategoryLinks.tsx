import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui'
import type { Category } from '@/types'
import { categoryPath, cn } from '@/utils'

interface CategoryLinksProps {
  /** `undefined` shows skeletons. */
  categories: Category[] | undefined
  skeletonCount?: number
  className?: string
}

/** Compact emoji + name tiles linking to categories, for suggestions and search results. */
export function CategoryLinks({ categories, skeletonCount = 5, className }: CategoryLinksProps) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5', className)}>
      {!categories
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <li key={i}>
              <Skeleton className="h-24 rounded-2xl" />
            </li>
          ))
        : categories.map((category) => (
            <li key={category.id}>
              <Link
                to={categoryPath(category.slug)}
                className="flex h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-stone-200 bg-white px-3 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="text-2xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="text-sm font-medium text-stone-800">{category.name}</span>
              </Link>
            </li>
          ))}
    </ul>
  )
}
