#!/usr/bin/env node
/**
 * Generates elegant SVG placeholder images for the sample catalog.
 *
 *   npm run generate-placeholders            → only creates missing .svg files
 *   npm run generate-placeholders -- --force → regenerates every placeholder
 *
 * Only paths ending in ".svg" that are referenced in the JSON files are generated,
 * so your real product photos (.jpg / .webp / .png) are never touched.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const force = process.argv.includes('--force')

const read = (f) => JSON.parse(fs.readFileSync(path.join(pub, 'data', f), 'utf8'))
const products = read('products.json')
const categories = read('categories.json')
const site = read('site.json')

// Soft background tint + product body colour per category
const PALETTE = {
  skincare: { bg: ['#FBF1EA', '#F2DCCD'], body: ['#E9B79A', '#C98A6B'], accent: '#8A4B32' },
  'hair-care': { bg: ['#EEF3EC', '#D6E3D2'], body: ['#7FA37A', '#4E7A4B'], accent: '#2F5230' },
  'personal-care': { bg: ['#EDF4F7', '#D2E4EC'], body: ['#7FB2C8', '#4B88A3'], accent: '#22546B' },
  makeup: { bg: ['#F9ECEE', '#EFD0D5'], body: ['#C7737F', '#9C4655'], accent: '#6B2733' },
  fragrances: { bg: ['#F6F0E3', '#E8DABA'], body: ['#D4AE5C', '#A9843A'], accent: '#5E4517' },
  household: { bg: ['#EEF0FA', '#D6DAF1'], body: ['#8C95D6', '#5B64B0'], accent: '#2E3577' },
  'grocery-staples': { bg: ['#FAF3E3', '#EFDFB8'], body: ['#D9A441', '#B07D22'], accent: '#6A4A10' },
  beverages: { bg: ['#F3EDE7', '#E2D3C5'], body: ['#9B6B4B', '#6E4529'], accent: '#3E2614' },
  snacks: { bg: ['#FCEFE6', '#F5D6C0'], body: ['#E88B4F', '#C0612A'], accent: '#6E3311' },
  'baby-care': { bg: ['#F1F2FB', '#DEE1F6'], body: ['#A9B3EA', '#7D89D4'], accent: '#3A4593' },
  'home-kitchen': { bg: ['#EFF1F1', '#D9DEDE'], body: ['#6F7B80', '#47535A'], accent: '#22292E' },
  'health-wellness': { bg: ['#EBF6F1', '#CDE9DC'], body: ['#5DB08A', '#348462'], accent: '#17513A' },
}
const DEFAULT = { bg: ['#F3EDE3', '#E8DFD0'], body: ['#C9A24B', '#A9843A'], accent: '#0F1B2D' }

function shapeFor(p) {
  const t = `${p.name} ${p.subcategory}`.toLowerCase()
  const rules = [
    [/serum|dropper|hair oil|massage oil/, 'dropper'],
    [/sunscreen|cleanser|toothpaste|tube/, 'tube'],
    [/lipstick/, 'lipstick'],
    [/mascara/, 'mascara'],
    [/parfum|toilette/, 'perfume'],
    [/deodorant|spray/, 'spray'],
    [/shampoo|conditioner|body wash|lotion|dishwash|detergent|foundation/, 'pump'],
    [/moisturiser|ghee|makhana|jar/, 'jar'],
    [/bar|soap/, 'bar'],
    [/kadai|cookware/, 'pan'],
    [/flask|bottle/, 'flask'],
    [/rice|atta|dal|almond|protein|coffee/, 'pouch'],
    [/oil|cleaner/, 'bottle'],
  ]
  for (const [re, s] of rules) if (re.test(t)) return s
  return 'box'
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const initials = (s) => s.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

/** A product silhouette centred around (0,0), roughly 300 wide × 440 tall. */
function silhouette(shape, label, brand) {
  const L = (y, w = 150, h = 120) => `
    <rect x="${-w / 2}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFFDF8" opacity=".95"/>
    <text x="0" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.min(46, w / 3)}" font-weight="700" fill="url(#ink)">${esc(label)}</text>
    <text x="0" y="${y + h / 2 + 30}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.min(11, w / 15)}" letter-spacing="1.5" fill="url(#ink)" opacity=".75">${esc(brand.toUpperCase().slice(0, 16))}</text>
    <line x1="${-w / 2 + 22}" x2="${w / 2 - 22}" y1="${y + 18}" y2="${y + 18}" stroke="url(#ink)" stroke-width="1" opacity=".3"/>`
  const shine = (x, y, h) => `<rect x="${x}" y="${y}" width="14" height="${h}" rx="7" fill="#fff" opacity=".28"/>`
  switch (shape) {
    case 'dropper':
      return `<rect x="-26" y="-215" width="52" height="70" rx="22" fill="#2B2B2B"/>
        <rect x="-40" y="-150" width="80" height="40" rx="6" fill="url(#gold)"/>
        <rect x="-95" y="-115" width="190" height="320" rx="34" fill="url(#body)"/>${shine(-75, -95, 260)}${L(-10, 150, 130)}`
    case 'tube':
      return `<path d="M-90,-200 L90,-200 L70,150 L-70,150 Z" fill="url(#body)"/>
        <rect x="-95" y="-215" width="190" height="22" rx="4" fill="url(#body)" opacity=".85"/>
        <rect x="-55" y="150" width="110" height="65" rx="10" fill="#FFFDF8"/>${shine(-70, -180, 300)}${L(-110, 140, 130)}`
    case 'lipstick':
      return `<path d="M-40,-200 Q0,-245 40,-185 L40,-90 L-40,-90 Z" fill="#9C2F3E"/>
        <rect x="-55" y="-95" width="110" height="60" rx="6" fill="url(#gold)"/>
        <rect x="-70" y="-40" width="140" height="250" rx="12" fill="url(#body)"/>${shine(-55, -25, 220)}${L(30, 120, 120)}`
    case 'mascara':
      return `<rect x="-38" y="-230" width="76" height="210" rx="18" fill="#1E1E1E"/>
        <rect x="-42" y="-30" width="84" height="18" rx="4" fill="url(#gold)"/>
        <rect x="-50" y="-10" width="100" height="230" rx="40" fill="url(#body)"/>${shine(-35, 10, 190)}${L(40, 90, 120)}`
    case 'perfume':
      return `<rect x="-45" y="-215" width="90" height="70" rx="8" fill="url(#gold)"/>
        <rect x="-18" y="-150" width="36" height="30" fill="#BFA25A"/>
        <path d="M-130,-120 L130,-120 L150,-90 L150,190 Q150,210 130,210 L-130,210 Q-150,210 -150,190 L-150,-90 Z" fill="url(#body)" opacity=".92"/>
        <path d="M-110,-95 L110,-95 L125,-75 L125,180 L-125,180 L-125,-75 Z" fill="#fff" opacity=".12"/>${L(-10, 190, 130)}`
    case 'spray':
      return `<rect x="-55" y="-220" width="110" height="80" rx="20" fill="#2B2B2B"/>
        <rect x="-80" y="-145" width="160" height="25" rx="6" fill="#C9C9C9"/>
        <rect x="-80" y="-125" width="160" height="340" rx="20" fill="url(#body)"/>${shine(-60, -105, 300)}${L(-20, 130, 130)}`
    case 'pump':
      return `<path d="M-10,-230 L60,-230 L60,-212 L10,-212 L10,-190 L-10,-190 Z" fill="#2B2B2B"/>
        <rect x="-30" y="-195" width="60" height="45" rx="6" fill="#2B2B2B"/>
        <rect x="-85" y="-155" width="170" height="370" rx="38" fill="url(#body)"/>${shine(-65, -130, 320)}${L(-20, 140, 140)}`
    case 'jar':
      return `<rect x="-140" y="-120" width="280" height="70" rx="14" fill="url(#gold)"/>
        <rect x="-150" y="-55" width="300" height="230" rx="34" fill="url(#body)"/>${shine(-125, -35, 180)}${L(-15, 210, 130)}`
    case 'bar':
      return `<rect x="-170" y="-110" width="340" height="230" rx="26" fill="url(#body)"/>
        <rect x="-150" y="-90" width="300" height="190" rx="18" fill="#fff" opacity=".1"/>${L(-60, 230, 120)}`
    case 'pan':
      return `<rect x="-60" y="-150" width="120" height="30" rx="15" fill="#2B2B2B"/>
        <path d="M-180,-110 Q0,-140 180,-110 L180,-90 L-180,-90 Z" fill="#3A3A3A"/>
        <path d="M-200,-80 L200,-80 Q190,120 0,130 Q-190,120 -200,-80 Z" fill="url(#body)"/>
        <rect x="200" y="-70" width="90" height="26" rx="13" fill="#2B2B2B"/><rect x="-290" y="-70" width="90" height="26" rx="13" fill="#2B2B2B"/>
        ${L(-35, 170, 120)}`
    case 'flask':
      return `<rect x="-55" y="-235" width="110" height="60" rx="12" fill="#2B2B2B"/>
        <rect x="-75" y="-180" width="150" height="400" rx="40" fill="url(#body)"/>${shine(-55, -160, 360)}${L(-20, 120, 130)}`
    case 'pouch':
      return `<path d="M-150,-190 L150,-190 L165,190 Q165,215 140,215 L-140,215 Q-165,215 -165,190 Z" fill="url(#body)"/>
        <rect x="-150" y="-205" width="300" height="30" rx="4" fill="url(#body)" opacity=".8"/>
        <line x1="-150" x2="150" y1="-160" y2="-160" stroke="#fff" stroke-opacity=".35" stroke-dasharray="4 6"/>${L(-60, 220, 150)}`
    case 'bottle':
      return `<rect x="-38" y="-235" width="76" height="55" rx="10" fill="url(#gold)"/>
        <path d="M-30,-180 L30,-180 L30,-150 Q105,-120 105,-50 L105,190 Q105,215 80,215 L-80,215 Q-105,215 -105,190 L-105,-50 Q-105,-120 -30,-150 Z" fill="url(#body)"/>${shine(-85, -60, 240)}${L(-10, 160, 140)}`
    default: // box
      return `<path d="M-140,-210 L140,-210 L175,-180 L175,215 L-140,215 Z" fill="url(#body)" opacity=".7"/>
        <rect x="-160" y="-190" width="300" height="405" rx="10" fill="url(#body)"/>
        <rect x="-160" y="-190" width="300" height="40" rx="10" fill="#fff" opacity=".15"/>${L(-55, 220, 150)}`
  }
}

