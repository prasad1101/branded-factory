import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductListing from '../components/ProductListing'
import SmartImage from '../components/SmartImage'
import Skeleton from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { useCatalog } from '../hooks/useData'

export default function Category() {
  const { id } = useParams()
  const { categoriesById, products, status } = useCatalog()
  const loading = status === 'loading'
  const category = categoriesById[id]
  const items = useMemo(() => products.filter((p) => p.category === id), [products, id])
  const maxDiscount = items.reduce((m, p) => Math.max(m, p.discountPercent), 0)

  if (!loading && !category) {
    return (
      <div className="container-px py-12">
        <Seo title="Category not found" />
        <EmptyState as="h1" title="We couldn’t find that category" message="It may have been renamed or removed. Try one of these instead." />
      </div>
    )
  }

  return (
    <>
      <Seo
        title={category ? `${category.name}: Up to ${maxDiscount}% off` : 'Category'}
        description={category ? `Shop ${category.name.toLowerCase()} at bumper discounts. ${category.description}. Genuine brands, order on WhatsApp.` : undefined}
        path={`/category/${id}`}
      />
      <section className="container-px pt-4 sm:pt-6">
        {loading ? (
          <Skeleton className="h-48 rounded-3xl sm:h-56" />
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-8 shadow-lift sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex items-center gap-6">
              <div className="min-w-0 flex-1">
                <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: category.name }]} />
                <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{category.name}</h1>
                {category.description && <p className="mt-2 max-w-lg text-white/75">{category.description}</p>}
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-white ring-1 ring-white/15">{items.length} products</span>
                  {maxDiscount > 0 && <span className="rounded-full bg-coral-600 px-3 py-1.5 uppercase tracking-wide text-white">Up to {maxDiscount}% off</span>}
                </div>
              </div>
              <div className="hidden h-40 w-40 shrink-0 overflow-hidden rounded-full bg-cream-100 ring-4 ring-gold-500/30 sm:block lg:h-48 lg:w-48">
                <SmartImage src={category.image} alt="" eager className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="container-px mt-8" aria-label={`${category?.name || ''} products`}>
        <ProductListing products={items} loading={loading} />
        {!loading && (
          <p className="mt-12 text-center text-sm text-ink-muted">
            Looking for something else? <Link to="/categories" className="font-semibold text-navy underline-offset-4 hover:underline">Browse all categories</Link>
          </p>
        )}
      </section>
    </>
  )
}
