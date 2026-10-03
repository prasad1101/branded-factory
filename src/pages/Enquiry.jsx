import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ChevronDown, Info, ShoppingBag, Sparkles, Trash2 } from 'lucide-react'
import Seo from '../components/Seo'
import SmartImage from '../components/SmartImage'
import QuantitySelector from '../components/QuantitySelector'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductCarousel from '../components/ProductCarousel'
import SectionHeader from '../components/SectionHeader'
import Skeleton from '../components/Skeleton'
import { useCatalog } from '../hooks/useData'
import { useEnquiry, useToast } from '../hooks/useEnquiry'
import { buildEnquiryMessage, formatINR, getDiscount, pluralize } from '../lib/utils'
import { byFeatured, withTag } from '../lib/data'

function LineItem({ product, qty, onQty, onRemove, currency }) {
  const { savings } = getDiscount(product.mrp, product.price)
  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft sm:p-4"
    >
      <Link to={`/product/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-28 sm:w-28">
        <SmartImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-700">{product.brand}</p>
            <Link to={`/product/${product.id}`} className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-navy hover:underline sm:text-base">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-ink-muted">
              {product.size && <>{product.size} · </>}
              {formatINR(product.price, currency)} each
              {product.discountPercent > 0 && <span className="ml-1 font-semibold text-coral-600">({product.discountPercent}% off)</span>}
            </p>
            {!product.inStock && (
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-semibold text-coral-700">
                <Info className="h-3 w-3" aria-hidden="true" /> Out of stock, we’ll suggest an alternative
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="-mr-1 -mt-1 rounded-full p-2 text-ink-muted transition hover:bg-coral-50 hover:text-coral-600"
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <QuantitySelector size="sm" value={qty} onChange={onQty} label={`Quantity of ${product.name}`} />
          <div className="text-right">
            <p className="font-bold text-navy">{formatINR(product.price * qty, currency)}</p>
            {savings > 0 && <p className="text-xs font-semibold text-save">Save {formatINR(savings * qty, currency)}</p>}
          </div>
        </div>
      </div>
    </m.li>
  )
}

function Field({ label, id, optional = true, ...props }) {
  const Tag = props.rows ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label} {optional && <span className="font-normal text-ink-muted">(optional)</span>}
      </label>
      <Tag id={id} className="input resize-none" {...props} />
    </div>
  )
}

export default function Enquiry() {
  const { productsById, products, site, status } = useCatalog()
  const { items, setQty, remove, add, clear, customer, updateCustomer } = useEnquiry()
  const toast = useToast()
  const currency = site.currency || '₹'

  const lines = useMemo(() => items.map((i) => ({ ...i, product: productsById[i.id] })).filter((l) => l.product), [items, productsById])
  const missing = status === 'ready' ? items.length - lines.length : 0

  const totals = useMemo(() => {
    const mrp = lines.reduce((s, l) => s + (l.product.mrp || l.product.price) * l.qty, 0)
    const price = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
    const units = lines.reduce((s, l) => s + l.qty, 0)
    return { mrp, price, savings: Math.max(0, mrp - price), units, percent: mrp > 0 ? Math.floor(((mrp - price) / mrp) * 100) : 0 }
  }, [lines])

  const message = useMemo(
    () => buildEnquiryMessage({ items: lines, customer, storeName: site.storeName || 'Branded Factory', currency }),
    [lines, customer, site.storeName, currency],
  )

  const suggestions = useMemo(
    () => withTag(products, 'bestseller').filter((p) => !items.some((i) => i.id === p.id)).sort(byFeatured).slice(0, 10),
    [products, items],
  )

  const handleRemove = (line) => {
    remove(line.id)
    toast(`Removed ${line.product.name}`, { type: 'info', action: { label: 'Undo', onClick: () => add(line.id, line.qty) } })
  }

  const handleClear = () => {
    const snapshot = items
    clear()
    toast('Enquiry list cleared', { type: 'info', action: { label: 'Undo', onClick: () => snapshot.forEach((i) => add(i.id, i.qty)) } })
  }

  if (status === 'loading') {
    return (
      <div className="container-px pt-8" role="status" aria-label="Loading enquiry list">
        <Skeleton className="h-10 w-72" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <>
        <Seo title="Your Enquiry List" path="/enquiry" />
        <section className="container-px pt-10 text-center sm:pt-16">
          <m.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft ring-8 ring-gold-50">
            <ShoppingBag className="h-10 w-10 text-gold-700" aria-hidden="true" />
          </m.div>
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Your enquiry list is empty</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-muted">
            Add products you love, then send the whole list to us on WhatsApp in one tap. No sign-up, no payment online.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/shop?sort=discount" className="btn-gold px-7 py-3.5 text-base">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Shop biggest savings
            </Link>
            <Link to="/categories" className="btn-outline px-7 py-3.5 text-base">
              Browse categories
            </Link>
          </div>
        </section>
        {suggestions.length > 0 && (
          <section className="container-px mt-16" aria-labelledby="sugg-heading">
            <ProductCarousel products={suggestions} label="Bestsellers" header={<SectionHeader eyebrow="Get started" title={<span id="sugg-heading">Customer favourites</span>} to="/shop?tag=bestseller" />} />
          </section>
        )}
      </>
    )
  }

  return (
    <>
      <Seo title={`Your Enquiry List (${totals.units})`} path="/enquiry" />
      <div className="container-px pt-6 sm:pt-10">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Continue shopping
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Your Enquiry List</h1>
            <p className="mt-1 text-ink-muted">
              {pluralize(lines.length, 'product')} · {pluralize(totals.units, 'item')}
            </p>
          </div>
          <button type="button" onClick={handleClear} className="text-sm font-semibold text-coral-600 hover:underline">
            Clear list
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
          <div>
            {missing > 0 && (
              <p className="mb-3 rounded-xl bg-gold-50 px-4 py-3 text-sm text-gold-800 ring-1 ring-gold-200">
                {pluralize(missing, 'item')} in your list {missing === 1 ? 'is' : 'are'} no longer available and {missing === 1 ? 'was' : 'were'} hidden.
              </p>
            )}
            <ul className="space-y-3" aria-label="Products in your enquiry list">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <LineItem key={l.id} product={l.product} qty={l.qty} currency={currency} onQty={(q) => setQty(l.id, q)} onRemove={() => handleRemove(l)} />
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24" aria-label="Enquiry summary">
            <div className="overflow-hidden rounded-3xl bg-white shadow-lift">
              <div className="bg-navy px-6 py-5 text-white">
                <h2 className="font-serif text-2xl font-semibold text-white">Summary</h2>
                <p className="text-sm text-white/70">Final price confirmed on WhatsApp</p>
              </div>
              <div className="p-6">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Total MRP</dt>
                    <dd className="text-ink-muted line-through decoration-coral-600/50">{formatINR(totals.mrp, currency)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Bumper discount</dt>
                    <dd className="font-semibold text-save">− {formatINR(totals.savings, currency)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-navy/10 pt-3">
                    <dt className="font-semibold text-navy">Total</dt>
                    <dd className="font-serif text-3xl font-semibold text-navy">{formatINR(totals.price, currency)}</dd>
                  </div>
                </dl>
                {totals.savings > 0 && (
                  <m.div
                    key={totals.savings}
                    initial={{ scale: 0.96, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 flex items-center gap-3 rounded-2xl bg-save-50 px-4 py-3 ring-1 ring-save/15"
                  >
                    <span className="text-2xl" aria-hidden="true">🎉</span>
                    <p className="text-sm text-save-700">
                      You save <span className="text-lg font-bold">{formatINR(totals.savings, currency)}</span>
                      {totals.percent > 0 && <> ({totals.percent}% off MRP)</>}
                    </p>
                  </m.div>
                )}

                <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <Field id="cust-name" label="Your name" autoComplete="name" value={customer.name || ''} onChange={(e) => updateCustomer({ name: e.target.value })} placeholder="e.g. Priya Sharma" />
                  <Field id="cust-loc" label="Area / city" autoComplete="address-level2" value={customer.location || ''} onChange={(e) => updateCustomer({ location: e.target.value })} placeholder="e.g. Kothrud, Pune" />
                  <Field id="cust-notes" label="Delivery notes" rows={3} value={customer.notes || ''} onChange={(e) => updateCustomer({ notes: e.target.value })} placeholder="Preferred time, landmark, substitutions…" />
                </form>

                <WhatsAppButton size="lg" className="mt-6 w-full" message={message}>
                  Send Enquiry on WhatsApp
                </WhatsAppButton>
                <p className="mt-3 text-center text-xs text-ink-muted">
                  Opens WhatsApp with your list ready to send. We’ll confirm availability, final price and delivery.
                </p>

                <details className="group mt-5 rounded-xl bg-cream-100 text-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    Preview message <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words px-4 pb-4 font-sans text-xs leading-relaxed text-ink">{message}</pre>
                </details>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
