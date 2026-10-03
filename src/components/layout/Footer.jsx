import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import Logo from '../Logo'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../BrandIcons'
import { useCategories, useSite } from '../../hooks/useData'
import { buildWhatsAppUrl } from '../../lib/utils'

export default function Footer() {
  const { site } = useSite()
  const { categories } = useCategories()
  const year = new Date().getFullYear()
  const social = site.socialLinks || {}
  const wa = buildWhatsAppUrl(site.whatsappNumber, `Hello ${site.storeName || 'Branded Factory'}! 👋`)

  return (
    <footer className="relative mt-20 bg-navy text-white/75">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" aria-hidden="true" />
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            {site.about ? (site.about.match(/[^.!?]+[.!?]+/g) || [site.about]).slice(0, 2).join('').trim() : site.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-whatsapp hover:text-white">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500 hover:text-navy">
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500 hover:text-navy">
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Footer categories" className="lg:col-span-3">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Categories</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {categories.slice(0, 12).map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.id}`} className="transition hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer links" className="lg:col-span-2">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="transition hover:text-white">Shop all</Link></li>
            <li><Link to="/shop?sort=discount" className="transition hover:text-white">Biggest savings</Link></li>
            <li><Link to="/about" className="transition hover:text-white">About us</Link></li>
            <li><Link to="/faq" className="transition hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
            <li><Link to="/enquiry" className="transition hover:text-white">My enquiry list</Link></li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 transition hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{site.phoneDisplay || `+${site.whatsappNumber || ''}`} (WhatsApp)</span>
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="flex items-start gap-3 transition hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  <span>{site.email}</span>
                </a>
              </li>
            )}
            {site.address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-px flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between md:pr-24">
          <p>© {year} {site.storeName || 'Branded Factory'}. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">{site.footerNote || 'Prices and availability subject to change.'}</p>
        </div>
      </div>
    </footer>
  )
}
