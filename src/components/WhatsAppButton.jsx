import { m } from 'framer-motion'
import { WhatsAppIcon } from './BrandIcons'
import { useSite } from '../hooks/useData'
import { buildWhatsAppUrl, cn } from '../lib/utils'

/**
 * Opens WhatsApp with an optional pre-filled message.
 * The number always comes from site.json (never hardcoded).
 */
export default function WhatsAppButton({ message = '', children = 'Order on WhatsApp', className = '', size = 'md', onClick, ...rest }) {
  const { site } = useSite()
  const href = buildWhatsAppUrl(site.whatsappNumber, message)
  return (
    <m.a
      whileTap={{ scale: 0.97 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn('btn-whatsapp', size === 'lg' && 'px-7 py-4 text-base', className)}
      {...rest}
    >
      <WhatsAppIcon className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
      {children}
    </m.a>
  )
}

export function FloatingWhatsApp() {
  const { site } = useSite()
  if (!site.whatsappNumber) return null
  const href = buildWhatsAppUrl(site.whatsappNumber, `Hello ${site.storeName || 'Branded Factory'}! 👋 I have a question.`)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="bf-fab group fixed bottom-24 right-4 z-40 transition-[bottom] duration-300 md:bottom-6 md:right-6"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-ring" aria-hidden="true" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
      <span className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  )
}
