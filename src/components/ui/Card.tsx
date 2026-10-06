import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift and shadow for clickable cards. */
  interactive?: boolean
}

export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm',
        interactive &&
          'transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 sm:p-5', className)} {...props} />
}
