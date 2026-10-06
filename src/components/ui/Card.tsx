import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type CardVariant = 'default' | 'elevated'

const variantClasses: Record<CardVariant, { base: string; interactive: string }> = {
  default: {
    base: 'rounded-2xl border border-stone-200 shadow-sm',
    interactive:
      'transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md',
  },
  /** Borderless with a hairline ring and soft layered shadow, for premium product tiles. */
  elevated: {
    base: 'rounded-3xl shadow-soft ring-1 ring-stone-900/5',
    interactive:
      'transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift hover:ring-stone-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  },
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  /** Adds hover lift and shadow for clickable cards. */
  interactive?: boolean
}

export function Card({ variant = 'default', interactive, className, ...props }: CardProps) {
  const styles = variantClasses[variant]
  return (
    <div
      className={cn(
        'overflow-hidden bg-white',
        styles.base,
        interactive && styles.interactive,
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 sm:p-5', className)} {...props} />
}
