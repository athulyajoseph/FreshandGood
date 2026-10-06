import { MapPinOff } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Button, ErrorBoundary, Skeleton } from '@/components/ui'
import { cn } from '@/utils'
import type { ShopMapProps } from './shopMapTypes'

// Leaflet (~150 kB) lives in its own chunk, fetched only when a map is actually rendered.
const ShopMap = lazy(() => import('./ShopMap'))

const frameClasses = 'relative h-80 rounded-2xl'

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(frameClasses, className)} aria-busy="true">
      <span className="sr-only">Loading map…</span>
      <Skeleton className="size-full rounded-2xl" />
    </div>
  )
}

function MapError({ className, onRetry }: { className?: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        frameClasses,
        'flex flex-col items-center justify-center gap-3 border border-dashed border-stone-300 bg-white/60 p-6 text-center',
        className,
      )}
    >
      <MapPinOff className="size-7 text-stone-400" aria-hidden="true" />
      <p className="text-sm text-stone-600">The map couldn’t be loaded.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

/** `ShopMap`, loaded on demand with a skeleton placeholder of the same size. */
export function LazyShopMap(props: ShopMapProps) {
  return (
    <ErrorBoundary
      fallback={(_, reset) => <MapError className={props.className} onRetry={reset} />}
    >
      <Suspense fallback={<MapSkeleton className={props.className} />}>
        <ShopMap {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}
