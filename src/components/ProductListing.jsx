import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from './ProductCard'
import FilterPanel from './FilterPanel'
import EmptyState from './EmptyState'
import { ProductGridSkeleton } from './Skeleton'
import { SORTS, useFilters } from '../hooks/useFilters'
import { cn, formatINR, pluralize } from '../lib/utils'

const PAGE_SIZE = 24

function SortSelect({ value, onChange, includeRelevance }) {
  return (
    <label className="relative flex items-center gap-2 text-sm">
      <span className="hidden text-ink-muted sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-navy/15 bg-white pl-4 pr-9 text-sm font-semibold text-navy focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        aria-label="Sort products"
      >
        {includeRelevance && <option value="relevance">Best match</option>}
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 h-4 w-4 text-navy" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </label>
  )
}

function MobileFilterSheet({ open, onClose, resultCount, children, onClear, activeCount }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <m.div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-cream shadow-lift"
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <h2 className="text-2xl font-semibold">Filters</h2>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button type="button" onClick={onClear} className="text-sm font-semibold text-coral-600">
                    Clear all
                  </button>
                )}
                <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-cream-200" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
            <div className="border-t border-navy/5 bg-white p-4 pb-safe">
              <button type="button" onClick={onClose} className="btn-primary w-full py-3.5">
                Show {pluralize(resultCount, 'product')}
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Filterable, sortable product grid used by the category, shop and search pages.
 */
export default function ProductListing({ products, loading, showSubcategories = true, showCategories = false, keepOrder = false, defaultSort = 'featured', query = '' }) {
  const baseSort = keepOrder ? 'relevance' : defaultSort
  const { filters, update, toggle, clearAll, facets, results, activeCount } = useFilters(products, { defaultSort: baseSort, keepOrder })
  const [visible, setVisible] = useState(PAGE_SIZE)
  // Skip the stagger on the first paint (faster LCP); animate when filters change
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  const [sheetOpen, setSheetOpen] = useState(false)

  const filterKey = JSON.stringify([filters, products.length])
  useEffect(() => setVisible(PAGE_SIZE), [filterKey])

  const chips = useMemo(() => {
    const c = []
    if (filters.disc) c.push({ key: 'disc', label: `${filters.disc}%+ off`, clear: () => update({ disc: null }) })
    filters.cat.forEach((id) => c.push({ key: `cat-${id}`, label: facets.categories.find(([cid]) => cid === id)?.[2] || id, clear: () => toggle('cat', id) }))
    filters.sub.forEach((s) => c.push({ key: `sub-${s}`, label: s, clear: () => toggle('sub', s) }))
    filters.brand.forEach((b) => c.push({ key: `brand-${b}`, label: b, clear: () => toggle('brand', b) }))
    if (filters.min !== null || filters.max !== null)
      c.push({
        key: 'price',
        label: `${formatINR(filters.min ?? facets.priceMin)} – ${formatINR(filters.max ?? facets.priceMax)}`,
        clear: () => update({ min: null, max: null }),
      })
    if (filters.stock) c.push({ key: 'stock', label: 'In stock', clear: () => update({ stock: null }) })
    if (filters.tag) c.push({ key: 'tag', label: filters.tag.replace(/-/g, ' '), clear: () => update({ tag: null }) })
    return c
  }, [filters, facets, update, toggle])

  const panel = <FilterPanel filters={filters} facets={facets} update={update} toggle={toggle} showSubcategories={showSubcategories} showCategories={showCategories} />
  const shown = results.slice(0, visible)

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Filters</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-coral-600 hover:underline">
                Clear all
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <h2 className="sr-only">Products</h2>
        <div className="sticky top-14 z-30 -mx-4 mb-4 flex items-center gap-3 bg-cream/90 px-4 py-3 backdrop-blur-lg sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-navy/15 bg-white px-4 text-sm font-semibold text-navy lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[11px] text-white">{activeCount}</span>
            )}
          </button>
          <p className="hidden text-sm text-ink-muted sm:block" aria-live="polite">
            {loading ? 'Loading…' : <><span className="font-semibold text-navy">{results.length}</span> {results.length === 1 ? 'product' : 'products'}</>}
          </p>
          <div className="ml-auto">
            <SortSelect value={filters.sort} includeRelevance={keepOrder} onChange={(v) => update({ sort: v === baseSort ? null : v })} />
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button key={c.key} type="button" onClick={c.clear} className="chip gap-1 bg-navy/5 capitalize" aria-label={`Remove filter ${c.label}`}>
                {c.label} <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="px-2 text-sm font-semibold text-coral-600 hover:underline">
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton count={9} />
        ) : results.length === 0 ? (
          <EmptyState
            query={query}
            title={query && !products.length ? `No results for “${query}”` : 'No products match these filters'}
            message={query && !products.length ? 'Check the spelling or try a brand, product type or category.' : 'Try removing a filter to see more products.'}
            action={activeCount > 0 && <button type="button" onClick={clearAll} className="btn-primary">Clear all filters</button>}
          />
        ) : (
          <>
            <m.ul key={filterKey} initial={firstRender.current ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }} className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {shown.map((p, i) => (
                <m.li key={p.id} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.35 }}>
                  <ProductCard product={p} eager={i < 4} />
                </m.li>
              ))}
            </m.ul>
            {results.length > visible && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-sm text-ink-muted">
                  Showing {shown.length} of {results.length}
                </p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-cream-300">
                  <div className="h-full bg-gold-500" style={{ width: `${(shown.length / results.length) * 100}%` }} />
                </div>
                <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-outline mt-2 px-8">
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <MobileFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={results.length} onClear={clearAll} activeCount={activeCount}>
        {panel}
      </MobileFilterSheet>
    </div>
  )
}
