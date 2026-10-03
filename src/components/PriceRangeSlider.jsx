import { useEffect, useRef, useState } from 'react'
import { formatINR } from '../lib/utils'

/** Dual-thumb price slider built from two native range inputs (keyboard accessible). */
export default function PriceRangeSlider({ min, max, valueMin, valueMax, onChange, step = 10 }) {
  const [lo, setLo] = useState(valueMin ?? min)
  const [hi, setHi] = useState(valueMax ?? max)
  const timer = useRef()

  useEffect(() => {
    setLo(valueMin ?? min)
    setHi(valueMax ?? max)
  }, [valueMin, valueMax, min, max])

  const commit = (nextLo, nextHi) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      onChange(nextLo <= min ? null : nextLo, nextHi >= max ? null : nextHi)
    }, 250)
  }

  if (max <= min) return null
  const pct = (v) => ((v - min) / (max - min)) * 100
  const thumb =
    'pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-navy focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-gold-500/40'

  return (
    <div>
      <div className="relative mx-2 h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cream-300" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold-500" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum price"
          aria-valuetext={formatINR(lo)}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - step)
            setLo(v)
            commit(v, hi)
          }}
          className={thumb}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum price"
          aria-valuetext={formatINR(hi)}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + step)
            setHi(v)
            commit(lo, v)
          }}
          className={thumb}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-navy">
        <span className="rounded-lg bg-cream-100 px-2.5 py-1">{formatINR(lo)}</span>
        <span className="text-ink-muted" aria-hidden="true">to</span>
        <span className="rounded-lg bg-cream-100 px-2.5 py-1">{formatINR(hi)}</span>
      </div>
    </div>
  )
}
