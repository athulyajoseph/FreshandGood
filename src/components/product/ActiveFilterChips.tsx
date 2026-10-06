import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import type { FilterChip } from '@/hooks'
import { cn } from '@/utils'

interface ActiveFilterChipsProps {
  chips: FilterChip[]
  onRemove: (id: string) => void
  onClearAll: () => void
  className?: string
}

/** The active filters as removable chips, plus "Clear all". Renders nothing when empty. */
export function ActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
  className,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="sr-only">Active filters:</span>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.id}>
            <Button
              variant="soft"
              size="xs"
              onClick={() => onRemove(chip.id)}
              aria-label={`Remove filter: ${chip.label}`}
              rightIcon={<X className="size-3.5" aria-hidden="true" />}
            >
              {chip.label}
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="xs" onClick={onClearAll} className="underline">
        Clear all
      </Button>
    </div>
  )
}
