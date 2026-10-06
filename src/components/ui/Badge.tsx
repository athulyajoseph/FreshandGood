import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type BadgeVariant = 'neutral' | 'brand' | 'accent' | 'danger' | 'outline'

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-stone-100 text-stone-700',
  brand: 'bg-brand-100 text-brand-800',
  accent: 'bg-accent-100 text-accent-700',
  danger: 'bg-red-100 text-red-700',
  outline: 'border border-stone-300 text-stone-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

interface DietBadgeProps {
  isVeg: boolean
  /** Show the "Veg" / "Non-veg" text next to the symbol (default: true). */
  showLabel?: boolean
  className?: string
}

/**
 * The FSSAI food-type mark: a green square with a dot for vegetarian, a brown square with a
 * triangle for non-vegetarian.
 */
export function DietBadge({ isVeg, showLabel = true, className }: DietBadgeProps) {
  const label = isVeg ? 'Veg' : 'Non-veg'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        isVeg ? 'text-green-700' : 'text-amber-900',
        className,
      )}
      title={label}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border-2 bg-white',
          isVeg ? 'border-green-700' : 'border-amber-900',
        )}
      >
        {isVeg ? (
          <span className="size-2 rounded-full bg-green-700" />
        ) : (
          <svg viewBox="0 0 10 10" className="size-2 fill-amber-900">
            <path d="M5 1 9.5 9h-9z" />
          </svg>
        )}
      </span>
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </span>
  )
}
