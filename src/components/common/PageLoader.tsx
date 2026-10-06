import { Container, Skeleton } from '@/components/ui'

/** Skeleton shown while a lazy-loaded page chunk is downloading. */
export function PageLoader() {
  return (
    <Container className="py-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-9 w-2/3 max-w-md" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </Container>
  )
}
