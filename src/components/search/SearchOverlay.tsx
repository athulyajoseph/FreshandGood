import { useRef } from 'react'
import { Drawer } from '@/components/ui'
import { SearchBar } from './SearchBar'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

/** Full-screen search for small screens, using the same SearchBar as the desktop header. */
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Search"
      side="right"
      className="max-w-none"
      initialFocusRef={inputRef}
    >
      <SearchBar inputRef={inputRef} onNavigate={onClose} size="lg" />
      <p className="mt-4 text-sm text-stone-500">
        Search by product, category or ingredient, in English or Malayalam. Small typos are fine.
      </p>
    </Drawer>
  )
}
