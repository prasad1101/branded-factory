import { lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { DataProvider } from './context/DataContext'
import { EnquiryProvider } from './context/EnquiryContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/layout/Layout'
// Home is the landing page, so it ships in the main bundle (no extra round trip)
import Home from './pages/Home'

const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default)

// Route-level code splitting
const Categories = lazy(() => import('./pages/Categories'))
const Category = lazy(() => import('./pages/Category'))
const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Enquiry = lazy(() => import('./pages/Enquiry'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <HelmetProvider>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <DataProvider>
            <EnquiryProvider>
              <ToastProvider>
                {/* HashRouter is required: GitHub Pages has no server-side routing */}
                <HashRouter>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="category/:id" element={<Category />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="search" element={<Shop mode="search" />} />
                      <Route path="product/:id" element={<Product />} />
                      <Route path="enquiry" element={<Enquiry />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="faq" element={<Faq />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </HashRouter>
              </ToastProvider>
            </EnquiryProvider>
          </DataProvider>
        </MotionConfig>
      </LazyMotion>
    </HelmetProvider>
  )
}
