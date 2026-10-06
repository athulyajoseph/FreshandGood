import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to the top whenever the path changes (query-string changes keep the position). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
