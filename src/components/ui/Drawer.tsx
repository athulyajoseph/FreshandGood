import { X } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'
import { Button } from './Button'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Pinned to the bottom of the panel, e.g. Apply / Clear buttons. */
  footer?: ReactNode
  side?: 'left' | 'right'
  className?: string
  /** Element to focus when the drawer opens (default: the close button). */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * A modal panel that slides in from the side. Traps focus while open, closes on Escape or a
 * backdrop click, locks page scroll, and returns focus to the trigger when it closes.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'left',
  className,
  initialFocusRef,
}: DrawerProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTarget = initialFocusRef?.current ?? closeButtonRef.current
    focusTarget?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, initialFocusRef])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50',
        // Become visible instantly on open (so focus can move inside straight away), but stay
        // visible until the slide-out finishes on close.
        !open && 'invisible transition-[visibility] duration-300 motion-reduce:transition-none',
      )}
      inert={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-stone-900/40 transition-opacity duration-300 motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className={cn(
          'absolute inset-y-0 flex w-full max-w-sm flex-col bg-cream shadow-xl transition-transform duration-300 motion-reduce:transition-none',
          side === 'left' ? 'left-0' : 'right-0',
          open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-stone-900">
            {title}
          </h2>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-stone-200 bg-white px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
