import { HashRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { DataProvider } from './context/DataContext'
import { EnquiryProvider } from './context/EnquiryContext'
import { ToastProvider } from './context/ToastContext'
import { useCatalog } from './hooks/useData'
import { ProductGridSkeleton } from './components/Skeleton'

function Placeholder() {
  const { status, products, categories, error } = useCatalog()
  return (
    <main className="container-px py-24">
      <h1 className="text-4xl">Branded Factory</h1>
      {status === 'loading' && <ProductGridSkeleton count={4} />}
      {status === 'error' && <p>{error.message}</p>}
      {status === 'ready' && <p>{categories.length} categories · {products.length} products</p>}
    </main>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <DataProvider>
          <EnquiryProvider>
            <ToastProvider>
              {/* HashRouter is required: GitHub Pages has no server-side routing */}
              <HashRouter>
                <Routes>
                  <Route path="*" element={<Placeholder />} />
                </Routes>
              </HashRouter>
            </ToastProvider>
          </EnquiryProvider>
        </DataProvider>
      </MotionConfig>
    </HelmetProvider>
  )
}
