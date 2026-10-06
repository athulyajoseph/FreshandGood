import { RotateCw, TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

interface ErrorStateProps {
  title?: string
  description?: string
  /** Shows a "Try again" button, e.g. wired to `useAsync().retry`. */
  onRetry?: () => void
  className?: string
}

/** Inline error for a section whose data failed to load. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this right now. Please check your connection and try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={className}>
      <EmptyState
        tone="danger"
        icon={<TriangleAlert />}
        title={title}
        description={description}
        action={
          onRetry && (
            <Button onClick={onRetry} leftIcon={<RotateCw className="size-4" aria-hidden="true" />}>
              Try again
            </Button>
          )
        }
      />
    </div>
  )
}
