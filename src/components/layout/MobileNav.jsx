import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react'
import { WhatsAppIcon } from '../BrandIcons'
import { EnquiryBadge } from './Header'
import { useEnquiry } from '../../hooks/useEnquiry'
import { useSite } from '../../hooks/useData'
import { buildWhatsAppUrl, cn } from '../../lib/utils'

const itemClass = ({ isActive }) =>
  cn(
    'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors',
    isActive ? 'text-navy' : 'text-ink-muted hover:text-navy',
  )

function Dot({ isActive }) {
  return (
    <span
      className={cn('absolute top-0 h-0.5 w-8 rounded-full bg-gold-500 transition-opacity', isActive ? 'opacity-100' : 'opacity-0')}
      aria-hidden="true"
    />
  )
}

export default function MobileNav() {
  const { count } = useEnquiry()
  const { site } = useSite()
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/5 bg-white/90 backdrop-blur-xl pb-safe md:hidden"
    >
      <div className="flex h-16 items-stretch">
        <NavLink to="/" end className={itemClass}>
          {({ isActive }) => (
            <>
              <Dot isActive={isActive} />
              <Home className="h-5 w-5" aria-hidden="true" />
              Home
            </>
          )}
        </NavLink>
        <NavLink to="/categories" className={itemClass}>
          {({ isActive }) => (
            <>
              <Dot isActive={isActive} />
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
              Categories
            </>
          )}
        </NavLink>
        <NavLink to="/search" className={itemClass}>
          {({ isActive }) => (
            <>
              <Dot isActive={isActive} />
              <Search className="h-5 w-5" aria-hidden="true" />
              Search
            </>
          )}
        </NavLink>
        <NavLink to="/enquiry" className={itemClass} aria-label={`Enquiry list, ${count} items`}>
          {({ isActive }) => (
            <>
              <Dot isActive={isActive} />
              <span className="relative">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <EnquiryBadge count={count} className="-right-3 -top-2" />
              </span>
              My List
            </>
          )}
        </NavLink>
        <a
          href={buildWhatsAppUrl(site.whatsappNumber, `Hello ${site.storeName || 'Branded Factory'}! 👋`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-whatsapp-dark"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </nav>
  )
}
