import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import Seo from '../components/Seo'
import SearchBar from '../components/layout/SearchBar'

export default function NotFound() {
  return (
    <section className="container-px py-16 text-center sm:py-24">
      <Seo title="Page not found" />
      <p className="font-serif text-[7rem] font-semibold leading-none text-transparent sm:text-[10rem]" style={{ WebkitTextStroke: '2px #C9A24B' }} aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">This page went out of stock</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">The page you’re looking for doesn’t exist or has moved. Let’s find you a great deal instead.</p>
      <SearchBar className="mx-auto mt-8 max-w-md text-left" />
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-primary px-7 py-3.5">
          <Home className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
        <Link to="/shop?sort=discount" className="btn-outline px-7 py-3.5">
          <Search className="h-4 w-4" aria-hidden="true" /> Browse deals
        </Link>
      </div>
    </section>
  )
}
