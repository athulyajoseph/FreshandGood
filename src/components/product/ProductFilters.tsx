import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Button, Checkbox, Input } from '@/components/ui'
import type { CategoryFacetOption, ProductFilterValues } from '@/hooks'
import type { DietFilter, ProductFacets } from '@/types'
import { cn, formatPrice } from '@/utils'

const DIET_OPTIONS: { value: DietFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Veg' },
  { value: 'non-veg', label: 'Non-veg' },
]

/** Tags shown before "Show all". */
const TAG_PREVIEW_COUNT = 10

interface ProductFiltersProps {
  value: ProductFilterValues
  onChange: (changes: Partial<ProductFilterValues>) => void
  facets: ProductFacets
  /** When non-empty, a category multi-select is shown. */
  categoryOptions?: CategoryFacetOption[]
  /**
   * Apply typed prices on every keystroke (for a draft that is applied later). By default
   * prices apply on blur or Enter, so the results don't jump while typing.
   */
  commitPriceOnChange?: boolean
  className?: string
}

/** Controlled filter controls. Used live in the desktop sidebar and as a draft in the drawer. */
export function ProductFilters({
  value,
  onChange,
  facets,
  categoryOptions = [],
  commitPriceOnChange = false,
  className,
}: ProductFiltersProps) {
  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item]

  return (
    <div className={cn('flex flex-col gap-7', className)}>
      <DietFilterGroup value={value.diet} onChange={(diet) => onChange({ diet })} />

      {facets.priceRange.max > 0 && (
        <PriceRangeFields
          min={value.minPrice}
          max={value.maxPrice}
          bounds={facets.priceRange}
          commitOnChange={commitPriceOnChange}
          onCommit={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      )}

      {categoryOptions.length > 0 && (
        <FilterGroup legend="Category">
          {categoryOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              count={option.count}
              checked={value.categories.includes(option.value)}
              onChange={() => onChange({ categories: toggle(value.categories, option.value) })}
            />
          ))}
        </FilterGroup>
      )}

      {facets.tags.length > 0 && (
        <TagFilterGroup
          tags={facets.tags}
          selected={value.tags}
          onToggle={(tag) => onChange({ tags: toggle(value.tags, tag) })}
        />
      )}
    </div>
  )
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-stone-900">{legend}</legend>
      <div className="-mx-2 flex flex-col">{children}</div>
    </fieldset>
  )
}

function DietFilterGroup({
  value,
  onChange,
}: {
  value: DietFilter
  onChange: (value: DietFilter) => void
}) {
  const name = useId()
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-stone-900">Food type</legend>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-stone-100 p-1">
        {DIET_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-full px-2 py-1.5 text-center text-sm font-medium text-stone-600 transition-colors',
              'has-checked:bg-white has-checked:text-brand-800 has-checked:shadow-sm',
              'has-focus-visible:outline-2 has-focus-visible:outline-brand-600',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const toText = (price: number | undefined) => (price === undefined ? '' : String(price))

function parsePrice(text: string): number | undefined {
  if (text.trim() === '') return undefined
  const value = Number(text)
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

function PriceRangeFields({
  min,
  max,
  bounds,
  commitOnChange,
  onCommit,
}: {
  min: number | undefined
  max: number | undefined
  bounds: { min: number; max: number }
  commitOnChange: boolean
  onCommit: (min: number | undefined, max: number | undefined) => void
}) {
  const hintId = useId()
  const [minText, setMinText] = useState(toText(min))
  const [maxText, setMaxText] = useState(toText(max))

  // Re-sync the text boxes when the applied values change elsewhere (chip removed, Clear all).
  const [synced, setSynced] = useState({ min, max })
  if (synced.min !== min || synced.max !== max) {
    setSynced({ min, max })
    setMinText(toText(min))
    setMaxText(toText(max))
  }

  const commit = (nextMinText: string, nextMaxText: string) => {
    const nextMin = parsePrice(nextMinText)
    const nextMax = parsePrice(nextMaxText)
    if (nextMin !== min || nextMax !== max) onCommit(nextMin, nextMax)
  }

  const fieldProps = {
    type: 'number',
    inputMode: 'numeric',
    min: 0,
    step: 1,
    'aria-describedby': hintId,
    className: 'rounded-xl px-3',
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') commit(minText, maxText)
    },
    onBlur: () => commit(minText, maxText),
  } as const

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-stone-900">Price</legend>
      <div className="flex items-center gap-2">
        <Input
          {...fieldProps}
          label="Minimum price (₹)"
          hideLabel
          placeholder={`Min ${formatPrice(bounds.min)}`}
          value={minText}
          onChange={(event) => {
            setMinText(event.target.value)
            if (commitOnChange) commit(event.target.value, maxText)
          }}
          containerClassName="flex-1"
        />
        <span className="text-stone-400" aria-hidden="true">
          –
        </span>
        <Input
          {...fieldProps}
          label="Maximum price (₹)"
          hideLabel
          placeholder={`Max ${formatPrice(bounds.max)}`}
          value={maxText}
          onChange={(event) => {
            setMaxText(event.target.value)
            if (commitOnChange) commit(minText, event.target.value)
          }}
          containerClassName="flex-1"
        />
      </div>
      <p id={hintId} className="mt-2 text-xs text-stone-500">
        Prices range from {formatPrice(bounds.min)} to {formatPrice(bounds.max)}
        {commitOnChange ? '.' : '. Press Enter to apply.'}
      </p>
    </fieldset>
  )
}

function TagFilterGroup({
  tags,
  selected,
  onToggle,
}: {
  tags: ProductFacets['tags']
  selected: string[]
  onToggle: (tag: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const hasMore = tags.length > TAG_PREVIEW_COUNT
  // Selected tags stay visible even when the list is collapsed.
  const visible = expanded
    ? tags
    : tags.filter((tag, index) => index < TAG_PREVIEW_COUNT || selected.includes(tag.value))

  return (
    <FilterGroup legend="Tags">
      <div id={listId} className="flex flex-col">
        {visible.map((tag) => (
          <Checkbox
            key={tag.value}
            label={<span className="capitalize">{tag.value}</span>}
            count={tag.count}
            checked={selected.includes(tag.value)}
            onChange={() => onToggle(tag.value)}
          />
        ))}
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="xs"
          className="mt-1 self-start text-brand-700"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show fewer tags' : `Show all ${tags.length} tags`}
        </Button>
      )}
    </FilterGroup>
  )
}
