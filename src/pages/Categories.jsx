import { useMemo } from 'react'
import { m } from 'framer-motion'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoryCard from '../components/CategoryCard'
import Skeleton from '../components/Skeleton'
import { staggerContainer, staggerItem } from '../components/Reveal'
import { useCatalog } from '../hooks/useData'

export default function Categories() {
  const { categories, products, status } = useCatalog()
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
    <>
      <Seo title="All Categories" description="Browse every category at Branded Factory: sneakers, clothing, bags, watches, skincare, fragrances and more, all at bumper discounts." path="/categories" />
      <section className="container-px pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
        <p className="eyebrow mt-4">Shop by category</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">All Categories</h1>
        <p className="mt-2 text-ink-muted">Everything you love, at prices you’ll love more.</p>
        {status === 'loading' ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : (
          <m.div variants={staggerContainer} initial={false} animate="show" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((c) => (
              <m.div key={c.id} variants={staggerItem}>
                <CategoryCard category={c} count={stats[c.id]?.count || 0} maxDiscount={stats[c.id]?.max || 0} className="h-full" />
              </m.div>
            ))}
          </m.div>
        )}
      </section>
    </>
  )
}
