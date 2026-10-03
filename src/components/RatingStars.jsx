import { useId } from 'react'
import { cn } from '../lib/utils'

// Five 24×24 star outlines side by side in one path (keeps the DOM small on product-heavy pages)
const STAR = [12, 2, 15.09, 8.26, 22, 9.27, 17, 14.14, 18.18, 21.02, 12, 17.77, 5.82, 21.02, 7, 14.14, 2, 9.27, 8.91, 8.26]
const PATH = [0, 1, 2, 3, 4]
  .map((i) => 'M' + STAR.map((v, j) => (j % 2 === 0 ? v + i * 24 : v)).join(' ').replace(/(\S+ \S+) /g, '$1 L') + 'Z')
  .join('')

export default function RatingStars({ rating = 0, className = '', showValue = true, size = 'sm' }) {
  const id = useId()
  if (!rating) return null
  const pct = `${(Math.max(0, Math.min(5, rating)) / 5) * 100}%`
  return (
    <div className={cn('flex items-center gap-1', className)} role="img" aria-label={`Rated ${rating} out of 5`}>
      <svg viewBox="0 0 120 24" className={size === 'lg' ? 'h-4 w-20' : 'h-3.5 w-[4.375rem]'} aria-hidden="true">
        <defs>
          <linearGradient id={id}>
            <stop offset={pct} stopColor="#C9A24B" />
            <stop offset={pct} stopColor="#EBD9A6" />
          </linearGradient>
        </defs>
        <path d={PATH} fill={`url(#${id})`} />
      </svg>
      {showValue && <span className={cn('font-semibold text-ink-muted', size === 'lg' ? 'text-sm' : 'text-xs')}>{rating.toFixed(1)}</span>}
    </div>
  )
}
