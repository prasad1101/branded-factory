import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { useCategories } from '../../hooks/useData'
import { useProductSearch } from '../../hooks/useSearch'
import SmartImage from '../SmartImage'
import { cn, formatINR } from '../../lib/utils'

/** Search input with live product + category suggestions and keyboard navigation. */
export default function SearchBar({ className = '', autoFocus = false, initialQuery = '', onNavigate, large = false }) {
  const [query, setQuery] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [engaged, setEngaged] = useState(Boolean(initialQuery))
  const { search } = useProductSearch(engaged)
  const { categories } = useCategories()
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const listId = useId()

  useEffect(() => setQuery(initialQuery), [initialQuery])

  const q = query.trim()
  const products = useMemo(() => (q.length >= 2 ? search(q).slice(0, 6) : []), [q, search])
  const cats = useMemo(
    () => (q.length >= 2 ? categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 3) : []),
    [q, categories],
  )
  const options = [
    ...cats.map((c) => ({ type: 'category', key: `c-${c.id}`, to: `/category/${c.id}`, item: c })),
    ...products.map((p) => ({ type: 'product', key: `p-${p.id}`, to: `/product/${p.id}`, item: p })),
    ...(q ? [{ type: 'all', key: 'all', to: `/search?q=${encodeURIComponent(q)}` }] : []),
  ]
  const showPanel = open && q.length >= 2

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  useEffect(() => setActive(-1), [q])

  const go = (to) => {
    setOpen(false)
    inputRef.current?.blur()
    navigate(to)
    onNavigate?.()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(-1, i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (active >= 0 && options[active]) return go(options[active].to)
    if (q) go(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <form role="search" onSubmit={onSubmit} className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products and brands
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setEngaged(true)
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            setEngaged(true)
            setOpen(true)
          }}
          onPointerEnter={() => setEngaged(true)}
          onKeyDown={onKeyDown}
          placeholder="Search serums, basmati, perfumes…"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className={cn(
            'w-full rounded-full border border-navy/10 bg-white pl-11 pr-10 text-sm text-ink shadow-soft transition placeholder:text-ink-muted/80 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/25 [&::-webkit-search-cancel-button]:hidden',
            large ? 'h-14 text-base' : 'h-11',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-muted hover:bg-cream-200 hover:text-navy"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showPanel && (
          <m.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-auto rounded-2xl border border-navy/5 bg-white p-2 shadow-lift"
          >
            {options.length === 1 && (
              <li className="px-3 py-4 text-sm text-ink-muted">No matches for “{q}”. Try a brand or category name.</li>
            )}
            {options.map((opt, i) => (
              <li key={opt.key} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
                <Link
                  to={opt.to}
                  onClick={(e) => {
                    e.preventDefault()
                    go(opt.to)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors', active === i && 'bg-cream-100')}
                >
                  {opt.type === 'product' && (
                    <>
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                        <SmartImage src={opt.item.images[0]} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-navy">{opt.item.name}</span>
                        <span className="block text-xs text-ink-muted">{opt.item.brand}</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-semibold text-navy">{formatINR(opt.item.price)}</span>
                        {opt.item.discountPercent > 0 && (
                          <span className="block text-xs font-semibold text-coral-600">{opt.item.discountPercent}% off</span>
                        )}
                      </span>
                    </>
                  )}
                  {opt.type === 'category' && (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-100">
                        <SmartImage src={opt.item.image} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-medium text-navy">{opt.item.name}</span>
                        <span className="block text-xs text-ink-muted">Category</span>
                      </span>
                    </>
                  )}
                  {opt.type === 'all' && (
                    <span className="flex w-full items-center justify-between font-semibold text-navy">
                      See all results for “{q}” <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
