import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

/** Colour swatches (radio group). colors: [{ name, hex }] */
export function ColorSwatches({ colors = [], value, onChange, size = 'md', showLabel = true, idPrefix = 'color' }) {
  if (!colors.length) return null
  const sm = size === 'sm'
  return (
    <div>
      {showLabel && (
        <p id={`${idPrefix}-label`} className="mb-2 text-sm text-ink-muted">
          Colour: <span className="font-semibold text-navy">{value || 'Select'}</span>
        </p>
      )}
      <div role="radiogroup" aria-labelledby={showLabel ? `${idPrefix}-label` : undefined} aria-label={showLabel ? undefined : 'Colour'} className="flex flex-wrap gap-2">
        {colors.map((c) => {
          const active = value === c.name
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={c.name}
              title={c.name}
              onClick={() => onChange(c.name)}
              className={cn(
                'relative flex items-center justify-center rounded-full ring-offset-2 ring-offset-white transition',
                sm ? 'h-7 w-7' : 'h-10 w-10',
                active ? 'ring-2 ring-navy' : 'ring-1 ring-navy/15 hover:ring-navy/40',
              )}
            >
              <span className="h-full w-full rounded-full border border-black/10" style={{ backgroundColor: c.hex || '#ccc' }} />
              {active && <Check className={cn('absolute drop-shadow', sm ? 'h-3.5 w-3.5' : 'h-4 w-4', isLightHex(c.hex) ? 'text-navy' : 'text-white')} strokeWidth={3} aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Size chips (radio group). Sizes listed in `unavailable` are shown struck through and disabled. */
export function SizeSelector({ sizes = [], unavailable = [], value, onChange, error, size = 'md', showLabel = true, idPrefix = 'size', hint }) {
  if (!sizes.length) return null
  const sm = size === 'sm'
  return (
    <div>
      {showLabel && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p id={`${idPrefix}-label`} className="text-sm text-ink-muted">
            Size: <span className="font-semibold text-navy">{value || 'Select a size'}</span>
          </p>
          {hint && <p className="text-xs text-ink-muted">{hint}</p>}
        </div>
      )}
      <div
        role="radiogroup"
        aria-labelledby={showLabel ? `${idPrefix}-label` : undefined}
        aria-label={showLabel ? undefined : 'Size'}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${idPrefix}-error` : undefined}
        className="flex flex-wrap gap-2"
      >
        {sizes.map((s) => {
          const active = value === s
          const off = unavailable.includes(s)
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={off ? `${s}, sold out` : s}
              disabled={off}
              onClick={() => onChange(s)}
              className={cn(
                'rounded-xl border font-semibold transition',
                sm ? 'min-w-10 px-2.5 py-1.5 text-xs' : 'min-w-14 px-3.5 py-2.5 text-sm',
                active
                  ? 'border-navy bg-navy text-white'
                  : off
                    ? 'cursor-not-allowed border-navy/10 bg-cream-100 text-ink-muted/60 line-through'
                    : error
                      ? 'border-coral-600/50 bg-white text-navy hover:border-navy'
                      : 'border-navy/15 bg-white text-navy hover:border-navy',
              )}
            >
              {s}
            </button>
          )
        })}
      </div>
      {error && (
        <p id={`${idPrefix}-error`} role="alert" className="mt-2 text-sm font-semibold text-coral-600">
          {error}
        </p>
      )}
    </div>
  )
}

function isLightHex(hex = '') {
  const m = hex.match(/^#?([0-9a-f]{6})$/i)
  if (!m) return false
  const n = parseInt(m[1], 16)
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 185
}

/** Small read-only colour dots for product cards. */
export function ColorDots({ colors = [], max = 4 }) {
  if (colors.length < 2) return null
  return (
    <span className="flex items-center gap-1" aria-label={`${colors.length} colours`}>
      {colors.slice(0, max).map((c) => (
        <span key={c.name} className="h-3 w-3 rounded-full border border-black/15" style={{ backgroundColor: c.hex }} title={c.name} />
      ))}
      {colors.length > max && <span className="text-[10px] font-semibold text-ink-muted">+{colors.length - max}</span>}
    </span>
  )
}

/** Whether a product needs the customer to choose options before adding. */
export function needsOptions(product) {
  return (product.sizes?.length || 0) > 1 || (product.colors?.length || 0) > 1
}
