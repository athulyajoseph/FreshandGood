import { useId, type Ref, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>
  label: string
  error?: string
  hint?: string
  containerClassName?: string
}

/** A multi-line text field with label, hint and error, matching `Input`. */
export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  containerClassName,
  rows = 5,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const describedBy = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={textareaId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800',
          'transition-colors placeholder:text-stone-400',
          'focus:border-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-stone-100',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${textareaId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
