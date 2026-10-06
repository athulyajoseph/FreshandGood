import { Helmet } from 'react-helmet-async'
import { siteConfig } from '@/config/site'

interface PageMetaProps {
  /** Page title without the site name; omit for the home page. */
  title?: string
  description?: string
  /** Ask search engines not to index this page (e.g. 404). */
  noIndex?: boolean
}

/** Sets the document title and basic meta tags for a page. */
export function PageMeta({ title, description = siteConfig.description, noIndex }: PageMetaProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {noIndex && <meta name="robots" content="noindex, follow" />}
    </Helmet>
  )
}
