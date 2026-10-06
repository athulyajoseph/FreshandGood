import { TriangleAlert } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback. Receives the error and a reset function. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render errors in its subtree and shows a friendly fallback. Give it a `key` (such as
 * the current pathname) to reset automatically on navigation.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <div
        role="alert"
        className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center"
      >
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-stone-600">
          Sorry, this part of the page failed to load. Please try again.
        </p>
        {import.meta.env.DEV && (
          <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-stone-100 p-3 text-left text-xs text-red-700">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex gap-3">
          <Button onClick={this.reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.assign('/')}>
            Go to home
          </Button>
        </div>
      </div>
    )
  }
}
