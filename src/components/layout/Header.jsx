import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { ChevronDown, Menu, Search, ShoppingBag } from 'lucide-react'
import Logo from '../Logo'
import SearchBar from './SearchBar'
import MegaMenu from './MegaMenu'
import MobileDrawer from './MobileDrawer'
import { useEnquiry } from '../../hooks/useEnquiry'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?sort=discount', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function EnquiryBadge({ count, className = '' }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <m.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 18 }}
          className={cn(
            'absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-cream',
            className,
          )}
        >
          {count > 99 ? '99+' : count}
        </m.span>
      )}
    </AnimatePresence>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { count } = useEnquiry()
  const location = useLocation()
  const hoverTimer = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMegaOpen(false)
    setDrawerOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e) => e.key === 'Escape' && setMegaOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [megaOpen])

  const openMega = () => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setMegaOpen(true), 80)
  }
  const closeMega = () => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setMegaOpen(false), 160)
  }

  const isSearchPage = location.pathname === '/search'

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled ? 'bg-cream/80 shadow-soft backdrop-blur-xl backdrop-saturate-150' : 'bg-cream',
        )}
        onMouseLeave={closeMega}
      >
        <div className={cn('container-px flex items-center gap-3 transition-[height] duration-300 lg:gap-6', scrolled ? 'h-14' : 'h-16 lg:h-20')}>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="-ml-2 rounded-full p-2 text-navy hover:bg-cream-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Logo className="mr-auto lg:mr-0" />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              onMouseEnter={openMega}
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                megaOpen ? 'bg-navy text-white' : 'text-navy hover:bg-cream-200',
              )}
            >
              Categories <ChevronDown className={cn('h-4 w-4 transition-transform', megaOpen && 'rotate-180')} aria-hidden="true" />
            </button>
            {NAV.map((n) => {
              const [path, query] = n.to.split('?')
              const active =
                location.pathname === path && (query ? location.search.includes(query) : !location.search.includes('sort=discount'))
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  onMouseEnter={closeMega}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    active ? 'text-gold-700' : 'text-navy hover:bg-cream-200',
                  )}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>

          <SearchBar className="hidden flex-1 md:block lg:hidden xl:ml-auto xl:block xl:max-w-sm 2xl:max-w-md" />
          <Link to="/search" className="ml-auto hidden rounded-full p-2.5 text-navy hover:bg-cream-200 lg:flex xl:hidden" aria-label="Search">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link
            to="/enquiry"
            className="relative -mr-2 inline-flex items-center gap-2 rounded-full p-2 text-navy transition-colors hover:bg-cream-200 lg:mr-0 lg:bg-navy lg:px-4 lg:text-white lg:hover:bg-navy-600"
            aria-label={`Enquiry list, ${count} item${count === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="h-6 w-6 lg:h-5 lg:w-5" aria-hidden="true" />
            <span className="hidden text-sm font-semibold lg:inline">Enquiry List</span>
            <EnquiryBadge count={count} className="-right-0.5 -top-0.5 lg:-right-1.5 lg:-top-1.5" />
          </Link>
        </div>

        {/* Mobile search row collapses on scroll */}
        {!isSearchPage && (
          <div
            className={cn(
              'container-px grid transition-[grid-template-rows,opacity] duration-300 md:hidden',
              scrolled ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
            )}
            aria-hidden={scrolled}
            inert={scrolled ? '' : undefined}
          >
            <div className="overflow-hidden">
              <SearchBar className="pb-3" />
            </div>
          </div>
        )}

        <AnimatePresence>{megaOpen && <div onMouseEnter={openMega}><MegaMenu id="mega-menu" onClose={() => setMegaOpen(false)} /></div>}</AnimatePresence>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
