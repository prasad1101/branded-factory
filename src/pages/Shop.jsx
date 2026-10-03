import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductListing from '../components/ProductListing'
import SearchBar from '../components/layout/SearchBar'
import ProductCarousel from '../components/ProductCarousel'
import SectionHeader from '../components/SectionHeader'
import { useCatalog } from '../hooks/useData'
import { useProductSearch } from '../hooks/useSearch'
import { byFeatured, withTag } from '../lib/data'

const TITLES = {
  discount: { eyebrow: 'Assured savings', title: 'Biggest Savings', text: 'Every product, sorted by the deepest discount first.' },
  newest: { eyebrow: 'Just landed', title: 'New Arrivals', text: 'The latest additions to our shelves.' },
  bestseller: { eyebrow: 'Customer favourites', title: 'Bestsellers', text: 'The products our customers order again and again.' },
  default: { eyebrow: 'The full collection', title: 'Shop All Products', text: 'Genuine brands at bumper discounts, all in one place.' },
}

function SearchHeader({ q, count, loading }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">Search</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{q ? <>Results for “{q}”</> : 'What are you looking for?'}</h1>
      {q && !loading && <p className="mt-2 text-sm text-ink-muted">{count} {count === 1 ? 'product' : 'products'} found</p>}
      <SearchBar large autoFocus={!q} initialQuery={q} className="mt-6 text-left" />
    </div>
  )
}

export default function Shop({ mode }) {
  const [params] = useSearchParams()
  const { products, categories, status } = useCatalog()
  const loading = status === 'loading'
  const search = useProductSearch()
  const isSearch = mode === 'search'
  const q = (params.get('q') || '').trim()

  const base = useMemo(() => (isSearch ? (q ? search(q) : []) : products), [isSearch, q, search, products])
  const popular = useMemo(() => withTag(products, 'bestseller').sort(byFeatured).slice(0, 10), [products])

  const meta = TITLES[params.get('tag')] || TITLES[params.get('sort')] || TITLES.default

  if (isSearch) {
    return (
      <>
        <Seo title={q ? `Search: ${q}` : 'Search'} description="Search genuine branded products at bumper discounts." path={`/search${q ? `?q=${encodeURIComponent(q)}` : ''}`} />
        <section className="container-px pt-8 sm:pt-12">
          <SearchHeader q={q} count={base.length} loading={loading} />
        </section>
        {q ? (
          <section className="container-px mt-10" aria-label="Search results">
            <ProductListing products={base} loading={loading} keepOrder query={q} showCategories showSubcategories={false} />
          </section>
        ) : (
          <>
            <section className="container-px mt-10 text-center" aria-label="Browse categories">
              <p className="eyebrow">Or browse a category</p>
              <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <Link key={c.id} to={`/category/${c.id}`} className="chip">
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
            <section className="container-px mt-14" aria-labelledby="popular-heading">
              <ProductCarousel loading={loading} products={popular} label="Popular right now" header={<SectionHeader eyebrow="Trending" title={<span id="popular-heading">Popular right now</span>} />} />
            </section>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Seo title={meta.title} description={`${meta.text} Order on WhatsApp.`} path="/shop" />
      <section className="container-px pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: meta.title }]} />
        <div className="mt-3 max-w-2xl">
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{meta.title}</h1>
          <p className="mt-2 text-ink-muted">{meta.text}</p>
        </div>
      </section>
      <section className="container-px mt-8" aria-label="Products">
        <ProductListing products={base} loading={loading} showCategories showSubcategories={false} />
      </section>
    </>
  )
}
