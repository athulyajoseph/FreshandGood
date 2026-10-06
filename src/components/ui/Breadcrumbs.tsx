import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/components/seo/structuredData'
import { cn } from '@/utils'

export interface BreadcrumbItem {
  label: string
  /** Omit for the current page (the last item). */
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  /** Emit BreadcrumbList structured data (default: true). Turn off while labels are loading. */
  structuredData?: boolean
}

/** Breadcrumb trail. "Home" is always prepended. */
export function Breadcrumbs({ items, className, structuredData = true }: BreadcrumbsProps) {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      {structuredData && <JsonLd data={breadcrumbLd(items, pathname)} />}
      <ol className="flex flex-wrap items-center gap-1 text-stone-500">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded hover:text-brand-700"
            aria-label="Home"
          >
            <Home className="size-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              <ChevronRight className="size-4 text-stone-400" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link to={item.to} className="rounded hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span
                  className="max-w-[16rem] truncate font-medium text-stone-800"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
