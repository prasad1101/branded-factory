import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import SmartImage from './SmartImage'
import PriceBlock from './PriceBlock'
import RatingStars from './RatingStars'
import { useAddToList, useEnquiry } from '../hooks/useEnquiry'
import { cn } from '../lib/utils'

export default function ProductCard({ product, className = '', eager = false }) {
  const addToList = useAddToList()
  const { has } = useEnquiry()
  const inList = has(product.id)
  const [img1, img2] = product.images
  const to = `/product/${product.id}`

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
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
          {product.size && <span>{product.size}</span>}
          {product.size && product.rating > 0 && <span aria-hidden="true">·</span>}
          <RatingStars rating={product.rating} showValue={false} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <PriceBlock mrp={product.mrp} price={product.price} />
          {product.inStock && (
            <m.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => addToList(product)}
              aria-label={inList ? `Add another ${product.name} to enquiry list` : `Add ${product.name} to enquiry list`}
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
    </m.article>
  )
}