function defs(c, darker = false) {
  const [b1, b2] = c.body
  return `<defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="${darker ? c.bg[1] : '#FFFFFF'}"/>
      <stop offset=".55" stop-color="${darker ? c.bg[1] : c.bg[0]}"/>
      <stop offset="1" stop-color="${darker ? c.body[0] : c.bg[1]}" stop-opacity="${darker ? 0.55 : 1}"/>
    </radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF8D"/><stop offset="1" stop-color="#A9843A"/></linearGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.accent}"/><stop offset="1" stop-color="${c.accent}"/></linearGradient>
    <radialGradient id="shadow"><stop offset="0" stop-color="${c.accent}" stop-opacity=".35"/><stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></radialGradient>
  </defs>`
}

function productSvg(p, variant) {
  const c = PALETTE[p.category] || DEFAULT
  const shape = shapeFor(p)
  const label = initials(p.brand) || 'BF'
  const alt = variant === 2
  const transform = alt ? 'translate(430 420) rotate(-8) scale(.95)' : 'translate(400 410)'
  const extra = alt
    ? `<circle cx="640" cy="170" r="70" fill="#fff" opacity=".35"/><circle cx="160" cy="640" r="110" fill="#fff" opacity=".22"/>
       <text x="60" y="730" font-family="Georgia, serif" font-size="22" font-style="italic" fill="${c.accent}" opacity=".7">${esc(p.size || '')}</text>`
    : `<circle cx="140" cy="150" r="5" fill="${c.accent}" opacity=".25"/><circle cx="670" cy="620" r="7" fill="${c.accent}" opacity=".18"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="${esc(p.name)}">
  ${defs(c, alt)}
  <rect width="800" height="800" fill="url(#bg)"/>
  ${extra}
  <ellipse cx="${alt ? 430 : 400}" cy="${alt ? 660 : 650}" rx="240" ry="34" fill="url(#shadow)"/>
  <g transform="${transform}">${silhouette(shape, label, p.brand)}</g>
</svg>
`
}

