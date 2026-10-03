import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

export default function Logo({ light = false, compact = false, className = '' }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-serif text-base font-bold transition-transform duration-300 group-hover:rotate-[-4deg]',
          light ? 'bg-gold-500 text-navy' : 'bg-navy text-gold-400',
        )}
        aria-hidden="true"
      >
        BF
        <span className={cn('absolute inset-[3px] rounded-[9px] border', light ? 'border-navy/20' : 'border-gold-500/40')} />
      </span>
      {compact && <span className="sr-only">Branded Factory home</span>}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-serif text-lg font-semibold tracking-tight sm:text-xl', light ? 'text-white' : 'text-navy')}>
            Branded Factory
          </span>
          <span className={cn('mt-1 text-[9px] font-bold uppercase tracking-[0.28em]', light ? 'text-gold-300' : 'text-gold-700')}>
            Assured Savings
          </span>
        </span>
      )}
    </Link>
  )
}
