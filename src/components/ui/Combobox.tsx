import { Check, ChevronDown, X } from 'lucide-react'
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/utils'

export interface ComboboxOption {
  value: string
  label: string
  /** Secondary text shown under the label and included in matching, e.g. a category name. */
  description?: string
}

interface ComboboxProps {
  label: string
  /** Visually hide the label while keeping it for screen readers. */
  hideLabel?: boolean
  options: readonly ComboboxOption[]
  /** Selected option value, or `null` for none. */
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  /** Shown when the typed text matches no option. */
  emptyText?: string
  disabled?: boolean
  className?: string
}

const MAX_VISIBLE_OPTIONS = 50

const normalise = (text: string) => text.toLowerCase().trim()

/**
 * A searchable single-select dropdown (WAI-ARIA combobox pattern): type to filter, arrow keys
 * to move, Enter to choose, Escape to close.
 */
export function Combobox({
  label,
  hideLabel,
  options,
  value,
  onChange,
  placeholder = 'Search…',
  emptyText = 'No matches',
  disabled,
  className,
}: ComboboxProps) {
  const id = useId()
  const inputId = `${id}-input`
  const listId = `${id}-list`
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find((option) => option.value === value) ?? null

  const matches = useMemo(() => {
    const q = normalise(query)
    const filtered = q
      ? options.filter((option) =>
          normalise(`${option.label} ${option.description ?? ''}`).includes(q),
        )
      : options
    return filtered.slice(0, MAX_VISIBLE_OPTIONS)
  }, [options, query])

  const openList = () => {
    setQuery('')
    setActiveIndex(Math.max(0, selected ? options.indexOf(selected) : 0))
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  const choose = (option: ComboboxOption) => {
    onChange(option.value)
    close()
  }

  const moveActive = (index: number) => {
    setActiveIndex(index)
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList()
        else if (matches.length) moveActive(Math.min(activeIndex + 1, matches.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (open && matches.length) moveActive(Math.max(activeIndex - 1, 0))
        break
      case 'Enter':
        if (open && matches[activeIndex]) {
          event.preventDefault()
          choose(matches[activeIndex])
        }
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
        break
    }
  }

  const activeOption = open ? matches[activeIndex] : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={cn('text-sm font-medium text-stone-700', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? `${id}-option-${activeOption.value}` : undefined}
          autoComplete="off"
          disabled={disabled}
          value={open ? query : (selected?.label ?? '')}
          placeholder={open && selected ? selected.label : placeholder}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            if (!open) setOpen(true)
          }}
          onFocus={openList}
          onClick={() => !open && openList()}
          onBlur={close}
          onKeyDown={handleKeyDown}
          className={cn(
            'h-11 w-full rounded-full border border-stone-300 bg-white pr-16 pl-4 text-sm text-stone-800',
            'transition-colors placeholder:text-stone-400',
            'focus:border-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-stone-100',
          )}
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
          {selected && !disabled && (
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              aria-label={`Clear ${label.toLowerCase()}`}
              // Keep focus where it is so the list doesn't flash open.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(null)
                close()
              }}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'pointer-events-none mr-1 size-4 text-stone-500 transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className={cn(
            'absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1 shadow-lg',
            !open && 'hidden',
          )}
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-stone-500" role="presentation">
              {emptyText}
            </li>
          ) : (
            matches.map((option, index) => {
              const isSelected = option.value === value
              return (
                <li
                  key={option.value}
                  id={`${id}-option-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  // Prevent the input from blurring (and closing the list) before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
                  className={cn(
                    'flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2 text-sm',
                    index === activeIndex ? 'bg-brand-50 text-brand-900' : 'text-stone-700',
                  )}
                >
                  <Check
                    className={cn(
                      'mt-0.5 size-4 shrink-0 text-brand-700',
                      !isSelected && 'invisible',
                    )}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.description && (
                      <span className="block truncate text-xs text-stone-500">
                        {option.description}
                      </span>
                    )}
                  </span>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
