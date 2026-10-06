import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { SmartImage } from '@/components/ui'
import { cn } from '@/utils'

interface ProductGalleryProps {
  images: string[]
  /** Product name, used for alt text. */
  name: string
  className?: string
}

/**
 * Main image with a thumbnail strip. Thumbnails use a roving tab stop: Tab focuses the
 * current one, and the arrow keys, Home and End move between images.
 */
export function ProductGallery({ images, name, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const count = images.length
  const index = Math.min(active, Math.max(count - 1, 0))

  const show = (next: number, focusThumb = false) => {
    const wrapped = (next + count) % count
    setActive(wrapped)
    if (focusThumb) thumbRefs.current[wrapped]?.focus()
  }

  const handleThumbKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: count - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    show(keys[event.key], true)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="relative">
        <SmartImage
          src={images[index]}
          alt={count > 1 ? `${name}, image ${index + 1} of ${count}` : name}
          width={800}
          height={800}
          className="aspect-square rounded-3xl border border-stone-200"
          priority
        />
        {count > 1 && (
          <>
            <GalleryArrow direction="previous" onClick={() => show(index - 1)} />
            <GalleryArrow direction="next" onClick={() => show(index + 1)} />
            <p className="sr-only" aria-live="polite">
              Image {index + 1} of {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          role="group"
          aria-label={`${name} images`}
          className="grid grid-cols-4 gap-3 sm:grid-cols-5"
          onKeyDown={handleThumbKeyDown}
        >
          {images.map((src, i) => (
            <button
              key={src}
              ref={(node) => {
                thumbRefs.current[i] = node
              }}
              type="button"
              tabIndex={i === index ? 0 : -1}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => show(i)}
              className={cn(
                'overflow-hidden rounded-xl border-2 transition',
                i === index
                  ? 'border-brand-600'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <SmartImage src={src} alt="" width={160} height={160} className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next'
  onClick: () => void
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'previous' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md transition hover:bg-white',
        direction === 'previous' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  )
}
