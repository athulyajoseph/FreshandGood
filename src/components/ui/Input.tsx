import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cn } from '@/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  label?: string
  /** Visually hide the label while keeping it for screen readers. */
  hideLabel?: boolean
  /** Icon rendered inside the field on the left. */
  icon?: ReactNode
  error?: string
  hint?: string
  containerClassName?: string
}

export function Input({
  label,
  hideLabel,
  icon,
  error,
  hint,
  id,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('text-sm font-medium text-stone-700', hideLabel && 'sr-only')}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400 [&_svg]:size-4">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-full border border-stone-300 bg-white px-4 text-sm text-stone-800',
            'transition-colors placeholder:text-stone-400',
            'focus:border-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-stone-100',
            icon && 'pl-9',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
