import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { ProductCardSkeleton } from './Skeleton'
import { cn } from '../lib/utils'

export function CarouselArrows({ api, light = false, className = '' }) {
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  useEffect(() => {
    if (!api) return
    const update = () => {
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }
    update()
    api.on('select', update).on('reInit', update).on('scroll', update)
    return () => api.off('select', update).off('reInit', update).off('scroll', update)
  }, [api])
  if (!canPrev && !canNext) return null
  const btn = cn(
    'flex h-10 w-10 items-center justify-center rounded-full border transition disabled:opacity-30',
    light ? 'border-white/20 text-white hover:bg-white/10' : 'border-navy/15 bg-white text-navy hover:border-navy/40',
  )
  return (
    <div className={cn('hidden gap-2 sm:flex', className)}>
      <button type="button" className={btn} onClick={() => api.scrollPrev()} disabled={!canPrev} aria-label="Previous products">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" className={btn} onClick={() => api.scrollNext()} disabled={!canNext} aria-label="Next products">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

/** Horizontally scrolling product row (drag/swipe on mobile, arrows on desktop). */
export default function ProductCarousel({ products, loading = false, light = false, header = null, label = 'Products' }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps', slidesToScroll: 'auto' })
  const onKey = useCallback(
    (e) => {
      if (e.key === 'ArrowRight') api?.scrollNext()
      if (e.key === 'ArrowLeft') api?.scrollPrev()
    },
    [api],
  )
  const items = loading ? Array.from({ length: 5 }) : products
  if (!loading && !products?.length) return null
  return (
    <div>
      {header && (
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">{header}</div>
          <CarouselArrows api={api} light={light} className="mb-6 sm:mb-8" />
        </div>
      )}
      <div className="-mx-4 overflow-hidden px-4 py-2 sm:mx-0 sm:px-0" ref={ref} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKey}>
        <div className="-ml-3 flex touch-pan-y sm:-ml-5">
          {items.map((p, i) => (
            <div key={p?.id || i} className="min-w-0 flex-[0_0_47%] pl-3 sm:flex-[0_0_33.333%] sm:pl-5 lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
              {loading ? <ProductCardSkeleton /> : <ProductCard product={p} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
