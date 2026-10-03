/**
 * Central data layer. Fetches the JSON files in public/data once, caches them,
 * and adds computed fields (discount %, savings) to every product.
 */
import { assetUrl, getDiscount } from './utils'

let catalogPromise = null

async function fetchJSON(file) {
  // index.html starts these downloads early (window.__BF_PRELOAD__) so they run in parallel with the JS.
  const key = file.replace('.json', '')
  const preloaded = typeof window !== 'undefined' && window.__BF_PRELOAD__?.[key]
  if (preloaded) delete window.__BF_PRELOAD__[key]
  // "no-cache" revalidates with the server, so owners see their edits right after a deploy.
  const res = await (preloaded || fetch(assetUrl(`data/${file}`), { cache: 'no-cache' })).catch(() =>
    fetch(assetUrl(`data/${file}`), { cache: 'no-cache' }),
  )
  if (!res.ok) throw new Error(`Could not load ${file} (HTTP ${res.status})`)
  try {
    return await res.json()
  } catch {
    throw new Error(`${file} is not valid JSON. Check for a missing comma or quote.`)
  }
}

export function enrichProduct(p, categoriesById) {
  const { percent, savings } = getDiscount(p.mrp, p.price)
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    inStock: p.inStock !== false,
    rating: Number(p.rating) || 0,
    discountPercent: percent,
    savings,
    categoryName: categoriesById[p.category]?.name || p.category,
  }
}

async function loadAll() {
  const [site, categories, products] = await Promise.all([
    fetchJSON('site.json'),
    fetchJSON('categories.json'),
    fetchJSON('products.json'),
  ])
  const sortedCategories = [...(categories || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  const categoriesById = Object.fromEntries(sortedCategories.map((c) => [c.id, c]))
  const enriched = (products || []).map((p) => enrichProduct(p, categoriesById))
  const productsById = Object.fromEntries(enriched.map((p) => [p.id, p]))
  return {
    site: site || {},
    categories: sortedCategories,
    categoriesById,
    products: enriched,
    productsById,
  }
}

/** Returns the cached catalog promise; call with force=true to retry after an error. */
export function loadCatalog(force = false) {
  if (!catalogPromise || force) {
    catalogPromise = loadAll().catch((err) => {
      catalogPromise = null
      throw err
    })
  }
  return catalogPromise
}

/* ---------- Selectors ---------- */

export const byDiscount = (a, b) => b.discountPercent - a.discountPercent || b.savings - a.savings
export const byNewest = (a, b) => String(b.dateAdded || '').localeCompare(String(a.dateAdded || ''))
export const byFeatured = (a, b) =>
  Number(b.featured) - Number(a.featured) || Number(b.inStock) - Number(a.inStock) || b.rating - a.rating

export function withTag(products, tag) {
  return products.filter((p) => p.tags.includes(tag))
}

/** Unique subcategories for a category (or all products), in first-seen order. */
export function getSubcategories(products, categoryId) {
  const set = new Set()
  products.forEach((p) => {
    if ((!categoryId || p.category === categoryId) && p.subcategory) set.add(p.subcategory)
  })
  return [...set]
}

/** Product counts per category id. */
export function countByCategory(products) {
  return products.reduce((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {})
}
