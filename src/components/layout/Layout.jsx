import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import { FloatingWhatsApp } from '../WhatsAppButton'
import PageLoader from '../PageLoader'
import { useCatalog } from '../../hooks/useData'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function DataError({ error, retry }) {
  return (
    <div className="container-px py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">We couldn’t load the store</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">
        Please check your internet connection and try again.
        {import.meta.env.DEV && error?.message ? ` (${error.message})` : ''}
      </p>
      <button type="button" onClick={retry} className="btn-primary mt-6">
        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
      </button>
    </div>
  )
}

export default function Layout() {
  const location = useLocation()
  const { status, error, retry } = useCatalog()

  return (
    <div className="flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <a href="#main" className="sr-only z-[80] rounded-full bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        {status === 'error' ? (
          <DataError error={error} retry={retry} />
        ) : (
          <Suspense fallback={<PageLoader />}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileNav />
    </div>
  )
}
