import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import PriceRangeSlider from './PriceRangeSlider'
import { DISCOUNT_BANDS } from '../hooks/useFilters'
import { cn } from '../lib/utils'

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-navy/5 py-5 first:pt-0 last:border-0">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left" aria-expanded={open}>
        <span className="text-sm font-bold uppercase tracking-wider text-navy">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-ink-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-1',
          checked ? 'border-navy bg-navy text-white' : 'border-navy/25 bg-white group-hover:border-navy/50',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className={cn('flex-1', checked ? 'font-semibold text-navy' : 'text-ink')}>{label}</span>
      <span className="text-xs text-ink-muted">{count}</span>
    </label>
  )
}

export default function FilterPanel({ filters, facets, update, toggle, showSubcategories = true, showCategories = false }) {
  const [showAllBrands, setShowAllBrands] = useState(false)
  const brands = showAllBrands ? facets.brands : facets.brands.slice(0, 8)

  return (
    <div>
      <Section title="Discount">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Minimum discount">
          {DISCOUNT_BANDS.map((d) => {
            const active = filters.disc === d
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update({ disc: active ? null : d })}
                className={cn('chip', active && 'chip-active')}
              >
                {d}%+ off
              </button>
            )
          })}
        </div>
      </Section>

      {showCategories && facets.categories.length > 1 && (
        <Section title="Category">
          {facets.categories.map(([id, count, name]) => (
            <CheckRow key={id} label={name} count={count} checked={filters.cat.includes(id)} onChange={() => toggle('cat', id)} />
          ))}
        </Section>
      )}

      {showSubcategories && facets.subcategories.length > 1 && (
        <Section title="Type">
          {facets.subcategories.map(([name, count]) => (
            <CheckRow key={name} label={name} count={count} checked={filters.sub.includes(name)} onChange={() => toggle('sub', name)} />
          ))}
        </Section>
      )}

      {facets.brands.length > 1 && (
        <Section title="Brand">
          {brands.map(([name, count]) => (
            <CheckRow key={name} label={name} count={count} checked={filters.brand.includes(name)} onChange={() => toggle('brand', name)} />
          ))}
          {facets.brands.length > 8 && (
            <button type="button" onClick={() => setShowAllBrands((s) => !s)} className="mt-2 text-sm font-semibold text-gold-700 hover:underline">
              {showAllBrands ? 'Show fewer' : `Show all ${facets.brands.length} brands`}
            </button>
          )}
        </Section>
      )}

      {facets.priceMax > facets.priceMin && (
        <Section title="Price">
          <PriceRangeSlider
            min={facets.priceMin}
            max={facets.priceMax}
            valueMin={filters.min}
            valueMax={filters.max}
            onChange={(min, max) => update({ min, max })}
          />
        </Section>
      )}

      <Section title="Availability">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
          <span className="text-ink">In stock only</span>
          <input type="checkbox" className="peer sr-only" checked={filters.stock} onChange={(e) => update({ stock: e.target.checked })} />
          <span
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2',
              filters.stock ? 'bg-save' : 'bg-navy/20',
            )}
            aria-hidden="true"
          >
            <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', filters.stock ? 'translate-x-[22px]' : 'translate-x-0.5')} />
          </span>
        </label>
      </Section>
    </div>
  )
}
