import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, BadgePercent, ClipboardList, PackageCheck, PiggyBank, Search, Send, Sparkles } from 'lucide-react'
import Seo from '../components/Seo'
import HeroCarousel from '../components/HeroCarousel'
import SectionHeader from '../components/SectionHeader'
import ProductCarousel from '../components/ProductCarousel'
import CategoryCard from '../components/CategoryCard'
import Countdown from '../components/Countdown'
import Reveal, { staggerContainer, staggerItem } from '../components/Reveal'
import Skeleton from '../components/Skeleton'
import WhatsAppButton from '../components/WhatsAppButton'
import { WhatsAppIcon } from '../components/BrandIcons'
import { useCatalog } from '../hooks/useData'
import { byDiscount, byFeatured, byNewest, withTag } from '../lib/data'

const TRUST = [
  { icon: BadgePercent, title: 'Bumper Discounts', text: 'Up to 60% off MRP' },
  { icon: PiggyBank, title: 'Assured Savings', text: 'On every single order' },
  { icon: BadgeCheck, title: '100% Genuine Brands', text: 'From authorised distributors' },
  { icon: WhatsAppIcon, title: 'Order on WhatsApp', text: 'Quick, easy, personal' },
]

const STEPS = [
  { icon: Search, title: 'Browse', text: 'Explore hundreds of branded products at bumper discounts.' },
  { icon: ClipboardList, title: 'Add to list', text: 'Add what you need to your enquiry list. No sign-up needed.' },
  { icon: Send, title: 'Send on WhatsApp', text: 'One tap sends your list to us as a neat WhatsApp message.' },
  { icon: PackageCheck, title: 'We confirm & deliver', text: 'We confirm availability and the final price, then deliver.' },
]

