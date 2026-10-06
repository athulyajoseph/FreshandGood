import { ArrowRight, LoaderCircle, Search, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { MIN_SEARCH_LENGTH, useSearch } from '@/hooks'
import type { Category, Product, SearchHit } from '@/types'
import { categoryPath, cn, formatPrice, pluralize, productPath, searchPath } from '@/utils'
import { Highlight } from './Highlight'

const SUGGESTION_LIMIT = 5

type Option =
  | { kind: 'category'; hit: SearchHit<Category>; to: string }
  | { kind: 'product'; hit: SearchHit<Product>; to: string }
  | { kind: 'all'; to: string }

interface SearchBarProps {
  /** `lg` for hero-style placements. */
  size?: 'md' | 'lg'
  label?: string
  placeholder?: string
  /** Show the autocomplete dropdown (default: true). */
  suggestions?: boolean
  /** Show a "Search" submit button next to the field. */
  showSubmitButton?: boolean
  /** Controlled value; leave out to let the bar manage its own text. */
  value?: string
  onValueChange?: (value: string) => void
  /** Replaces the default "go to /search?q=" behaviour on submit. */
  onSubmit?: (query: string) => void
  /** Called after the bar navigates somewhere, e.g. to close an overlay. */
  onNavigate?: () => void
  inputRef?: Ref<HTMLInputElement>
  className?: string
}

/**
 * Site search with typo-tolerant autocomplete (WAI-ARIA combobox). Suggestions appear after
 * two characters, grouped into categories and products. ↑/↓ move, Enter opens the highlighted
 * suggestion (or the full results page if none is highlighted), Esc closes.
 */
export function SearchBar({
  size = 'md',
  label = 'Search products and categories',
  placeholder = 'Search banana chips, pickles, masalas…',
  suggestions = true,
  showSubmitButton = false,
  value: controlledValue,
  onValueChange,
  onSubmit,
  onNavigate,
  inputRef,
  className,
}: SearchBarProps) {
  const id = useId()
  const listId = `${id}-list`
  const navigate = useNavigate()
  const location = useLocation()
  const rootRef = useRef<HTMLFormElement>(null)

  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue ?? internalValue
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const trimmed = value.trim()
  const { results, isLoading, isActive, query } = useSearch(suggestions ? value : '', {
    limit: SUGGESTION_LIMIT,
  })
  const showList = suggestions && open && trimmed.length >= MIN_SEARCH_LENGTH

  // Close when the route changes (e.g. browser back, or a link elsewhere on the page).
  const routeKey = location.pathname + location.search
  const [lastRouteKey, setLastRouteKey] = useState(routeKey)
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey)
    setOpen(false)
    setActiveIndex(-1)
  }

  // Close on clicks outside the search bar.
  useEffect(() => {
    if (!showList) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showList])

  const options: Option[] = [
    ...results.categories.map((hit) => ({
      kind: 'category' as const,
      hit,
      to: categoryPath(hit.item.slug),
    })),
    ...results.products.map((hit) => ({
      kind: 'product' as const,
      hit,
      to: productPath(hit.item.slug),
    })),
    { kind: 'all', to: searchPath(trimmed) },
  ]
  const categoryCount = results.categories.length
  const productCount = results.products.length
  const resultsAreCurrent = isActive && query === trimmed && !isLoading
  const optionId = (index: number) => `${id}-option-${index}`

  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const go = (to: string, { clear }: { clear: boolean }) => {
    setOpen(false)
    setActiveIndex(-1)
    if (clear) setValue('')
    navigate(to)
    onNavigate?.()
  }

  const submit = () => {
    if (!trimmed) return
    setOpen(false)
    setActiveIndex(-1)
    if (onSubmit) onSubmit(trimmed)
    else go(searchPath(trimmed), { clear: false })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showList && activeIndex >= 0 && options[activeIndex]) {
      const option = options[activeIndex]
      go(option.to, { clear: option.kind !== 'all' })
    } else {
      submit()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!suggestions || trimmed.length < MIN_SEARCH_LENGTH) return
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      const last = options.length - 1
      const next =
        event.key === 'ArrowDown'
          ? activeIndex >= last
            ? 0
            : activeIndex + 1
          : activeIndex <= 0
            ? last
            : activeIndex - 1
      setActiveIndex(next)
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Escape') {
      if (showList) {
        // Close the list only; a second Esc can close a surrounding overlay.
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        setActiveIndex(-1)
      } else if (value) {
        event.preventDefault()
        event.stopPropagation()
        setValue('')
      }
    }
  }

  const large = size === 'lg'
  let optionIndex = -1

  const renderOption = (option: Option) => {
    optionIndex += 1
    const index = optionIndex
    const active = index === activeIndex
    return (
      <li
        key={option.to}
        id={optionId(index)}
        role="option"
        aria-selected={active}
        // Keep focus in the input so the list doesn't close before the click lands.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => go(option.to, { clear: option.kind !== 'all' })}
        onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm',
          active ? 'bg-brand-50 text-brand-900' : 'text-stone-700',
          option.kind === 'all' && 'font-medium text-brand-800',
        )}
      >
        {option.kind === 'category' ? (
          <>
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xl"
              aria-hidden="true"
            >
              {option.hit.item.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-stone-900">
                <Highlight text={option.hit.item.name} ranges={option.hit.nameMatches} />
              </span>
              <span className="block text-xs text-stone-500">Category</span>
            </span>
          </>
        ) : option.kind === 'product' ? (
          <>
            <img
              src={option.hit.item.images[0] ?? '/images/fallback.svg'}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
              className="size-10 shrink-0 rounded-lg bg-stone-100 object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-stone-900">
                <Highlight text={option.hit.item.name} ranges={option.hit.nameMatches} />
              </span>
              <span className="block text-xs text-stone-500">
                {formatPrice(option.hit.item.price)} · {option.hit.item.unit}
              </span>
            </span>
          </>
        ) : (
          <>
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">See all results for “{trimmed}”</span>
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </>
        )}
      </li>
    )
  }

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={handleSubmit}
      className={cn('relative flex gap-3', className)}
    >
      <div className="relative flex-1">
        <label htmlFor={`${id}-input`} className="sr-only">
          {label}
        </label>
        <Search
          className={cn(
            'pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400',
            large ? 'size-5' : 'size-4',
          )}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          name="q"
          role={suggestions ? 'combobox' : undefined}
          aria-expanded={suggestions ? showList : undefined}
          aria-controls={suggestions ? listId : undefined}
          aria-autocomplete={suggestions ? 'list' : undefined}
          aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setActiveIndex(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-full border border-stone-300 bg-white pr-10 text-stone-800',
            'transition-colors placeholder:text-stone-400',
            'focus:border-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none',
            large ? 'h-12 pl-11 text-base' : 'h-11 pl-10 text-sm',
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('')
              setActiveIndex(-1)
              rootRef.current?.querySelector('input')?.focus()
            }}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}

        {suggestions && (
          <div
            className={cn(
              'absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl',
              !showList && 'hidden',
            )}
          >
            <ul
              id={listId}
              role="listbox"
              aria-label="Search suggestions"
              className="max-h-[min(28rem,70vh)] overflow-y-auto p-1.5"
            >
              {categoryCount > 0 && (
                <li role="presentation">
                  <p
                    className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase"
                    id={`${id}-categories`}
                  >
                    Categories
                  </p>
                  <ul role="group" aria-labelledby={`${id}-categories`}>
                    {options.filter((o) => o.kind === 'category').map(renderOption)}
                  </ul>
                </li>
              )}
              {productCount > 0 && (
                <li role="presentation">
                  <p
                    className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase"
                    id={`${id}-products`}
                  >
                    Products
                  </p>
                  <ul role="group" aria-labelledby={`${id}-products`}>
                    {options.filter((o) => o.kind === 'product').map(renderOption)}
                  </ul>
                </li>
              )}
              {categoryCount + productCount === 0 && (
                <li
                  role="presentation"
                  className="flex items-center gap-2 px-3 py-3 text-sm text-stone-500"
                >
                  {isLoading || !resultsAreCurrent ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Searching…
                    </>
                  ) : (
                    <>No quick matches for “{trimmed}”.</>
                  )}
                </li>
              )}
              <li role="presentation" className="mt-1 border-t border-stone-100 pt-1">
                <ul role="group" aria-label="All results">
                  {renderOption(options[options.length - 1])}
                </ul>
              </li>
            </ul>
          </div>
        )}

        {/* Result counts for screen readers, once typing settles. */}
        <p className="sr-only" aria-live="polite">
          {showList && resultsAreCurrent
            ? categoryCount + productCount === 0
              ? 'No suggestions. Press Enter to search all products.'
              : `${pluralize(categoryCount, 'category', 'categories')} and ${pluralize(productCount, 'product')} suggested. Use the up and down arrows to browse.`
            : ''}
        </p>
      </div>
      {showSubmitButton && (
        <Button type="submit" size={large ? 'lg' : 'md'}>
          Search
        </Button>
      )}
    </form>
  )
}
