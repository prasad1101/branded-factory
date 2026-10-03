import { Link } from 'react-router-dom'
import { BadgeCheck, HeartHandshake, PiggyBank } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import { useCatalog } from '../hooks/useData'

const ICONS = [BadgeCheck, PiggyBank, HeartHandshake]

export default function About() {
  const { site, products, categories } = useCatalog()
  const brands = new Set(products.map((p) => p.brand)).size
  const maxDiscount = products.reduce((m, p) => Math.max(m, p.discountPercent), 0)
  const stats = [
    { value: `${products.length}+`, label: 'Products' },
    { value: `${brands}+`, label: 'Brands' },
    { value: categories.length, label: 'Categories' },
    { value: `${maxDiscount}%`, label: 'Top discount' },
  ]
  const values = site.aboutValues || []

  return (
    <>
      <Seo title="About Us" description={site.about} path="/about" />
      <section className="container-px pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About us' }]} />
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold sm:text-5xl">Premium brands. Honest prices. Real savings.</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{site.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary px-7 py-3.5">Start shopping</Link>
              <WhatsAppButton message={`Hello ${site.storeName || 'Branded Factory'}! 👋`} className="px-7 py-3.5">Say hello</WhatsAppButton>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl bg-navy p-8 shadow-lift sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/25 blur-3xl" aria-hidden="true" />
            <p className="relative font-serif text-2xl italic leading-snug text-white sm:text-3xl">
              “{site.tagline || 'Bumper Discounts. Assured Savings. Greatest Deals.'}”
            </p>
            <dl className="relative mt-10 grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs font-bold uppercase tracking-widest text-white/60">{s.label}</dt>
                  <dd className="mt-1 font-serif text-4xl font-semibold text-gold-300">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {values.length > 0 && (
        <section className="container-px mt-20" aria-labelledby="values-heading">
          <Reveal className="text-center">
            <p className="eyebrow">What we stand for</p>
            <h2 id="values-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">Our promise to you</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <Reveal key={v.title} delay={i * 0.08} className="rounded-2xl bg-white p-7 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-700 ring-1 ring-gold-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-ink-muted">{v.text}</p>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
