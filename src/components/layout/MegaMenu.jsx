import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Percent } from 'lucide-react'
import { useCategories, useProducts } from '../../hooks/useData'
import { getSubcategories } from '../../lib/data'
import SmartImage from '../SmartImage'

export default function MegaMenu({ onClose, id }) {
  const { categories } = useCategories()
  const { products } = useProducts()
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute inset-x-0 top-full z-40 hidden border-t border-navy/5 bg-white/95 shadow-lift backdrop-blur-xl lg:block"
    >
      <div className="container-px grid grid-cols-12 gap-8 py-8">
        <nav aria-label="All categories" className="col-span-9">
          <p className="eyebrow mb-4">Shop by category</p>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/category/${c.id}`}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-cream-100"
                >
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    <SmartImage src={c.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-navy group-hover:text-gold-700">{c.name}</span>
                    <span className="block truncate text-xs text-ink-muted">
                      {getSubcategories(products, c.id).slice(0, 3).join(' · ') || c.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          to="/shop?sort=discount"
          onClick={onClose}
          className="group col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl bg-navy p-6 text-white"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-navy">
            <Percent className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-tight text-white">Biggest Savings</span>
            <span className="mt-2 block text-sm text-white/70">Our deepest discounts, all in one place.</span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
              Shop deals <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </div>
    </motion.div>
  )
}
