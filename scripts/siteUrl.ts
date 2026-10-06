import { loadEnv } from 'vite'

/** Used when VITE_SITE_URL isn't set. Set the real domain before deploying. */
export const DEFAULT_SITE_URL = 'https://freshandgood.example.com'

/**
 * The public site URL (no trailing slash), from VITE_SITE_URL in the environment or the
 * .env files Vite would load for `mode`. Shared by the Vite config and the sitemap script so
 * canonical links, index.html and sitemap.xml always agree.
 */
export function resolveSiteUrl(mode = 'production', root = process.cwd()): string {
  const env = loadEnv(mode, root, 'VITE_')
  return (env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')
}
