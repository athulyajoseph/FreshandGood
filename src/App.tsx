import { lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ErrorBoundary } from '@/components/ui'

const HomePage = lazy(() => import('@/pages/HomePage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const ShopsPage = lazy(() => import('@/pages/ShopsPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Layout wraps every page in Suspense and a per-route ErrorBoundary. */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/:slug" element={<CategoryPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="shops" element={<ShopsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
