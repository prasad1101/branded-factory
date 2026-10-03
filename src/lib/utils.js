/**
 * Shared helpers: discount maths, INR formatting, WhatsApp links, asset URLs.
 * Keep these pure (no React) so they can be reused anywhere.
 */

/** Join class names, skipping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Resolve a path from the JSON files (e.g. "images/products/bf-0001-1.jpg")
 * against the site's base path, so it works on GitHub Pages under /branded-factory/.
 */
export function assetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + path.replace(/^\.?\//, '')
}

/**
 * Discount is ALWAYS calculated from mrp and price, never typed manually.
 * The percentage is rounded down so we never overstate a saving.
 */
export function getDiscount(mrp, price) {
  const m = Number(mrp) || 0
  const p = Number(price) || 0
  if (m <= 0 || p <= 0 || p >= m) return { percent: 0, savings: 0 }
  return { percent: Math.floor(((m - p) / m) * 100), savings: Math.round((m - p) * 100) / 100 }
}

const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

/** Format a number in Indian style: 123456 → "₹1,23,456". */
export function formatINR(value, currency = '₹') {
  return `${currency}${inrFormatter.format(Number(value) || 0)}`
}

/** Keep only digits, so "+91 72181 50034" → "917218150034". */
export function cleanPhone(number) {
  return String(number || '').replace(/\D/g, '')
}

/** https://wa.me link with a URL-encoded message. */
export function buildWhatsAppUrl(number, message = '') {
  const phone = cleanPhone(number)
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${text}`
}

/** "Size UK 9, Black" from the options a customer picked (either may be empty). */
export function variantLabel({ size, color } = {}) {
  return [size && `Size ${size}`, color].filter(Boolean).join(', ')
}

/** "Name (Size UK 9, Black) × 2 — ₹898" */
function productLine(product, qty, currency, options = {}) {
  const details = [variantLabel(options), product.size].filter(Boolean).join(', ')
  return `${product.name}${details ? ` (${details})` : ''} × ${qty} — ${formatINR(product.price * qty, currency)}`
}

/**
 * Build the enquiry-list WhatsApp message.
 * @param {{ items: {product: object, qty: number, size?: string, color?: string}[], customer?: {name?:string, location?:string, notes?:string}, storeName?: string, currency?: string }} opts
 */
export function buildEnquiryMessage({ items, customer = {}, storeName = 'Branded Factory', currency = '₹' }) {
  const lines = [`Hello ${storeName}! 👋`, "I'd like to order:", '']
  let total = 0
  let mrpTotal = 0
  items.forEach(({ product, qty, size, color }, i) => {
    lines.push(`${i + 1}. ${product.brand ? `${product.brand} ` : ''}${productLine(product, qty, currency, { size, color })}`)
    total += product.price * qty
    mrpTotal += (product.mrp || product.price) * qty
  })
  const saved = Math.max(0, mrpTotal - total)
  lines.push('')
  lines.push(`Total: ${formatINR(total, currency)}${saved > 0 ? ` (You save ${formatINR(saved, currency)} 🎉)` : ''}`)
  lines.push('')
  lines.push(`Name: ${customer.name?.trim() || '___'}`)
  lines.push(`Location: ${customer.location?.trim() || '___'}`)
  lines.push(`Notes: ${customer.notes?.trim() || '___'}`)
  return lines.join('\n')
}

/** WhatsApp message for a single product (product page "Order on WhatsApp"). */
export function buildProductMessage({ product, qty = 1, size, color, storeName = 'Branded Factory', currency = '₹', pageUrl = '' }) {
  const brand = product.brand ? `${product.brand} ` : ''
  if (!product.inStock) {
    const details = [variantLabel({ size, color }), product.size].filter(Boolean).join(', ')
    return [`Hello ${storeName}! 👋`, 'Is this product available?', '', `${brand}${product.name}${details ? ` (${details})` : ''}`, pageUrl ? `Link: ${pageUrl}` : null]
      .filter((l) => l !== null)
      .join('\n')
  }
  const { savings } = getDiscount(product.mrp, product.price)
  return [
    `Hello ${storeName}! 👋`,
    "I'd like to order:",
    '',
    `1. ${brand}${productLine(product, qty, currency, { size, color })}`,
    '',
    `Total: ${formatINR(product.price * qty, currency)}${savings > 0 ? ` (You save ${formatINR(savings * qty, currency)} 🎉)` : ''}`,
    pageUrl ? `Link: ${pageUrl}` : null,
    '',
    'Name: ___',
    'Location: ___',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

/** Public URL of a hash route, e.g. productUrl('bf-0001') → https://…/branded-factory/#/product/bf-0001 */
export function pageUrl(route) {
  if (typeof window === 'undefined') return ''
  const { origin, pathname } = window.location
  return `${origin}${pathname}#${route}`
}

/** Milliseconds until the next midnight in India Standard Time (UTC+5:30). */
export function msUntilMidnightIST(now = Date.now()) {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000
  const istNow = now + IST_OFFSET
  const day = 24 * 60 * 60 * 1000
  return day - (istNow % day)
}

/** Safe localStorage helpers (private mode / blocked storage must never crash the site). */
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: ignore */
  }
}

export function pluralize(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}
