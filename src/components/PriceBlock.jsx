import { useSite } from '../hooks/useData'
import { cn, formatINR, getDiscount } from '../lib/utils'
import DiscountBadge from './DiscountBadge'

/**
 * Price + struck-through MRP + discount badge + "You save" line.
 * Savings are always derived from mrp and price.
 */
export default function PriceBlock({ mrp, price, size = 'sm', qty = 1, showSave = true, className = '' }) {
  const { site } = useSite()
  const cur = site.currency || '₹'
  const { percent, savings } = getDiscount(mrp, price)
  const lg = size === 'lg'
  return (
    <div className={className}>
      <div className={cn('flex flex-wrap items-baseline', lg ? 'gap-x-3 gap-y-2' : 'gap-x-2 gap-y-1')}>
        <span className={cn('font-bold text-navy', lg ? 'font-serif text-4xl' : 'text-base sm:text-lg')}>{formatINR(price * qty, cur)}</span>
        {percent > 0 && (
          <span className={cn('text-ink-muted line-through decoration-coral-600/60', lg ? 'text-lg' : 'text-xs sm:text-sm')}>
            <span className="sr-only">MRP </span>
            {formatINR(mrp * qty, cur)}
          </span>
        )}
        {lg && <DiscountBadge percent={percent} size="lg" className="self-center" />}
      </div>
      {showSave && savings > 0 && (
        <p className={cn('font-semibold text-save', lg ? 'mt-2 text-base' : 'mt-0.5 text-xs')}>
          You save {formatINR(savings * qty, cur)}
          {lg && <span className="font-normal text-ink-muted"> (inclusive of all taxes)</span>}
        </p>
      )}
    </div>
  )
}
