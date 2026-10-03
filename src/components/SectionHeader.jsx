import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'
import Reveal from './Reveal'

export default function SectionHeader({ eyebrow, title, subtitle, to, linkText = 'View all', light = false, center = false, children, className = '' }) {
  return (
    <Reveal className={cn('mb-6 flex flex-wrap items-end gap-4 sm:mb-8', center ? 'flex-col items-center text-center' : 'justify-between', className)}>
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {eyebrow && <p className={cn('eyebrow', light && 'text-gold-300')}>{eyebrow}</p>}
        <h2 className={cn('mt-2 text-balance text-[1.75rem] font-semibold sm:text-4xl', light && 'text-white')}>{title}</h2>
        {subtitle && <p className={cn('mt-2 text-sm sm:text-base', light ? 'text-white/70' : 'text-ink-muted')}>{subtitle}</p>}
      </div>
      {children}
      {to && (
        <Link
          to={to}
          className={cn(
            'group inline-flex items-center gap-1.5 text-sm font-semibold',
            light ? 'text-gold-300 hover:text-gold-200' : 'text-navy hover:text-gold-700',
          )}
        >
          {linkText} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </Reveal>
  )
}