function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="container-px mt-6 sm:mt-8">
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-3 rounded-3xl border border-navy/5 bg-white p-3 shadow-soft sm:gap-4 sm:p-4 lg:grid-cols-4"
      >
        {TRUST.map(({ icon: Icon, title, text }) => (
          <motion.li key={title} variants={staggerItem} className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center sm:flex-row sm:gap-3 sm:p-3 sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700 ring-1 ring-gold-200 sm:h-12 sm:w-12">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold leading-tight text-navy sm:text-sm">{title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-ink-muted">{text}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

function CategoryGrid({ categories, products, loading }) {
  const stats = useMemo(() => {
    const s = {}
    products.forEach((p) => {
      s[p.category] ??= { count: 0, max: 0 }
      s[p.category].count++
      s[p.category].max = Math.max(s[p.category].max, p.discountPercent)
    })
    return s
  }, [products])
  return (
    <section className="container-px mt-16 sm:mt-20" aria-labelledby="cat-heading">
      <SectionHeader eyebrow="Shop by category" title={<span id="cat-heading">Everything you love, for less</span>} to="/categories" linkText="All categories" />
      {loading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6"
        >
          {categories.map((c) => (
            <motion.div key={c.id} variants={staggerItem}>
              <CategoryCard category={c} count={stats[c.id]?.count || 0} maxDiscount={stats[c.id]?.max || 0} className="h-full" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

function DealOfTheDay({ products, loading }) {
  if (!loading && !products.length) return null
  return (
    <section className="relative mt-16 overflow-hidden bg-navy py-14 sm:mt-20 sm:py-20" aria-labelledby="deal-heading">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-coral-600/10 blur-3xl" aria-hidden="true" />
      <div className="container-px relative">
        <ProductCarousel
          light
          loading={loading}
          products={products}
          label="Deal of the Day"
          header={
            <SectionHeader
              light
              eyebrow="Today only"
              title={<span id="deal-heading">Deal of the Day</span>}
              subtitle="Handpicked bumper deals. Prices reset at midnight."
            >
              <div className="w-full sm:w-auto">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/60">Ends in</p>
                <Countdown />
              </div>
            </SectionHeader>
          }
        />
      </div>
    </section>
  )
}

function ProductRow({ eyebrow, title, subtitle, to, products, loading, id }) {
  if (!loading && !products.length) return null
  return (
    <section className="container-px mt-16 sm:mt-20" aria-labelledby={id}>
      <ProductCarousel
        loading={loading}
        products={products}
        label={typeof title === 'string' ? title : eyebrow}
        header={<SectionHeader eyebrow={eyebrow} title={<span id={id}>{title}</span>} subtitle={subtitle} to={to} />}
      />
    </section>
  )
}

function HowToOrder() {
  return (
    <section className="container-px mt-20 sm:mt-24" aria-labelledby="how-heading">
      <SectionHeader center eyebrow="Simple & personal" title={<span id="how-heading">How to order</span>} subtitle="No payment gateway, no sign-up. Just pick, send and relax." />
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-gold-200 via-gold-500 to-gold-200 lg:block" aria-hidden="true" />
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <motion.li key={title} variants={staggerItem} className="relative rounded-2xl bg-white p-6 text-center shadow-soft">
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold-400 ring-8 ring-cream">
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy">{i + 1}</span>
            </span>
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{text}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}

function ClosingCta({ site }) {
  return (
    <section className="container-px mt-20 sm:mt-24" aria-labelledby="cta-heading">
      <Reveal className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.28),transparent_60%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-4 rounded-[1.25rem] border border-gold-500/20" aria-hidden="true" />
        <div className="relative">
          <Sparkles className="mx-auto h-8 w-8 text-gold-400" aria-hidden="true" />
          <h2 id="cta-heading" className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold text-white sm:text-5xl">
            Your favourite brands. Bumper savings. One WhatsApp away.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            Can’t find what you’re looking for? Message us and we’ll source it for you at the best price.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton size="lg" message={`Hello ${site.storeName || 'Branded Factory'}! 👋 I'm looking for a product.`}>
              Chat on WhatsApp
            </WhatsAppButton>
            <Link to="/shop" className="btn border border-white/25 px-7 py-4 text-base text-white hover:bg-white/10">
              Browse all products
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  const { site, categories, products, status } = useCatalog()
  const loading = status === 'loading'

  const rows = useMemo(() => {
    const live = products.filter((p) => p.inStock)
    return {
      deals: withTag(products, 'deal-of-the-day').sort(byDiscount),
      // Skip today's deals so this row adds variety
      savings: live.filter((p) => !p.tags.includes('deal-of-the-day')).sort(byDiscount).slice(0, 10),
      bestsellers: withTag(products, 'bestseller').sort(byFeatured).slice(0, 12),
      newest: [...products].sort(byNewest).slice(0, 10),
      featured: products.filter((p) => p.featured).sort(byFeatured).slice(0, 12),
    }
  }, [products])

  const showcase = useMemo(
    () =>
      categories
        .filter((c) => c.featured)
        .map((c) => ({ category: c, items: products.filter((p) => p.category === c.id).sort(byFeatured).slice(0, 10) }))
        .filter((r) => r.items.length >= 2),
    [categories, products],
  )

  return (
    <>
      <Seo path="/" />
      <div className="container-px pt-3 sm:pt-6">
        <HeroCarousel banners={site.heroBanners || []} loading={loading} />
      </div>
      <TrustStrip />
      <CategoryGrid categories={categories} products={products} loading={loading} />
      <DealOfTheDay products={rows.deals} loading={loading} />
      <ProductRow id="savings-heading" eyebrow="Assured savings" title="Biggest Savings" subtitle="Our deepest discounts right now, sorted by % off." to="/shop?sort=discount" products={rows.savings} loading={loading} />
      <ProductRow id="best-heading" eyebrow="Customer favourites" title="Bestsellers" to="/shop?tag=bestseller" products={rows.bestsellers} loading={loading} />
      <ProductRow id="new-heading" eyebrow="Just landed" title="New Arrivals" to="/shop?sort=newest" products={rows.newest} loading={loading} />
      <ProductRow id="feat-heading" eyebrow="Editor’s picks" title="Featured Products" to="/shop" products={rows.featured} loading={loading} />
      {showcase.map(({ category, items }) => (
        <ProductRow
          key={category.id}
          id={`cat-${category.id}-heading`}
          eyebrow={category.description}
          title={category.name}
          to={`/category/${category.id}`}
          products={items}
          loading={false}
        />
      ))}
      <HowToOrder />
      <ClosingCta site={site} />
    </>
  )
}
