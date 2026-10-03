import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from './SmartImage'
import { cn } from '../lib/utils'

export default function CategoryCard({ category, count, maxDiscount, className = '' }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className={cn('group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift', className)}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <SmartImage src={category.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {maxDiscount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-navy/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur sm:text-[11px]">
            Up to {maxDiscount}% off
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 p-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="font-serif text-[15px] font-semibold leading-tight text-navy sm:text-lg">{category.name}</h3>
          {typeof count === 'number' && <p className="mt-0.5 text-xs text-ink-muted">{count} products</p>}
        </div>
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-navy transition-colors group-hover:bg-gold-500 sm:flex lg:hidden" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
