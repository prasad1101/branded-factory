import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { Check, Plus, X } from 'lucide-react'
import SmartImage from './SmartImage'
import PriceBlock from './PriceBlock'
import RatingStars from './RatingStars'
import { ColorDots, ColorSwatches, SizeSelector, needsOptions } from './VariantPicker'
import { useAddToList, useEnquiry } from '../hooks/useEnquiry'
import { cn } from '../lib/utils'

/** Quick size/colour picker that slides up over the card. */
function QuickPick({ product, onDone, onClose }) {
  const sizes = product.sizes || []
  const colors = product.colors || []
  const [color, setColor] = useState(colors[0]?.name || '')
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : '')
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.querySelector('button')?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const ready = !sizes.length || size
  return (
    <m.div
      ref={ref}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className="absolute inset-x-0 bottom-0 z-20 rounded-2xl border-t border-navy/5 bg-white p-3 shadow-lift"
      role="dialog"
      aria-label={`Choose options for ${product.name}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-navy">{sizes.length ? 'Select size' : 'Select colour'}</p>
        <button type="button" onClick={onClose} className="-mr-1 rounded-full p-1 text-ink-muted hover:bg-cream-100" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      {colors.length > 1 && (
        <div className="mb-2.5">
          <ColorSwatches colors={colors} value={color} onChange={setColor} size="sm" showLabel={false} />
        </div>
      )}
      <SizeSelector sizes={sizes} unavailable={product.unavailableSizes || []} value={size} onChange={setSize} size="sm" showLabel={false} />
      <button
        type="button"
        disabled={!ready}
        onClick={() => onDone({ size, color })}
        className="btn-primary mt-3 w-full py-2.5 text-xs disabled:opacity-40"
      >
        {ready ? 'Add to list' : 'Choose a size'}
      </button>
    </m.div>
  )
}

export default function ProductCard({ product, className = '', eager = false }) {
  const addToList = useAddToList()
  const { has } = useEnquiry()
  const [picking, setPicking] = useState(false)
  const inList = has(product.id)
  const [img1, img2] = product.images
  const to = `/product/${product.id}`
  const withOptions = needsOptions(product)
  const sizeCount = product.sizes?.length || 0

  const onAdd = () => {
    if (withOptions) return setPicking(true)
    addToList(product, 1, { size: product.sizes?.[0] || '', color: product.colors?.[0]?.name || '' })
  }

  return (
    <m.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-2.5 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:p-3',
        className,
      )}
    >
      <Link to={to} className="relative block aspect-square overflow-hidden rounded-xl bg-cream-100" tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={img1}
          alt={product.name}
          eager={eager}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {img2 && (
          <SmartImage
            src={img2}
            alt=""
            className="absolute inset-0 hidden h-full w-full object-cover !opacity-0 transition-opacity duration-500 group-hover:!opacity-100 md:block"
          />
        )}
        {product.discountPercent > 0 && (
          <span className="absolute left-0 top-3 rounded-r-full bg-coral-600 py-1 pl-2.5 pr-3 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-md sm:text-xs">
            {product.discountPercent}% off
          </span>
        )}
        {product.tags.includes('bestseller') && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700 backdrop-blur">
            Bestseller
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-navy/80 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-700">{product.brand}</p>
        <h3 className="mt-1 font-sans text-sm font-semibold leading-snug text-navy">
          <Link to={to} className="line-clamp-2 after:absolute after:inset-0 after:content-[''] focus-visible:underline">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
          <ColorDots colors={product.colors || []} />
          {sizeCount > 1 ? <span>{sizeCount} sizes</span> : product.size && <span>{product.size}</span>}
          {product.rating > 0 && <RatingStars rating={product.rating} showValue={false} />}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <PriceBlock mrp={product.mrp} price={product.price} />
          {product.inStock && (
            <m.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={onAdd}
              aria-label={withOptions ? `Choose size and add ${product.name}` : inList ? `Add another ${product.name} to enquiry list` : `Add ${product.name} to enquiry list`}
              aria-haspopup={withOptions ? 'dialog' : undefined}
              className={cn(
                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-soft transition-colors duration-200',
                inList ? 'bg-save text-white' : 'bg-navy text-white hover:bg-gold-500 hover:text-navy',
              )}
            >
              {inList ? <Check className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
            </m.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {picking && (
          <QuickPick
            product={product}
            onClose={() => setPicking(false)}
            onDone={(opts) => {
              addToList(product, 1, opts)
              setPicking(false)
            }}
          />
        )}
      </AnimatePresence>
    </m.article>
  )
}
