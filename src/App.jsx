import { HashRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'

function Placeholder() {
  return (
    <main className="container-px py-24 text-center">
      <p className="eyebrow">Coming soon</p>
      <h1 className="mt-3 text-4xl">Branded Factory</h1>
      <p className="mt-3 text-ink-muted">Bumper Discounts. Assured Savings. Greatest Deals.</p>
    </main>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        {/* HashRouter is required: GitHub Pages has no server-side routing */}
        <HashRouter>
          <Routes>
            <Route path="*" element={<Placeholder />} />
          </Routes>
        </HashRouter>
      </MotionConfig>
    </HelmetProvider>
  )
}
