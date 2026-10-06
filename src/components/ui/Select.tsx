import { ChevronDown } from 'lucide-react'
import { useId, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  /** Visually hide the label while keeping it for screen readers. */
  hideLabel?: boolean
  options: readonly SelectOption[]
  containerClassName?: string
}

/** A styled native `<select>`, so keyboard and screen-reader behaviour come for free. */
export function Select({
  label,
  hideLabel,
  options,
  id,
  className,
  containerClassName,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={cn('flex items-center gap-2', containerClassName)}>
      <label
        htmlFor={selectId}
        className={cn(
          'text-sm font-medium whitespace-nowrap text-stone-700',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'h-10 w-full cursor-pointer appearance-none rounded-full border border-stone-300 bg-white py-0 pr-9 pl-4 text-sm text-stone-800',
            'transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-stone-500"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
