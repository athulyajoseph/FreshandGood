import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { resolveSiteUrl } from './scripts/siteUrl.ts'

/** Replaces %SITE_URL% in index.html, for absolute Open Graph URLs that crawlers need. */
function siteUrlHtml(siteUrl: string): Plugin {
  return {
    name: 'site-url-html',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const siteUrl = resolveSiteUrl(mode)
  return {
    plugins: [react(), tailwindcss(), siteUrlHtml(siteUrl)],
    // One resolved site URL for the app, index.html and the sitemap.
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
