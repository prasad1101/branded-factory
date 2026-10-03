import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useCategories } from '../hooks/useData'
import WhatsAppButton from './WhatsAppButton'

export default function EmptyState({ title = 'No products found', message = 'Try removing a filter or searching for something else.', action, query, as: Heading = 'h2' }) {
  const { categories } = useCategories()
  return (
    <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-soft">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-gold-700">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <Heading className="mt-5 text-2xl font-semibold sm:text-3xl">{title}</Heading>
      <p className="mx-auto mt-2 max-w-md text-ink-muted">{message}</p>
      {action && <div className="mt-6">{action}</div>}
      <p className="eyebrow mt-10">Popular categories</p>
      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
        {categories.slice(0, 8).map((c) => (
          <Link key={c.id} to={`/category/${c.id}`} className="chip">
            {c.name}
          </Link>
        ))}
      </div>
      <div className="mt-10 border-t border-navy/5 pt-8">
        <p className="text-sm text-ink-muted">Can’t find it? We can source it for you.</p>
        <WhatsAppButton className="mt-3" message={`Hello! 👋 I'm looking for ${query ? `"${query}"` : 'a product'}. Can you help?`}>
          Ask us on WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  )
}
