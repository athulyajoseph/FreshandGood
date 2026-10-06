import { useCallback, useEffect, useState } from 'react'

export type AsyncStatus = 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: AsyncStatus
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
  /** Runs the async function again. */
  retry: () => void
}

interface Settled<T> {
  fn: () => Promise<T>
  attempt: number
  data?: T
  error?: Error
}

/**
 * Runs an async function and tracks its loading / success / error state.
 *
 * `asyncFn` must be memoised (e.g. with `useCallback`): a new function identity triggers a
 * new request. Results from stale requests are ignored, so fast navigation is race-free.
 *
 * @example
 * const { data, isLoading } = useAsync(useCallback(() => productService.getBySlug(slug), [slug]))
 *
 * With `keepPreviousData`, `data` keeps the last successful result while a new request is
 * loading (status is still `'loading'`), so lists don't flash empty as filters change.
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  { keepPreviousData = false }: { keepPreviousData?: boolean } = {},
): AsyncState<T> {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  useEffect(() => {
    let active = true
    asyncFn().then(
      (data) => {
        if (active) setSettled({ fn: asyncFn, attempt, data })
      },
      (error: unknown) => {
        if (active) {
          setSettled({
            fn: asyncFn,
            attempt,
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      },
    )
    return () => {
      active = false
    }
  }, [asyncFn, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  // State belongs to the current request only if both the function and attempt match.
  const current = settled && settled.fn === asyncFn && settled.attempt === attempt ? settled : null
  const status: AsyncStatus = !current ? 'loading' : current.error ? 'error' : 'success'

  return {
    status,
    data: current ? current.data : keepPreviousData ? settled?.data : undefined,
    error: current?.error,
    isLoading: status === 'loading',
    retry,
  }
}
