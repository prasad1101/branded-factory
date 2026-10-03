import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { useCategories, useSite } from '../../hooks/useData'
import Logo from '../Logo'
import SmartImage from '../SmartImage'
import WhatsAppButton from '../WhatsAppButton'

const LINKS = [
  { to: '/shop', label: 'Shop all products' },
  { to: '/shop?sort=discount', label: 'Biggest savings' },
  { to: '/about', label: 'About us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function MobileDrawer({ open, onClose }) {
  const { categories } = useCategories()
  const { site } = useSite()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-cream shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-navy/5 px-5 py-4">
              <Logo />
              <button ref={closeRef} onClick={onClose} className="rounded-full p-2 text-navy hover:bg-cream-200" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <p className="eyebrow px-2 pb-2">Categories</p>
              <ul>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link to={`/category/${c.id}`} onClick={onClose} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
                        <SmartImage src={c.image} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span className="flex-1 font-medium text-navy">{c.name}</span>
                      <ChevronRight className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-4 h-px bg-navy/5" />
              <ul>
                {LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} onClick={onClose} className="block rounded-xl px-3 py-2.5 font-medium text-navy hover:bg-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-navy/5 p-4 pb-safe">
              <WhatsAppButton className="w-full" message={`Hello ${site.storeName || 'Branded Factory'}! 👋`}>
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
