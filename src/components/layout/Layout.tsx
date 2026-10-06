import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageLoader'
import { ErrorBoundary } from '@/components/ui'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brand-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        {/* Keyed by path so an error on one page is cleared when navigating away. */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
