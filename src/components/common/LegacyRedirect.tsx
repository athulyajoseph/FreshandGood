import { Navigate, useLocation, useParams } from 'react-router-dom'

interface LegacyRedirectProps {
  /** Builds the new path from the old route's `:slug`. */
  to: (slug: string) => string
}

/** Permanently forwards an old URL shape to its new one, keeping the query string and hash. */
export function LegacyRedirect({ to }: LegacyRedirectProps) {
  const { slug = '' } = useParams<{ slug: string }>()
  const { search, hash } = useLocation()
  return <Navigate to={`${to(slug)}${search}${hash}`} replace />
}
