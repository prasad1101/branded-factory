import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Breadcrumbs({ items, light = false, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1 text-xs font-medium', light ? 'text-white/70' : 'text-ink-muted')}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className={cn('hover:underline', light ? 'hover:text-white' : 'hover:text-navy')}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className={cn('line-clamp-1', light ? 'text-white' : 'text-navy')}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
