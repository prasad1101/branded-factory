import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../lib/utils'

const KEY = 'bf_recent_v1'
const MAX = 12

/** Recently viewed product ids, newest first, stored in localStorage. */
export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => {
    const v = readStorage(KEY, [])
    return Array.isArray(v) ? v : []
  })

  const track = useCallback((id) => {
    if (!id) return
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX)
      writeStorage(KEY, next)
      return next
    })
  }, [])

  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setIds(readStorage(KEY, []))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { ids, track }
}
