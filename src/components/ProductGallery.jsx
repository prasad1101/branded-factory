import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import SmartImage, { ImagePlaceholder } from './SmartImage'
import DiscountBadge from './DiscountBadge'
import { assetUrl, cn } from '../lib/utils'

/** Hover-to-zoom image (desktop pointer devices only). */
function ZoomImage({ src, alt, eager }) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [failed, setFailed] = useState(false)
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])
  if (!src || failed) return <ImagePlaceholder label={alt} />
  return (
    <div
      className="h-full w-full overflow-hidden md:cursor-zoom-in"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom(true)}
      onPointerLeave={() => setZoom(false)}
      onPointerMove={(e) => e.pointerType === 'mouse' && onMove(e)}
    >
      <img
        src={assetUrl(src)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-200 ease-out"
        style={{ transform: zoom ? 'scale(2)' : 'scale(1)', transformOrigin: origin }}
      />
    </div>
  )
}

export default function ProductGallery({ images = [], name, discount }) {
  const list = images.length ? images : [null]
  const [ref, api] = useEmblaCarousel({ loop: false })
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on('select', onSelect).on('reInit', onSelect)
    return () => api.off('select', onSelect).off('reInit', onSelect)
  }, [api])

  useEffect(() => {
    api?.reInit()
    api?.scrollTo(0, true)
  }, [api, images])

  return (
    <div className="md:flex md:flex-row-reverse md:gap-4">
      <div className="relative flex-1">
        <div ref={ref} className="overflow-hidden rounded-3xl bg-cream-100 shadow-soft" aria-roledescription="carousel" aria-label={`${name} images`}>
          <div className="flex touch-pan-y">
            {list.map((src, i) => (
              <div key={i} className="relative aspect-square min-w-0 flex-[0_0_100%]" aria-roledescription="slide" aria-label={`Image ${i + 1} of ${list.length}`}>
                <ZoomImage src={src} alt={i === 0 ? name : `${name}, view ${i + 1}`} eager={i === 0} />
              </div>
            ))}
          </div>
        </div>
        {discount > 0 && <DiscountBadge percent={discount} size="lg" className="pointer-events-none absolute left-4 top-4 shadow-md" />}
        {list.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden" aria-hidden="true">
            {list.map((_, i) => (
              <span key={i} className={cn('h-1.5 rounded-full transition-all', selected === i ? 'w-6 bg-navy' : 'w-1.5 bg-navy/25')} />
            ))}
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 md:mt-0 md:w-20 md:flex-col" role="tablist" aria-label="Choose image">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Show image ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'aspect-square w-16 overflow-hidden rounded-xl bg-cream-100 ring-2 transition md:w-full',
                selected === i ? 'ring-navy' : 'ring-transparent opacity-70 hover:opacity-100',
              )}
            >
              <SmartImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
