import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../lib/utils'

export const EnquiryContext = createContext(null)

const ITEMS_KEY = 'bf_enquiry_v1'
const CUSTOMER_KEY = 'bf_customer_v1'
const MAX_QTY = 99

const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number(q) || 1)))
/** One line per product + size + colour, e.g. "bf-0001|UK 9|Black". */
export const lineKey = (id, size = '', color = '') => [id, size || '', color || ''].join('|')

function normalize(saved) {
  if (!Array.isArray(saved)) return []
  return saved
    .filter((i) => i && i.id)
    .map((i) => ({ key: lineKey(i.id, i.size, i.color), id: i.id, qty: clampQty(i.qty), size: i.size || '', color: i.color || '' }))
}

/**
 * The enquiry list works like a cart. Only { id, qty, size, color } is stored,
 * so prices always come from the latest products.json.
 */
export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(() => normalize(readStorage(ITEMS_KEY, [])))
  const [customer, setCustomer] = useState(() => readStorage(CUSTOMER_KEY, { name: '', location: '', notes: '' }))

  useEffect(() => writeStorage(ITEMS_KEY, items), [items])
  useEffect(() => writeStorage(CUSTOMER_KEY, customer), [customer])

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ITEMS_KEY) setItems(normalize(readStorage(ITEMS_KEY, [])))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /** add(id, qty, { size, color }) */
  const add = useCallback((id, qty = 1, options = {}) => {
    const size = options.size || ''
    const color = options.color || ''
    const key = lineKey(id, size, color)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: clampQty(i.qty + qty) } : i))
      return [...prev, { key, id, qty: clampQty(qty), size, color }]
    })
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: clampQty(qty) } : i)))
  }, [])

  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])
  const updateCustomer = useCallback((patch) => setCustomer((c) => ({ ...c, ...patch })), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      has: (id) => items.some((i) => i.id === id),
      qtyOf: (id) => items.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      customer,
      updateCustomer,
      maxQty: MAX_QTY,
    }),
    [items, add, setQty, remove, clear, customer, updateCustomer],
  )

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}
