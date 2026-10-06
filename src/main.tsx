import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/index.css'

// index.html carries default meta tags for crawlers that don't run JavaScript. Remove them so
// each page's own tags (rendered by the Seo component) are the only ones in the head.
document.head.querySelectorAll('[data-fallback-meta]').forEach((element) => element.remove())

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
