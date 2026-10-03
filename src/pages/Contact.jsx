import { useState } from 'react'
import { Clock, Mail, MapPin, Send } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import { WhatsAppIcon } from '../components/BrandIcons'
import { useSite } from '../hooks/useData'
import { buildWhatsAppUrl } from '../lib/utils'

export default function Contact() {
  const { site } = useSite()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const storeName = site.storeName || 'Branded Factory'

  const onSubmit = (e) => {
    e.preventDefault()
    const text = [`Hello ${storeName}! 👋`, name.trim() && `This is ${name.trim()}.`, '', msg.trim() || 'I have a question.'].filter((l) => l !== false && l !== '').join('\n')
    window.open(buildWhatsAppUrl(site.whatsappNumber, text), '_blank', 'noopener,noreferrer')
  }

  const cards = [
    site.email && { icon: Mail, title: 'Email', body: <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a> },
    site.address && { icon: MapPin, title: 'Address', body: site.address },
    site.businessHours && { icon: Clock, title: 'Hours', body: site.businessHours },
  ].filter(Boolean)

  return (
    <>
      <Seo title="Contact Us" description={`Contact ${storeName} on WhatsApp at ${site.phoneDisplay || ''}. We reply quickly!`} path="/contact" />
      <section className="container-px pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        <div className="mt-4 max-w-2xl">
          <p className="eyebrow">We’re here to help</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Contact us</h1>
          <p className="mt-3 text-ink-muted">The fastest way to reach us is WhatsApp. Ask about a product, an order or a special request.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Reveal className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-lift sm:p-9 lg:col-span-2">
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-whatsapp/20 blur-3xl" aria-hidden="true" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp text-white">
              <WhatsAppIcon className="h-8 w-8" />
            </span>
            <h2 className="relative mt-6 text-3xl font-semibold text-white">Chat on WhatsApp</h2>
            <p className="relative mt-2 text-white/75">Order, ask about stock, or get a recommendation.</p>
            <a href={buildWhatsAppUrl(site.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="relative mt-5 block font-serif text-2xl text-gold-300 hover:underline">
              {site.phoneDisplay || `+${site.whatsappNumber || ''}`}
            </a>
            <WhatsAppButton className="relative mt-7 bg-whatsapp text-navy hover:bg-whatsapp/90" message={`Hello ${storeName}! 👋`}>
              Start a chat
            </WhatsAppButton>
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl bg-white p-7 shadow-soft sm:p-9 lg:col-span-3">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <p className="mt-1 text-sm text-ink-muted">This opens WhatsApp with your message ready to send.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-navy">Your name</label>
                <input id="c-name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul" />
              </div>
              <div>
                <label htmlFor="c-msg" className="mb-1.5 block text-sm font-semibold text-navy">Message</label>
                <textarea id="c-msg" className="input resize-none" rows={4} required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-primary px-7 py-3.5">
                <Send className="h-4 w-4" aria-hidden="true" /> Send via WhatsApp
              </button>
            </form>
          </Reveal>
        </div>

        {cards.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-6 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-navy">{title}</h3>
                  <p className="mt-1 text-ink-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
