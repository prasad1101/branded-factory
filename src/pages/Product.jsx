import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, m } from 'framer-motion'
import { BadgeCheck, Check, CircleAlert, PiggyBank, ShoppingBag, Truck } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductGallery from '../components/ProductGallery'
import PriceBlock from '../components/PriceBlock'
import RatingStars from '../components/RatingStars'
import QuantitySelector from '../components/QuantitySelector'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductCarousel from '../components/ProductCarousel'
import SectionHeader from '../components/SectionHeader'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import Deferred from '../components/Deferred'
import { useCatalog } from '../hooks/useData'
import { useAddToList, useEnquiry } from '../hooks/useEnquiry'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { assetUrl, buildProductMessage, formatINR, pageUrl } from '../lib/utils'
import { byFeatured } from '../lib/data'

function ProductSkeleton() {
  return (
    <div className="container-px grid gap-8 pt-6 md:grid-cols-2 lg:gap-14" role="status" aria-label="Loading product">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </div>
  )
}

const ASSURANCES = [
  { icon: BadgeCheck, text: '100% genuine, sealed products' },
  { icon: PiggyBank, text: 'Assured savings on MRP' },
  { icon: Truck, text: 'Delivery confirmed on WhatsApp' },
]

export default function Product() {
  const { id } = useParams()
  const { productsById, products, site, status } = useCatalog()
  const product = productsById[id]
  const [qty, setQty] = useState(1)
  const addToList = useAddToList()
  const { qtyOf } = useEnquiry()
  const { ids: recentIds, track } = useRecentlyViewed()
  const actionsRef = useRef(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => setQty(1), [id])
  useEffect(() => {
    if (product) track(product.id)
  }, [product, track])

  // Show a compact sticky action bar on mobile once the main buttons scroll away
  useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [product])
  useEffect(() => {
    if (showSticky) document.body.dataset.stickyCta = '1'
    else delete document.body.dataset.stickyCta
    return () => delete document.body.dataset.stickyCta
  }, [showSticky])

  const related = useMemo(() => {
    if (!product) return []
    const same = products.filter((p) => p.id !== product.id && p.category === product.category)
    const others = products.filter((p) => p.id !== product.id && p.category !== product.category && p.subcategory === product.subcategory)
    return [...same.sort(byFeatured), ...others].slice(0, 10)
  }, [product, products])

  const recent = useMemo(() => recentIds.filter((rid) => rid !== id).map((rid) => productsById[rid]).filter(Boolean).slice(0, 10), [recentIds, id, productsById])

  if (status === 'loading') return <ProductSkeleton />
  if (!product) {
    return (
      <div className="container-px py-12">
        <Seo title="Product not found" />
        <EmptyState as="h1" title="This product isn’t available" message="It may have been removed or the link is incorrect. Explore similar categories below." />
      </div>
    )
  }

  const storeName = site.storeName || 'Branded Factory'
  const currency = site.currency || '₹'
  const message = buildProductMessage({ product, qty, storeName, currency, pageUrl: pageUrl(`/product/${product.id}`) })
  const inList = qtyOf(product.id)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.shortDescription || product.description,
    image: product.images.map((src) => new URL(assetUrl(src), window.location.origin).href),
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <Seo
        title={`${product.name}${product.discountPercent ? `: ${product.discountPercent}% off` : ''}`}
        description={`${product.brand} ${product.name}${product.size ? ` (${product.size})` : ''} for ${formatINR(product.price, currency)}${product.discountPercent ? ` (MRP ${formatINR(product.mrp, currency)}, save ${product.discountPercent}%)` : ''}. ${product.shortDescription || ''}`}
        image={product.images[0]}
        path={`/product/${product.id}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="container-px pt-4 sm:pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: product.categoryName, to: `/category/${product.category}` },
            { label: product.name },
          ]}
        />
        <div className="mt-4 grid gap-8 md:grid-cols-2 lg:gap-14">
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={product.images} name={product.name} discount={product.discountPercent} />
          </div>

          <div>
            <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="eyebrow hover:underline">
              {product.brand}
            </Link>
            <h1 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              {product.size && <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy shadow-soft">{product.size}</span>}
              <RatingStars rating={product.rating} size="lg" />
              {product.subcategory && <span>· {product.subcategory}</span>}
            </div>

            <div className="mt-6 rounded-2xl border border-gold-200 bg-gradient-to-br from-white to-gold-50 p-5 sm:p-6">
              <PriceBlock mrp={product.mrp} price={product.price} size="lg" />
              {qty > 1 && product.savings > 0 && (
                <p className="mt-2 text-sm text-ink-muted">
                  For {qty}: <span className="font-semibold text-navy">{formatINR(product.price * qty, currency)}</span> · you save{' '}
                  <span className="font-semibold text-save">{formatINR(product.savings * qty, currency)}</span>
                </p>
              )}
              <p className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${product.inStock ? 'text-save' : 'text-coral-600'}`}>
                {product.inStock ? <Check className="h-4 w-4" aria-hidden="true" /> : <CircleAlert className="h-4 w-4" aria-hidden="true" />}
                {product.inStock ? 'In stock, ready to order' : 'Currently out of stock'}
              </p>
            </div>

            {product.shortDescription && <p className="mt-6 text-base leading-relaxed text-ink">{product.shortDescription}</p>}

            <div ref={actionsRef} className="mt-6 space-y-3">
              {product.inStock ? (
                <>
                  <div className="flex gap-3">
                    <QuantitySelector value={qty} onChange={setQty} />
                    <m.button whileTap={{ scale: 0.97 }} type="button" onClick={() => addToList(product, qty)} className="btn-primary flex-1 py-3.5 text-base">
                      <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Add to <span className="hidden sm:inline">Enquiry</span> List
                    </m.button>
                  </div>
                  <WhatsAppButton size="lg" className="w-full" message={message}>
                    Order on WhatsApp
                  </WhatsAppButton>
                  {inList > 0 && (
                    <p className="text-center text-sm text-ink-muted">
                      {inList} already in your <Link to="/enquiry" className="font-semibold text-navy underline underline-offset-4">enquiry list</Link>
                    </p>
                  )}
                </>
              ) : (
                <WhatsAppButton size="lg" className="w-full" message={message}>
                  Ask about availability on WhatsApp
                </WhatsAppButton>
              )}
            </div>

            <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-soft sm:grid-cols-3 sm:p-5">
              {ASSURANCES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-ink sm:flex-col sm:text-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            {product.highlights.length > 0 && (
              <section className="mt-8" aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="text-2xl font-semibold">Highlights</h2>
                <ul className="mt-4 space-y-2.5">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-ink">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-save-50 text-save">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.description && (
              <section className="mt-8" aria-labelledby="desc-heading">
                <h2 id="desc-heading" className="text-2xl font-semibold">Description</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                  {product.description.split(/\n+/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <Deferred minHeight={520}>
      {related.length > 0 && (
        <section className="container-px mt-20" aria-labelledby="related-heading">
          <ProductCarousel products={related} label="You may also like" header={<SectionHeader eyebrow={`More in ${product.categoryName}`} title={<span id="related-heading">You may also like</span>} to={`/category/${product.category}`} />} />
        </section>
      )}
      {recent.length > 0 && (
        <section className="container-px mt-16" aria-labelledby="recent-heading">
          <ProductCarousel products={recent} label="Recently viewed" header={<SectionHeader eyebrow="Pick up where you left off" title={<span id="recent-heading">Recently viewed</span>} />} />
        </section>
      )}
      </Deferred>

      {/* Mobile sticky action bar */}
      <AnimatePresence>
        {showSticky && (
          <m.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
            className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t border-navy/5 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-ink-muted">{product.name}</p>
                <p className="font-bold text-navy">
                  {formatINR(product.price * qty, currency)}{' '}
                  {product.discountPercent > 0 && <span className="text-xs font-bold text-coral-600">{product.discountPercent}% off</span>}
                </p>
              </div>
              {product.inStock && (
                <button type="button" onClick={() => addToList(product, qty)} className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white" aria-label="Add to enquiry list">
                  <ShoppingBag className="h-5 w-5" />
                </button>
              )}
              <WhatsAppButton message={message} className="px-4 py-2.5">
                {product.inStock ? 'Order' : 'Ask'}
              </WhatsAppButton>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
