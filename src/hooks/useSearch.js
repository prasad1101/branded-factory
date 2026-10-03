import { useMemo } from 'react'
import { useProducts } from './useData'
import { createProductIndex, searchProducts } from '../lib/search'

/** Builds the Fuse index once per catalog and returns a search function. */
export function useProductSearch() {
  const { products } = useProducts()
  const index = useMemo(() => (products.length ? createProductIndex(products) : null), [products])
  return useMemo(() => (q) => searchProducts(index, q), [index])
}
