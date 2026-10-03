import { useEffect, useMemo, useState } from 'react'
import { useProducts } from './useData'
import { createProductIndex, loadFuse, searchProducts } from '../lib/search'

/**
 * Returns a search function backed by a Fuse index (built once per catalog).
 * Pass `enabled = false` to postpone loading Fuse.js until the user starts searching.
 */
export function useProductSearch(enabled = true) {
  const { products } = useProducts()
  const [Fuse, setFuse] = useState(null)

  useEffect(() => {
    if (!enabled || Fuse) return
    let alive = true
    loadFuse().then((F) => alive && setFuse(() => F))
    return () => {
      alive = false
    }
  }, [enabled, Fuse])

  const index = useMemo(() => (Fuse && products.length ? createProductIndex(Fuse, products) : null), [Fuse, products])
  const search = useMemo(() => (q) => searchProducts(index, q), [index])
  return { search, ready: Boolean(index) }
}
