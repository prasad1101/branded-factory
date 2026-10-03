import { Helmet } from 'react-helmet-async'
import { useSite } from '../hooks/useData'
import { assetUrl } from '../lib/utils'

const SITE_URL = 'https://prasad1101.github.io/branded-factory/'

export default function Seo({ title, description, image, path = '' }) {
  const { site } = useSite()
  const storeName = site.storeName || 'Branded Factory'
  const fullTitle = title ? `${title} | ${storeName}` : `${storeName} | Bumper Discounts on Top Brands`
  const desc =
    description ||
    `${site.tagline || 'Bumper Discounts. Assured Savings. Greatest Deals.'} Shop genuine branded products and order instantly on WhatsApp.`
  const url = SITE_URL + (path ? `#${path}` : '')
  const img = image && !image.endsWith('.svg') ? new URL(assetUrl(image), SITE_URL).href : `${SITE_URL}og-image.jpg`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}
