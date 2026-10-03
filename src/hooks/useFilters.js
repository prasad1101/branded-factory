import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { byDiscount, byFeatured, byNewest } from '../lib/data'

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

export const DISCOUNT_BANDS = [10, 25, 40, 50]

// Display order for clothing sizes; UK shoe sizes and numbers sort numerically after these
const LETTER_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREE SIZE']
function sizeRank(s) {
  const up = String(s).toUpperCase()
  const i = LETTER_SIZES.indexOf(up)
  if (i >= 0) return [0, i]
  const n = parseFloat(up.replace(/[^\d.]/g, ''))
  if (/^UK/.test(up)) return [1, n]
  if (!Number.isNaN(n)) return [2, n]
  return [3, 0]
}
const bySize = (a, b) => {
  const [ga, va] = sizeRank(a)
  const [gb, vb] = sizeRank(b)
  return ga - gb || va - vb || String(a).localeCompare(String(b))
}

const SORTERS = {
  featured: byFeatured,
  discount: byDiscount,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  newest: byNewest,
}

const list = (v) => (v ? v.split(',').filter(Boolean) : [])

/**
 * Filter + sort state that lives in the URL query string, e.g.
 *   ?cat=sneakers&size=UK%209&color=Black&brand=Nike&min=200&max=900&disc=25&stock=1&sort=discount
 *
 * @param {object[]} baseProducts products in scope (a category, search results, or everything)
 * @param {{ defaultSort?: string, keepOrder?: boolean }} opts keepOrder=true keeps search relevance order when sort is default
 */
export function useFilters(baseProducts, { defaultSort = 'featured', keepOrder = false } = {}) {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      cat: list(params.get('cat')),
      sub: list(params.get('sub')),
      size: list(params.get('size')),
      color: list(params.get('color')),
      brand: list(params.get('brand')),
      min: params.get('min') ? Number(params.get('min')) : null,
      max: params.get('max') ? Number(params.get('max')) : null,
      disc: Number(params.get('disc')) || 0,
      stock: params.get('stock') === '1',
      tag: params.get('tag') || '',
      sort: SORTERS[params.get('sort')] ? params.get('sort') : defaultSort,
      sortExplicit: Boolean(SORTERS[params.get('sort')]),
    }),
    [params, defaultSort],
  )

  /** Update one or more query params; null/empty values are removed. */
  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(patch).forEach(([k, v]) => {
            const val = Array.isArray(v) ? v.join(',') : v
            if (val === null || val === undefined || val === '' || val === false || val === 0) next.delete(k)
            else next.set(k, val === true ? '1' : String(val))
          })
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const toggle = useCallback(
    (key, value) => {
      const current = filters[key]
      update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] })
    },
    [filters, update],
  )

  const clearAll = useCallback(() => update({ cat: null, sub: null, size: null, color: null, brand: null, min: null, max: null, disc: null, stock: null, tag: null }), [update])

  // Facets are computed from the products in scope, so options never lead to zero results by themselves.
  const facets = useMemo(() => {
    const cats = new Map()
    const subs = new Map()
    const brands = new Map()
    const sizes = new Map()
    const colors = new Map()
    let lo = Infinity
    let hi = 0
    baseProducts.forEach((p) => {
      if (p.category) cats.set(p.category, { name: p.categoryName, count: (cats.get(p.category)?.count || 0) + 1 })
      if (p.subcategory) subs.set(p.subcategory, (subs.get(p.subcategory) || 0) + 1)
      ;(p.sizes || []).forEach((s) => sizes.set(s, (sizes.get(s) || 0) + 1))
      ;(p.colors || []).forEach((c) => c?.name && colors.set(c.name, { hex: c.hex, count: (colors.get(c.name)?.count || 0) + 1 }))
      if (p.brand) brands.set(p.brand, (brands.get(p.brand) || 0) + 1)
      lo = Math.min(lo, p.price)
      hi = Math.max(hi, p.price)
    })
    const sortByName = (a, b) => a[0].localeCompare(b[0])
    return {
      categories: [...cats.entries()].map(([id, c]) => [id, c.count, c.name]),
      subcategories: [...subs.entries()].sort(sortByName),
      brands: [...brands.entries()].sort(sortByName),
      sizes: [...sizes.entries()].sort((a, b) => bySize(a[0], b[0])),
      colors: [...colors.entries()].map(([name, c]) => [name, c.count, c.hex]).sort((a, b) => b[1] - a[1]),
      priceMin: lo === Infinity ? 0 : Math.floor(lo / 10) * 10,
      priceMax: hi === 0 ? 0 : Math.ceil(hi / 10) * 10,
    }
  }, [baseProducts])

  const results = useMemo(() => {
    const out = baseProducts.filter((p) => {
      if (filters.cat.length && !filters.cat.includes(p.category)) return false
      if (filters.sub.length && !filters.sub.includes(p.subcategory)) return false
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false
      if (filters.size.length && !(p.sizes || []).some((s) => filters.size.includes(s) && !(p.unavailableSizes || []).includes(s))) return false
      if (filters.color.length && !(p.colors || []).some((c) => filters.color.includes(c.name))) return false
      if (filters.min !== null && p.price < filters.min) return false
      if (filters.max !== null && p.price > filters.max) return false
      if (filters.disc && p.discountPercent < filters.disc) return false
      if (filters.stock && !p.inStock) return false
      if (filters.tag && !p.tags.includes(filters.tag)) return false
      return true
    })
    if (keepOrder && !filters.sortExplicit) return out
    return [...out].sort(SORTERS[filters.sort])
  }, [baseProducts, filters, keepOrder])

  const activeCount =
    filters.cat.length +
    filters.sub.length +
    filters.size.length +
    filters.color.length +
    filters.brand.length +
    (filters.min !== null || filters.max !== null ? 1 : 0) +
    (filters.disc ? 1 : 0) +
    (filters.stock ? 1 : 0) +
    (filters.tag ? 1 : 0)

  return { filters, update, toggle, clearAll, facets, results, activeCount }
}
