import { createContext, useCallback, useEffect, useState } from 'react'
import { loadCatalog } from '../lib/data'

export const DataContext = createContext(null)

const EMPTY = { site: {}, categories: [], categoriesById: {}, products: [], productsById: {} }

export function DataProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', error: null, ...EMPTY })

  const load = useCallback((force = false) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    loadCatalog(force)
      .then((data) => setState({ status: 'ready', error: null, ...data }))
      .catch((error) => setState({ status: 'error', error, ...EMPTY }))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const retry = useCallback(() => load(true), [load])

  return <DataContext.Provider value={{ ...state, retry }}>{children}</DataContext.Provider>
}
