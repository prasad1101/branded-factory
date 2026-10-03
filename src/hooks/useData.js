import { useContext } from 'react'
import { DataContext } from '../context/DataContext'

/** Full catalog: { status, error, retry, site, categories, categoriesById, products, productsById } */
export function useCatalog() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useCatalog must be used inside <DataProvider>')
  return ctx
}

export function useSite() {
  const { site, status } = useCatalog()
  return { site, loading: status === 'loading' }
}

export function useCategories() {
  const { categories, categoriesById, status } = useCatalog()
  return { categories, categoriesById, loading: status === 'loading' }
}

export function useProducts() {
  const { products, productsById, status } = useCatalog()
  return { products, productsById, loading: status === 'loading' }
}

export function useProduct(id) {
  const { productsById, status } = useCatalog()
  return { product: productsById[id] || null, loading: status === 'loading' }
}
