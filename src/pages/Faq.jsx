import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import WhatsAppButton from '../components/WhatsAppButton'
import { useSite } from '../hooks/useData'
import { cn } from '../lib/utils'

function Answer({ text }) {
  // Highlight [EDIT: ...] placeholders so the owner can spot text that still needs replacing.
  const parts = text.split(/(\[EDIT:[^\]]*\])/g)
  return parts.map((part, i) =>
    part.startsWith('[EDIT:') ? (
      <mark key={i} className="rounded bg-gold-100 px-1 text-gold-800">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function Item({ q, a, open, onToggle, id }) {
  return (
    <li className="rounded-2xl bg-white shadow-soft">
      <h3 className="font-sans text-base">
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-navy sm:px-6">
          {q}
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all', open ? 'rotate-45 bg-navy text-white' : 'bg-cream-100 text-navy')} aria-hidden="true">
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-relaxed text-ink-muted sm:px-6">
              <Answer text={a} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function Faq() {
  const { site } = useSite()
  const [open, setOpen] = useState(0)
  const faq = site.faq || []
  return (
    <>
      <Seo title="FAQ" description="How ordering works at Branded Factory: WhatsApp ordering, delivery, payments and returns." path="/faq" />
      <section className="container-px max-w-3xl pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
        <p className="eyebrow mt-6">Good to know</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-3 text-ink-muted">Everything about ordering, delivery and returns.</p>
        <ul className="mt-8 space-y-3">
          {faq.map((f, i) => (
            <Item key={i} id={`faq-${i}`} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
        <div className="mt-12 rounded-3xl bg-navy p-8 text-center text-white">
          <h2 className="text-2xl font-semibold text-white">Still have a question?</h2>
          <p className="mt-2 text-white/75">We usually reply within minutes.</p>
          <WhatsAppButton className="mt-5" message={`Hello ${site.storeName || 'Branded Factory'}! 👋 I have a question.`}>Ask on WhatsApp</WhatsAppButton>
        </div>
      </section>
    </>
  )
}
