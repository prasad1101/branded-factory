import { useEffect, useRef, useState } from 'react'
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
  // State is keyed by src so a cached image that loads instantly is never reset back to hidden.
  const [failedSrc, setFailedSrc] = useState(null)
  const [loadedSrc, setLoadedSrc] = useState(null)
  const imgRef = useRef(null)

  // Catch images that finished loading before React attached the onLoad handler
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoadedSrc(src)
  }, [src])

  if (!src || failedSrc === src) return <ImagePlaceholder label={alt} className={className} />

  return (
    <img
      ref={imgRef}
      src={assetUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      sizes={sizes}
      onError={() => setFailedSrc(src)}
      onLoad={() => setLoadedSrc(src)}
      className={cn(
        // Above-the-fold (eager) images skip the fade so they count for LCP immediately
        !eager && 'transition-opacity duration-500',
        eager || loadedSrc === src ? 'opacity-100' : 'opacity-0',
        imgClassName,
        className,
      )}
      {...rest}
    />
  )
}
