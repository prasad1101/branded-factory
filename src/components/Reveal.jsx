import { motion } from 'framer-motion'

/** Fade/slide content in once when it scrolls into view. */
export default function Reveal({ children, className = '', delay = 0, y = 18, as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
