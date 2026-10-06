import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { JsonLd } from './JsonLd'
import { absoluteUrl, type JsonLdObject } from './structuredData'

const DEFAULT_OG_IMAGE = '/og-image.png'

interface SeoProps {
  /** Page title without the site name ("%s | Fresh & Good"); omit for the home page. */
  title?: string
  description?: string
  /** Canonical path; defaults to the current path without its query string. */
  canonicalPath?: string
  /** Social share image path or URL (default: /og-image.png). */
  image?: string
  /** Open Graph type (default: website). */
  type?: 'website' | 'product' | 'article'
  /** Ask search engines not to index this page (e.g. 404, search results). */
  noIndex?: boolean
  /** schema.org structured data for this page. */
  jsonLd?: JsonLdObject | JsonLdObject[]
}

/** Title, description, canonical URL, Open Graph / Twitter tags and JSON-LD for a page. */
export function Seo({
  title,
  description = siteConfig.description,
  canonicalPath,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex,
  jsonLd,
}: SeoProps) {
  const { pathname } = useLocation()
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  const canonical = absoluteUrl(canonicalPath ?? pathname)
  const imageUrl = /^https?:\/\//.test(image) ? image : absoluteUrl(image)
  const structuredData = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        {noIndex && <meta name="robots" content="noindex, follow" />}

        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={`${siteConfig.name} — ${siteConfig.tagline}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      {structuredData.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
    </>
  )
}
