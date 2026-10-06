import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  /** Optional count shown on the right, e.g. the number of matching products. */
  count?: number
}

export function Checkbox({ label, count, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-stone-100',
        props.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        className="size-4 shrink-0 cursor-pointer rounded border-stone-300 accent-brand-700"
        {...props}
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-stone-500">
          {count}
          <span className="sr-only"> products</span>
        </span>
      )}
    </label>
  )
}
