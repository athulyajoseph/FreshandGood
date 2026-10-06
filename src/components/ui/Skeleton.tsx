import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

/** Animated placeholder block. Size it with `className` (e.g. "h-4 w-32"). */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-stone-200/80', className)}
      {...props}
    />
  )
}
