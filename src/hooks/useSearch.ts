import { useCallback } from 'react'
import { searchService } from '@/services'
import type { SearchResults } from '@/types'
import { useAsync } from './useAsync'
import { useDebounce } from './useDebounce'

/** Queries shorter than this return no results (autocomplete opens from here). */
export const MIN_SEARCH_LENGTH = 2

const EMPTY_RESULTS: SearchResults = { products: [], categories: [] }

interface UseSearchOptions {
  /** Max results per group; omit for all. */
  limit?: number
  /** Debounce delay in ms (default 200). */
  delayMs?: number
}

export interface UseSearchState {
  /** The debounced, trimmed query the results belong to. */
  query: string
  results: SearchResults
  /** True while waiting for typing to settle or for results. */
  isLoading: boolean
  /** True once `query` is long enough to search. */
  isActive: boolean
}

/** Debounced, typo-tolerant search over products and categories, grouped by type. */
export function useSearch(
  rawQuery: string,
  { limit, delayMs = 200 }: UseSearchOptions = {},
): UseSearchState {
  const trimmed = rawQuery.trim()
  const query = useDebounce(trimmed, delayMs)
  const isActive = query.length >= MIN_SEARCH_LENGTH

  const { data, isLoading } = useAsync(
    useCallback(
      () =>
        isActive
          ? searchService.search(query, { productLimit: limit, categoryLimit: limit })
          : Promise.resolve(EMPTY_RESULTS),
      [query, isActive, limit],
    ),
    { keepPreviousData: true },
  )

  return {
    query,
    results: data ?? EMPTY_RESULTS,
    isLoading: isLoading || (trimmed !== query && trimmed.length >= MIN_SEARCH_LENGTH),
    isActive,
  }
}
