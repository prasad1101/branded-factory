import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

export default function RatingStars({ rating = 0, className = '', showValue = true, size = 'sm' }) {
  if (!rating) return null
  const s = size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rated ${rating} out of 5`} role="img">
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)))
          return (
            <span key={i} className={cn('relative', s)}>
              <Star className={cn('absolute inset-0 text-gold-200', s)} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn('text-gold-500', s)} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          )
        })}
      </div>
      {showValue && <span className={cn('font-semibold text-ink-muted', size === 'lg' ? 'text-sm' : 'text-xs')}>{rating.toFixed(1)}</span>}
    </div>
  )
}
