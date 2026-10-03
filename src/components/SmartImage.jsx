import { useEffect, useState } from 'react'
import { assetUrl, cn } from '../lib/utils'

/** Elegant branded placeholder shown when an image is missing or fails to load. */
export function ImagePlaceholder({ label = '', className = '' }) {
  const initial = (label || 'B').trim().charAt(0).toUpperCase()
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cream-100 via-cream-200 to-gold-100 text-center',
        className,
      )}
      role="img"
      aria-label={label ? `${label} (image coming soon)` : 'Image coming soon'}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-white/60 font-serif text-3xl font-semibold text-gold-700 shadow-soft">
        {initial}
      </span>
      <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-navy/40">Branded Factory</span>
    </div>
  )
}

/**
 * <img> that resolves paths against the GitHub Pages base path and
 * falls back to the branded placeholder on error.
 */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', eager = false, sizes, ...rest }) {
  const [failed, setFailed] = useState(!src)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFailed(!src)
    setLoaded(false)
  }, [src])

  if (failed) return <ImagePlaceholder label={alt} className={className} />

  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      sizes={sizes}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn('transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', imgClassName, className)}
      {...rest}
    />
  )
}
