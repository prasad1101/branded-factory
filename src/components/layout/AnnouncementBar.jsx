import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../../hooks/useData'

export default function AnnouncementBar() {
  const { site } = useSite()
  const messages = site.announcementBar?.length ? site.announcementBar : []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (messages.length < 2 || paused) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 3800)
    return () => window.clearInterval(t)
  }, [messages.length, paused])

  return (
    <div
      className="relative h-9 overflow-hidden bg-navy text-[13px] font-medium text-cream-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Store announcements"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        {messages.length > 0 && (
          <motion.p
            key={index}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex h-9 items-center justify-center px-4 text-center tracking-wide"
          >
            {messages[index % messages.length]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
