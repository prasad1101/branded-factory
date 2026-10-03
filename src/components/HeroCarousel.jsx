import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import SmartImage from './SmartImage'
import Skeleton from './Skeleton'
import { cn } from '../lib/utils'

function Slide({ banner, active, index }) {
  return (
    <div className="relative min-w-0 flex-[0_0_100%]" role="group" aria-roledescription="slide" aria-label={`${index + 1}: ${banner.title}`}>
      <div className="relative h-[460px] overflow-hidden sm:h-[440px] lg:h-[520px]">
        <SmartImage
          src={banner.image}
          alt=""
          eager={index === 0}
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-[78%_center] transition-transform duration-[6000ms] ease-out sm:object-right',
            active ? 'scale-105' : 'scale-100',
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10 sm:bg-gradient-to-r sm:from-navy sm:via-navy/75 sm:to-transparent" aria-hidden="true" />
        <div className="relative flex h-full items-end px-6 pb-14 sm:items-center sm:px-12 sm:pb-0 lg:px-16">
          <motion.div
            key={active ? 'on' : 'off'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 24 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="max-w-xl"
          >
            {banner.eyebrow && (
              <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-navy/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur">
                {banner.eyebrow}
              </p>
            )}
            {index === 0 ? (
              <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">{banner.title}</h1>
            ) : (
              <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">{banner.title}</h2>
            )}
            {banner.subtitle && <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">{banner.subtitle}</p>}
            {banner.ctaText && banner.ctaLink && (
              <Link to={banner.ctaLink} tabIndex={active ? 0 : -1} className="btn-gold mt-7 px-7 py-3.5 text-base">
                {banner.ctaText} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function HeroCarousel({ banners = [], loading = false }) {
  const reduce = useReducedMotion()
  const [autoplay] = useState(() => Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }))
  const [ref, api] = useEmblaCarousel({ loop: true, duration: 30 }, reduce ? [] : [autoplay])
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(!reduce)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect).on('reInit', onSelect)
    return () => api.off('select', onSelect).off('reInit', onSelect)
  }, [api])

  const togglePlay = useCallback(() => {
    const ap = api?.plugins()?.autoplay
    if (!ap) return
    if (ap.isPlaying()) {
      ap.stop()
      setPlaying(false)
    } else {
      ap.play()
      setPlaying(true)
    }
  }, [api])

  if (loading) return <Skeleton className="h-[460px] w-full rounded-3xl sm:h-[440px] lg:h-[520px]" />
  if (!banners.length) return null

  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy shadow-lift" aria-roledescription="carousel" aria-label="Featured offers">
      <div ref={ref} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {banners.map((b, i) => (
            <Slide key={b.id || i} banner={b} index={i} active={selected === i} />
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between sm:left-12 lg:left-16">
          <div className="flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id || i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={selected === i}
                className="group flex h-6 items-center"
              >
                <span className={cn('block h-1.5 rounded-full transition-all duration-500', selected === i ? 'w-8 bg-gold-400' : 'w-1.5 bg-white/40 group-hover:bg-white/70')} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!reduce && (
              <button type="button" onClick={togglePlay} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
            <button type="button" onClick={() => api?.scrollPrev()} className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:flex" aria-label="Previous slide">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => api?.scrollNext()} className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:flex" aria-label="Next slide">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
