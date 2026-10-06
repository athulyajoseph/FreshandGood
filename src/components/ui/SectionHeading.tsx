import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface SectionHeadingProps {
  title: string
  /** Small uppercase label above the title. */
  eyebrow?: string
  subtitle?: ReactNode
  /** Right-aligned slot, e.g. a "View all" link. */
  action?: ReactNode
  /** Heading level (default: 2). */
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  action,
  as: Heading = 'h2',
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 sm:mb-8',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent-600 uppercase">
            {eyebrow}
          </p>
        )}
        <Heading
          className={cn(
            'font-bold tracking-tight text-stone-900',
            Heading === 'h1' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
          )}
        >
          {title}
        </Heading>
        {subtitle && <p className="mt-2 text-base text-stone-600">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
