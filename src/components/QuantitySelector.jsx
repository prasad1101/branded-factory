import { Minus, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', label = 'Quantity', className = '' }) {
  const sm = size === 'sm'
  const btn = cn(
    'flex items-center justify-center rounded-full text-navy transition hover:bg-cream-200 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent',
    sm ? 'h-8 w-8' : 'h-11 w-11',
  )
  return (
    <div className={cn('inline-flex items-center rounded-full border border-navy/15 bg-white', sm ? 'p-0.5' : 'p-1', className)} role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className={sm ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10)
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
        }}
        className={cn(
          'border-0 bg-transparent text-center font-semibold text-navy [appearance:textfield] focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          sm ? 'w-8 text-sm' : 'w-10 text-base',
        )}
        aria-label={label}
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus className={sm ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
    </div>
  )
}
