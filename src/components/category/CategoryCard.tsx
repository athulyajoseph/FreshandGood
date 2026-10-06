import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Skeleton, SmartImage } from '@/components/ui'
import type { CategoryWithCount } from '@/types'
import { categoryPath, cn, pluralize } from '@/utils'

interface CategoryCardProps {
  category: CategoryWithCount
  /** Heading level for the category name (default: h3). */
  headingAs?: 'h2' | 'h3'
  className?: string
}

export function CategoryCard({
  category,
  headingAs: Heading = 'h3',
  className,
}: CategoryCardProps) {
  return (
    <Card
      interactive
      className={cn(
        'group relative flex h-full flex-col has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-600',
        className,
      )}
    >
      <SmartImage
        src={category.image}
        alt={category.name}
        width={600}
        height={400}
        className="aspect-[3/2]"
        imgClassName="transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
      />
      <CardBody className="flex flex-1 flex-col gap-1">
        <Heading className="leading-snug font-semibold text-stone-900">
          <Link
            to={categoryPath(category.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {category.name}
          </Link>
        </Heading>
        <p lang="ml" className="text-xs text-stone-500">
          {category.malayalamName}
        </p>
        <p className="mt-auto flex items-center justify-between pt-2 text-sm text-stone-600">
          {pluralize(category.productCount, 'product')}
          <ArrowRight
            className="size-4 text-brand-700 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </p>
      </CardBody>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="aspect-[3/2] rounded-none" />
      <CardBody className="flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2 h-4 w-20" />
      </CardBody>
    </Card>
  )
}
