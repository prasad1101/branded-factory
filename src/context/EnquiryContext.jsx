import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../lib/utils'

export const EnquiryContext = createContext(null)

const ITEMS_KEY = 'bf_enquiry_v1'
const CUSTOMER_KEY = 'bf_customer_v1'
const MAX_QTY = 99

const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number(q) || 1)))

/**
 * The enquiry list works like a cart. Only { id, qty } is stored, so prices
 * always come from the latest products.json.
 */
export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = readStorage(ITEMS_KEY, [])
    return Array.isArray(saved) ? saved.filter((i) => i && i.id).map((i) => ({ id: i.id, qty: clampQty(i.qty) })) : []
  })
  const [customer, setCustomer] = useState(() => readStorage(CUSTOMER_KEY, { name: '', location: '', notes: '' }))

  useEffect(() => writeStorage(ITEMS_KEY, items), [items])
  useEffect(() => writeStorage(CUSTOMER_KEY, customer), [customer])

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ITEMS_KEY) setItems(readStorage(ITEMS_KEY, []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: clampQty(i.qty + qty) } : i))
      return [...prev, { id, qty: clampQty(qty) }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: clampQty(qty) } : i)))
  }, [])

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])
  const updateCustomer = useCallback((patch) => setCustomer((c) => ({ ...c, ...patch })), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      has: (id) => items.some((i) => i.id === id),
      qtyOf: (id) => items.find((i) => i.id === id)?.qty || 0,
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
