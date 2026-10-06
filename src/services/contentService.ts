import { aboutContent } from '@/data/about'
import { siteInfo } from '@/data/siteConfig'
import type { AboutContent, SiteInfo } from '@/types'

/**
 * Static site copy and business details. Unlike the catalogue services these are synchronous:
 * the content ships with the app and is needed on first render (header, footer, meta tags).
 */
export const contentService = {
  getSiteInfo(): SiteInfo {
    return siteInfo
  },

  getAboutContent(): AboutContent {
    return aboutContent
  },
}