function categorySvg(cat) {
  const c = PALETTE[cat.id] || DEFAULT
  const sample = products.find((p) => p.category === cat.id) || { name: cat.name, subcategory: '', brand: cat.name }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="${esc(cat.name)}">
  ${defs(c)}
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="290" r="210" fill="#fff" opacity=".45"/>
  <ellipse cx="300" cy="500" rx="190" ry="26" fill="url(#shadow)"/>
  <g transform="translate(300 290) scale(.72)">${silhouette(shapeFor(sample), initials(cat.name), cat.name)}</g>
</svg>
`
}

function bannerSvg(banner, idx) {
  const themes = [
    ['#0F1B2D', '#1C2B43', '#C9A24B'],
    ['#1E2B1F', '#2F4530', '#D9A441'],
    ['#2A1A12', '#47291B', '#D4AE5C'],
    ['#141C38', '#232F5C', '#B9C2F0'],
  ]
  const [a, b, g] = themes[idx % themes.length]
  const catId = (banner.ctaLink || '').split('/').pop()
  const items = products.filter((p) => p.category === catId).slice(0, 3)
  const placed = items.map((p, i) => {
    const c = PALETTE[p.category] || DEFAULT
    const x = [1180, 960, 1400][i]
    const s = [0.95, 0.72, 0.72][i]
    const y = [380, 430, 430][i]
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs><linearGradient id="body${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.body[0]}"/><stop offset="1" stop-color="${c.body[1]}"/></linearGradient></defs>${silhouette(shapeFor(p), initials(p.brand), p.brand).replace(/url\(#body\)/g, `url(#body${i})`)}</g>`
  })
  // Draw the larger centre item last so it sits in front
  const order = [placed[1], placed[2], placed[0]].filter(Boolean).join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700" width="1600" height="700" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(banner.title)}">
  <defs>
    <linearGradient id="bgb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="glow" cx="72%" cy="45%" r="45%"><stop offset="0" stop-color="${g}" stop-opacity=".45"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF8D"/><stop offset="1" stop-color="#A9843A"/></linearGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F1B2D"/><stop offset="1" stop-color="#0F1B2D"/></linearGradient>
    <radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="700" fill="url(#bgb)"/>
  <rect width="1600" height="700" fill="url(#glow)"/>
  <circle cx="1180" cy="360" r="300" fill="none" stroke="${g}" stroke-opacity=".25" stroke-width="1.5"/>
  <circle cx="1180" cy="360" r="240" fill="none" stroke="${g}" stroke-opacity=".15" stroke-width="1"/>
  <ellipse cx="1180" cy="640" rx="420" ry="40" fill="url(#shadow)"/>
  ${order}
</svg>
`
}

let written = 0
function write(rel, content) {
  if (!rel.endsWith('.svg')) return
  const file = path.join(pub, rel)
  if (!force && fs.existsSync(file)) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
  written++
}

products.forEach((p) => (p.images || []).forEach((img, i) => write(img, productSvg(p, i === 0 ? 1 : 2))))
categories.forEach((c) => c.image && write(c.image, categorySvg(c)))
;(site.heroBanners || []).forEach((b, i) => b.image && write(b.image, bannerSvg(b, i)))

console.log(`✓ ${written} placeholder image(s) written${force ? ' (forced)' : ''}.`)
