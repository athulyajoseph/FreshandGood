import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Arrays are stored comma-separated (`?tags=sweet,teatime`); an empty array removes the key. */
export type QueryParamValue = string | number | boolean | readonly string[] | null | undefined

const LIST_SEPARATOR = ','

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

  /** A comma-separated parameter as a de-duplicated list, without empty entries. */
  const getList = useCallback(
    (key: string): string[] => {
      const raw = searchParams.get(key)
      if (!raw) return []
      const items = raw.split(LIST_SEPARATOR).map((item) => item.trim())
      return [...new Set(items.filter(Boolean))]
    },
    [searchParams],
  )

  const set = useCallback(
    (updates: Record<string, QueryParamValue>, { replace = true }: SetOptions = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(updates)) {
            const serialised = Array.isArray(value) ? value.join(LIST_SEPARATOR) : value
            if (serialised === null || serialised === undefined || serialised === '') {
              next.delete(key)
            } else {
              next.set(key, String(serialised))
            }
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

  return { params: searchParams, get, getNumber, getList, set, clear }
}
