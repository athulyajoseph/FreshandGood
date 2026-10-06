import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  /** Buttons or links shown below the description. */
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 [&_svg]:size-7">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      {description && <div className="mt-2 max-w-md text-sm text-stone-600">{description}</div>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  )
}
