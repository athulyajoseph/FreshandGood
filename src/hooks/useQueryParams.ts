import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export type QueryParamValue = string | number | boolean | null | undefined

interface SetOptions {
  /** Replace the current history entry instead of pushing a new one (default: true). */
  replace?: boolean
}

/**
 * Thin wrapper around `useSearchParams` for reading and updating URL query parameters.
 * Setting a value to `null`, `undefined` or `''` removes that parameter.
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback((key: string): string | null => searchParams.get(key), [searchParams])

  const getNumber = useCallback(
    (key: string): number | undefined => {
      const raw = searchParams.get(key)
      if (raw === null || raw.trim() === '') return undefined
      const value = Number(raw)
      return Number.isFinite(value) ? value : undefined
    },
    [searchParams],
  )

  const set = useCallback(
    (updates: Record<string, QueryParamValue>, { replace = true }: SetOptions = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined || value === '') next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  const clear = useCallback(
    (keys?: string[], { replace = true }: SetOptions = {}) => {
      setSearchParams(
        (current) => {
          if (!keys) return new URLSearchParams()
          const next = new URLSearchParams(current)
          keys.forEach((key) => next.delete(key))
          return next
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  return { params: searchParams, get, getNumber, set, clear }
}
