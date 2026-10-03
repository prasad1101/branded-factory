/**
 * Fuzzy search across name, brand, category, subcategory and tags.
 * Fuse.js is loaded on demand (first search) to keep the initial bundle small.
 */
const OPTIONS = {
  keys: [
    { name: 'name', weight: 0.45 },
    { name: 'brand', weight: 0.25 },
    { name: 'categoryName', weight: 0.12 },
    { name: 'subcategory', weight: 0.1 },
    { name: 'tags', weight: 0.08 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

let fusePromise = null
export function loadFuse() {
  fusePromise ??= import('fuse.js').then((m) => m.default)
  return fusePromise
}

export function createProductIndex(Fuse, products) {
  return new Fuse(products, OPTIONS)
}

export function searchProducts(index, query) {
  const q = String(query || '').trim()
  if (!q || !index) return []
  return index.search(q).map((r) => r.item)
}
