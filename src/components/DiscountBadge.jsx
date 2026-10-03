import { cn } from '../lib/utils'

/** "45% OFF" badge. Percent is always computed from mrp/price upstream. */
export default function DiscountBadge({ percent, size = 'sm', className = '' }) {
  if (!percent || percent <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-coral-600 font-bold uppercase tracking-wide text-white',
        size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-[11px]',
        className,
      )}
    >
      {percent}% off
    </span>
  )
}
