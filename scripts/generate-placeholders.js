#!/usr/bin/env node
/**
 * Generates elegant SVG placeholder images for the sample catalog.
 *
 *   npm run generate-placeholders            → only creates missing .svg files
 *   npm run generate-placeholders -- --force → regenerates every placeholder
 *
 * Only paths ending in ".svg" that are referenced in the JSON files are generated,
 * so your real product photos (.jpg / .webp / .png) are never touched.
 * Products are drawn in their first colour (image 1) and second colour (image 2).
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

// Soft background tint per category + fallback body colour for items without colours
const PALETTE = {
  sneakers: { bg: ['#F4F1EC', '#E6DFD3'], body: '#C8333B', ink: '#3A2A1A' },
  'sports-shoes': { bg: ['#EEF2F6', '#D9E1EA'], body: '#3E6FB0', ink: '#1E2A4A' },
  'slides-sandals': { bg: ['#F1F3EE', '#DDE3D5'], body: '#1F1F1F', ink: '#2F3A22' },
  'men-clothing': { bg: ['#EFF1F4', '#DCE0E7'], body: '#1E2A4A', ink: '#1E2A4A' },
  'women-clothing': { bg: ['#F8EEF0', '#EED7DC'], body: '#E8A3B5', ink: '#6B2733' },
  activewear: { bg: ['#EEF0F6', '#D8DCEA'], body: '#1F1F1F', ink: '#232A4A' },
  bags: { bg: ['#F3EFE9', '#E3D9CB'], body: '#5E6B3A', ink: '#3E2E1A' },
  watches: { bg: ['#F1F1EF', '#DEDDD8'], body: '#7A4E2D', ink: '#2A2622' },
  accessories: { bg: ['#F2F0EC', '#E2DDD3'], body: '#1E2A4A', ink: '#2A2622' },
  skincare: { bg: ['#FBF1EA', '#F2DCCD'], body: '#E9B79A', ink: '#8A4B32' },
  fragrances: { bg: ['#F6F0E3', '#E8DABA'], body: '#D4AE5C', ink: '#5E4517' },
}
const DEFAULT = { bg: ['#F3EDE3', '#E8DFD0'], body: '#C9A24B', ink: '#0F1B2D' }

/* ---------- colour helpers ---------- */
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const rgbToHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
const shade = (hex, amt) => rgbToHex(hexToRgb(hex).map((v) => (amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)))
const isLight = (hex) => {
  const [r, g, b] = hexToRgb(hex)
  return 0.299 * r + 0.587 * g + 0.114 * b > 185
}

function shapeFor(p) {
  const t = `${p.name} ${p.subcategory || ''} ${p.category}`.toLowerCase()
  const rules = [
    [/slide|sandal/, 'slide'],
    [/sock/, 'socks'],
    [/sneaker|shoe/, 'sneaker'],
    [/legging|jean|trouser|chino|track pant|pants/, 'pants'],
    [/dress/, 'dress'],
    [/sports bra|bra\b/, 'bra'],
    [/hoodie|sweatshirt|pullover/, 'hoodie'],
    [/polo/, 'polo'],
    [/t-shirt|tee\b|tees\b|tops/, 'tshirt'],
    [/shirt|oxford/, 'shirt'],
    [/backpack/, 'backpack'],
    [/duffel|gym bag/, 'duffel'],
    [/trolley|luggage|cabin/, 'trolley'],
    [/tote|handbag/, 'tote'],
    [/watch/, 'watch'],
    [/cap\b|baseball/, 'cap'],
    [/belt/, 'belt'],
    [/sunglass/, 'sunglasses'],
    [/parfum|toilette|fragrance/, 'perfume'],
    [/serum/, 'dropper'],
    [/sunscreen|cleanser/, 'pump'],
    [/moisturi|gel/, 'jar'],
  ]
  for (const [re, s] of rules) if (re.test(t)) return s
  return 'tshirt'
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const initials = (s) => s.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

/** Small woven brand tag (no logos, just initials). */
const tag = (x, y, label, w = 54) =>
  `<rect x="${x - w / 2}" y="${y}" width="${w}" height="24" rx="4" fill="#FFFDF8" opacity=".92"/><text x="${x}" y="${y + 17}" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="700" fill="url(#ink)">${esc(label)}</text>`

/** Product silhouettes centred on (0,0), roughly 440 × 440. url(#b) = body colour, url(#d) = darker accent. */
function silhouette(shape, label, brand, outline) {
  const st = outline ? ' stroke="#00000022" stroke-width="2"' : ''
  const L = (y, w = 150, h = 120) => `
    <rect x="${-w / 2}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFFDF8" opacity=".95"/>
    <text x="0" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.min(46, w / 3)}" font-weight="700" fill="url(#ink)">${esc(label)}</text>
    <text x="0" y="${y + h / 2 + 30}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.min(11, w / 15)}" letter-spacing="1.5" fill="url(#ink)" opacity=".75">${esc(brand.toUpperCase().slice(0, 16))}</text>`
  const shine = (x, y, h) => `<rect x="${x}" y="${y}" width="14" height="${h}" rx="7" fill="#fff" opacity=".28"/>`
  switch (shape) {
    case 'sneaker':
      return `<g transform="translate(-15 10) scale(1.35)">
        <path d="M-200,40 C-200,-10 -170,-40 -120,-50 L-60,-60 C-30,-110 30,-130 70,-120 L110,-80 C150,-60 200,-40 225,0 C240,25 235,45 225,55 L-195,55 C-205,55 -205,45 -200,40Z" fill="url(#b)"${st}/>
        <path d="M-205,50 L232,50 C238,70 228,85 210,85 L-185,85 C-205,85 -212,70 -205,50Z" fill="#FFFDF8" stroke="#00000022" stroke-width="2"/>
        <path d="M-205,72 L230,72" stroke="url(#d)" stroke-width="4" opacity=".35"/>
        <path d="M-120,-10 C-40,-30 60,-30 170,10" fill="none" stroke="url(#d)" stroke-width="16" stroke-linecap="round" opacity=".55"/>
        <path d="M-40,-75 L40,-95 M-30,-55 L50,-75 M-20,-35 L60,-55" stroke="#FFFDF8" stroke-width="6" stroke-linecap="round" opacity=".9"/>
        <path d="M70,-120 L110,-80" stroke="url(#d)" stroke-width="10" stroke-linecap="round" opacity=".5"/>
        ${tag(-150, -5, label, 50)}
      </g>`
    case 'slide':
      return `<g transform="translate(0 20) scale(1.3)">
        <ellipse cx="0" cy="40" rx="220" ry="58" fill="url(#d)"/>
        <ellipse cx="0" cy="28" rx="208" ry="48" fill="#FFFDF8" opacity=".25"/>
        <path d="M-90,30 C-90,-80 90,-80 90,30 Z" fill="url(#b)"${st}/>
        <path d="M-70,-10 C-30,-40 30,-40 70,-10" fill="none" stroke="#FFFDF8" stroke-width="6" opacity=".55"/>
        ${tag(0, -30, label, 56)}
      </g>`
    case 'tshirt':
    case 'polo':
      return `<g>
        <path d="M-70,-170 C-40,-150 40,-150 70,-170 L170,-120 L130,-30 L95,-50 L95,190 L-95,190 L-95,-50 L-130,-30 L-170,-120 Z" fill="url(#b)"${st}/>
        ${shape === 'polo'
          ? `<path d="M-70,-170 L-30,-120 L0,-150 L30,-120 L70,-170 C40,-155 -40,-155 -70,-170Z" fill="url(#d)" opacity=".6"/><path d="M0,-150 L0,-60" stroke="url(#d)" stroke-width="4" opacity=".5"/><circle cx="0" cy="-110" r="5" fill="#FFFDF8"/><circle cx="0" cy="-80" r="5" fill="#FFFDF8"/>`
          : `<path d="M-70,-170 C-40,-140 40,-140 70,-170" fill="none" stroke="url(#d)" stroke-width="10" opacity=".5"/>`}
        <path d="M-95,170 L95,170" stroke="url(#d)" stroke-width="4" opacity=".3"/>
        ${tag(50, -90, label, 46)}
      </g>`
    case 'shirt':
      return `<g>
        <path d="M-70,-170 L70,-170 L150,-130 L200,150 L160,160 L110,-40 L95,190 L-95,190 L-110,-40 L-160,160 L-200,150 L-150,-130 Z" fill="url(#b)"${st}/>
        <path d="M-70,-170 L0,-110 L70,-170 L40,-190 L0,-160 L-40,-190 Z" fill="url(#d)" opacity=".55"/>
        <path d="M0,-110 L0,190" stroke="url(#d)" stroke-width="4" opacity=".45"/>
        ${[-70, -20, 30, 80, 130].map((y) => `<circle cx="0" cy="${y}" r="5" fill="#FFFDF8"/>`).join('')}
        <rect x="-70" y="-90" width="45" height="40" rx="4" fill="none" stroke="url(#d)" stroke-width="3" opacity=".45"/>
        ${tag(50, -80, label, 46)}
      </g>`
    case 'hoodie':
      return `<g>
        <path d="M-70,-150 C-80,-230 80,-230 70,-150 L150,-110 L200,150 L160,165 L110,-30 L100,190 L-100,190 L-110,-30 L-160,165 L-200,150 L-150,-110 Z" fill="url(#b)"${st}/>
        <path d="M-60,-150 C-60,-205 60,-205 60,-150 C30,-120 -30,-120 -60,-150Z" fill="url(#d)" opacity=".55"/>
        <path d="M-15,-125 L-20,-60 M15,-125 L20,-60" stroke="#FFFDF8" stroke-width="5" stroke-linecap="round"/>
        <path d="M-80,60 L80,60 L95,140 L-95,140 Z" fill="url(#d)" opacity=".35"/>
        <path d="M-100,175 L100,175" stroke="url(#d)" stroke-width="10" opacity=".35"/>
        ${tag(0, -20, label, 46)}
      </g>`
    case 'pants':
      return `<g>
        <path d="M-110,-190 L110,-190 L130,200 L30,200 L0,-60 L-30,200 L-130,200 Z" fill="url(#b)"${st}/>
        <rect x="-110" y="-190" width="220" height="32" fill="url(#d)" opacity=".5"/>
        ${[-80, -30, 30, 80].map((x) => `<rect x="${x - 5}" y="-192" width="10" height="36" rx="2" fill="url(#d)" opacity=".7"/>`).join('')}
        <path d="M-95,-150 C-80,-110 -50,-100 -30,-100 M95,-150 C80,-110 50,-100 30,-100" fill="none" stroke="#FFFDF8" stroke-width="3" opacity=".5"/>
        <path d="M0,-158 L0,-90" stroke="url(#d)" stroke-width="3" opacity=".5"/>
        ${tag(-70, -150, label, 44)}
      </g>`
    case 'dress':
      return `<g>
        <path d="M-50,-200 L-30,-200 C-20,-170 20,-170 30,-200 L50,-200 L70,-90 C80,-60 70,-40 60,-30 L170,200 L-170,200 L-60,-30 C-70,-40 -80,-60 -70,-90 Z" fill="url(#b)"${st}/>
        <path d="M-62,-35 L62,-35" stroke="url(#d)" stroke-width="10" opacity=".45"/>
        ${[[-80, 80], [40, 40], [0, 140], [100, 150], [-120, 170], [-20, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#FFFDF8" opacity=".55"/>`).join('')}
        ${tag(0, -110, label, 44)}
      </g>`
    case 'bra':
      return `<g transform="translate(0 20)">
        <path d="M-100,-120 L-60,-180 M100,-120 L60,-180" stroke="url(#b)" stroke-width="22" stroke-linecap="round"/>
        <path d="M-150,-120 L-100,-120 C-80,-40 80,-40 100,-120 L150,-120 L160,80 L-160,80 Z" fill="url(#b)"${st}/>
        <path d="M-160,40 L160,40 L160,90 L-160,90 Z" fill="url(#d)" opacity=".55"/>
        ${tag(0, 50, label, 46)}
      </g>`
    case 'backpack':
      return `<g>
        <path d="M-60,-200 C-60,-240 60,-240 60,-200" fill="none" stroke="url(#d)" stroke-width="16"/>
        <rect x="-140" y="-200" width="280" height="390" rx="70" fill="url(#b)"${st}/>
        <rect x="-100" y="40" width="200" height="120" rx="28" fill="url(#d)" opacity=".45"/>
        <path d="M-100,70 L100,70" stroke="#FFFDF8" stroke-width="4" stroke-dasharray="10 8" opacity=".7"/>
        <path d="M-120,-80 C-60,-110 60,-110 120,-80" fill="none" stroke="url(#d)" stroke-width="6" opacity=".5"/>
        ${tag(0, -40, label, 56)}
      </g>`
    case 'duffel':
      return `<g transform="translate(0 30)">
        <path d="M-120,-60 C-120,-170 120,-170 120,-60" fill="none" stroke="url(#d)" stroke-width="18"/>
        <rect x="-230" y="-80" width="460" height="200" rx="90" fill="url(#b)"${st}/>
        <path d="M-200,-40 L200,-40" stroke="url(#d)" stroke-width="8" opacity=".5"/>
        <ellipse cx="-215" cy="20" rx="16" ry="70" fill="url(#d)" opacity=".5"/><ellipse cx="215" cy="20" rx="16" ry="70" fill="url(#d)" opacity=".5"/>
        ${tag(0, 20, label, 60)}
      </g>`
    case 'trolley':
      return `<g>
        <path d="M-50,-190 L-50,-240 L50,-240 L50,-190" fill="none" stroke="#3A3A3A" stroke-width="14"/>
        <rect x="-140" y="-190" width="280" height="380" rx="36" fill="url(#b)"${st}/>
        ${[-80, -30, 20, 70].map((x) => `<rect x="${x}" y="-170" width="14" height="340" rx="7" fill="#fff" opacity=".18"/>`).join('')}
        <circle cx="-100" cy="205" r="18" fill="#2B2B2B"/><circle cx="100" cy="205" r="18" fill="#2B2B2B"/>
        ${tag(0, -120, label, 56)}
      </g>`
    case 'tote':
      return `<g transform="translate(0 20)">
        <path d="M-90,-90 C-90,-220 90,-220 90,-90" fill="none" stroke="url(#d)" stroke-width="16"/>
        <path d="M-170,-90 L170,-90 L140,180 L-140,180 Z" fill="url(#b)"${st}/>
        <path d="M-160,-50 L160,-50" stroke="url(#d)" stroke-width="4" opacity=".4"/>
        <rect x="-26" y="-70" width="52" height="34" rx="6" fill="#D4AE5C"/>
        ${tag(0, 60, label, 56)}
      </g>`
    case 'watch':
      return `<g>
        <rect x="-62" y="-240" width="124" height="160" rx="24" fill="url(#d)"/>
        <rect x="-62" y="80" width="124" height="160" rx="24" fill="url(#d)"/>
        <circle cx="0" cy="0" r="130" fill="url(#b)"${st}/>
        <circle cx="0" cy="0" r="108" fill="#FFFDF8"/>
        ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<line x1="${(Math.sin(a) * 88).toFixed(1)}" y1="${(-Math.cos(a) * 88).toFixed(1)}" x2="${(Math.sin(a) * 100).toFixed(1)}" y2="${(-Math.cos(a) * 100).toFixed(1)}" stroke="#2A2622" stroke-width="${i % 3 === 0 ? 5 : 2}"/>` }).join('')}
        <line x1="0" y1="0" x2="0" y2="-70" stroke="#2A2622" stroke-width="6" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="52" y2="22" stroke="#2A2622" stroke-width="4" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="7" fill="#C9A24B"/>
        <rect x="128" y="-14" width="22" height="28" rx="5" fill="url(#b)"/>
        <text x="0" y="50" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="700" fill="#2A2622">${esc(label)}</text>
      </g>`
    case 'cap':
      return `<g transform="translate(0 30)">
        <path d="M100,30 C200,20 260,50 250,75 C200,85 120,70 60,55 Z" fill="url(#d)"/>
        <path d="M-160,40 C-160,-140 160,-140 160,40 Z" fill="url(#b)"${st}/>
        <path d="M0,-90 L0,38 M-90,-60 C-60,0 -55,20 -55,38 M90,-60 C60,0 55,20 55,38" stroke="url(#d)" stroke-width="3" opacity=".45" fill="none"/>
        <circle cx="0" cy="-92" r="10" fill="url(#d)"/>
        ${tag(-20, -30, label, 50)}
      </g>`
    case 'socks':
      return `<g>
        ${[-70, 70].map((x, i) => `<g transform="translate(${x} 0) rotate(${i ? 8 : -8})"><path d="M-50,-190 L50,-190 L50,80 C50,130 100,140 120,150 C140,165 130,200 100,200 L-20,200 C-60,200 -50,150 -50,120 Z" fill="url(#b)"${st}/><rect x="-50" y="-190" width="100" height="40" fill="url(#d)" opacity=".5"/><path d="M-50,-130 L50,-130" stroke="url(#d)" stroke-width="5" opacity=".45"/></g>`).join('')}
        ${tag(0, -60, label, 46)}
      </g>`
    case 'belt':
      return `<g transform="scale(1.25)">
        <path d="M-220,-20 L180,-20 L180,30 L-220,30 Z" fill="url(#b)"${st}/>
        <path d="M-220,-8 L180,-8 M-220,18 L180,18" stroke="#FFFDF8" stroke-width="2" stroke-dasharray="8 6" opacity=".55"/>
        <rect x="150" y="-45" width="80" height="100" rx="14" fill="none" stroke="#C9A24B" stroke-width="12"/>
        <line x1="175" y1="5" x2="230" y2="5" stroke="#C9A24B" stroke-width="8"/>
        ${[-120, -80, -40].map((x) => `<circle cx="${x}" cy="5" r="6" fill="url(#d)"/>`).join('')}
        ${tag(-170, -70, label, 50)}
      </g>`
    case 'sunglasses':
      return `<g transform="translate(0 10) scale(1.2)">
        <path d="M-200,-60 L200,-60" stroke="url(#b)" stroke-width="10"/>
        ${[-100, 100].map((x) => `<path d="M${x - 85},-60 L${x + 85},-60 C${x + 85},40 ${x + 50},70 ${x},70 C${x - 50},70 ${x - 85},40 ${x - 85},-60Z" fill="url(#d)" stroke="url(#b)" stroke-width="10"/><path d="M${x - 55},-40 L${x - 20},-40 L${x - 50},20Z" fill="#fff" opacity=".25"/>`).join('')}
        <path d="M-15,-50 C-5,-70 5,-70 15,-50" fill="none" stroke="url(#b)" stroke-width="10"/>
        ${tag(0, 100, label, 50)}
      </g>`
    case 'perfume':
      return `<rect x="-45" y="-215" width="90" height="70" rx="8" fill="url(#gold)"/>
        <rect x="-18" y="-150" width="36" height="30" fill="#BFA25A"/>
        <path d="M-130,-120 L130,-120 L150,-90 L150,190 Q150,210 130,210 L-130,210 Q-150,210 -150,190 L-150,-90 Z" fill="url(#b)" opacity=".92"/>
        <path d="M-110,-95 L110,-95 L125,-75 L125,180 L-125,180 L-125,-75 Z" fill="#fff" opacity=".12"/>${L(-10, 190, 130)}`
    case 'dropper':
      return `<rect x="-26" y="-215" width="52" height="70" rx="22" fill="#2B2B2B"/>
        <rect x="-40" y="-150" width="80" height="40" rx="6" fill="url(#gold)"/>
        <rect x="-95" y="-115" width="190" height="320" rx="34" fill="url(#b)"/>${shine(-75, -95, 260)}${L(-10, 150, 130)}`
    case 'pump':
      return `<path d="M-10,-230 L60,-230 L60,-212 L10,-212 L10,-190 L-10,-190 Z" fill="#2B2B2B"/>
        <rect x="-30" y="-195" width="60" height="45" rx="6" fill="#2B2B2B"/>
        <rect x="-85" y="-155" width="170" height="370" rx="38" fill="url(#b)"/>${shine(-65, -130, 320)}${L(-20, 140, 140)}`
    case 'jar':
    default:
      return `<rect x="-140" y="-120" width="280" height="70" rx="14" fill="url(#gold)"/>
        <rect x="-150" y="-55" width="300" height="230" rx="34" fill="url(#b)"/>${shine(-125, -35, 180)}${L(-15, 210, 130)}`
  }
}

function defs(bg, body, ink, darker = false) {
  const light = isLight(body)
  return `<defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="${darker ? bg[0] : '#FFFFFF'}"/>
      <stop offset=".6" stop-color="${darker ? bg[1] : bg[0]}"/>
      <stop offset="1" stop-color="${darker ? shade(bg[1], -0.08) : bg[1]}"/>
    </radialGradient>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, 0.12)}"/><stop offset="1" stop-color="${shade(body, -0.12)}"/></linearGradient>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, light ? -0.35 : -0.45)}"/><stop offset="1" stop-color="${shade(body, light ? -0.45 : -0.6)}"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8CF8D"/><stop offset="1" stop-color="#A9843A"/></linearGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
    <radialGradient id="shadow"><stop offset="0" stop-color="${ink}" stop-opacity=".3"/><stop offset="1" stop-color="${ink}" stop-opacity="0"/></radialGradient>
  </defs>`
}

function productSvg(p, variant) {
  const pal = PALETTE[p.category] || DEFAULT
  const colors = (p.colors || []).map((c) => c.hex).filter(Boolean)
  const alt = variant === 2
  const body = (alt ? colors[1] || colors[0] : colors[0]) || pal.body
  const transform = alt ? 'translate(410 400) rotate(-6) scale(.92)' : 'translate(400 395) scale(.95)'
  const extra = alt
    ? `<circle cx="650" cy="160" r="70" fill="#fff" opacity=".35"/><circle cx="150" cy="650" r="110" fill="#fff" opacity=".22"/>`
    : `<circle cx="140" cy="150" r="5" fill="${pal.ink}" opacity=".2"/><circle cx="670" cy="620" r="7" fill="${pal.ink}" opacity=".15"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="${esc(p.name)}">
  ${defs(pal.bg, body, pal.ink, alt)}
  <rect width="800" height="800" fill="url(#bg)"/>
  ${extra}
  <ellipse cx="400" cy="640" rx="260" ry="34" fill="url(#shadow)"/>
  <g transform="${transform}">${silhouette(shapeFor(p), initials(p.brand) || 'BF', p.brand, isLight(body))}</g>
</svg>
`
}

function categorySvg(cat) {
  const pal = PALETTE[cat.id] || DEFAULT
  const sample = products.find((p) => p.category === cat.id) || { name: cat.name, category: cat.id, brand: cat.name }
  const body = sample.colors?.[0]?.hex || pal.body
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="${esc(cat.name)}">
  ${defs(pal.bg, body, pal.ink)}
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="290" r="215" fill="#fff" opacity=".45"/>
  <ellipse cx="300" cy="490" rx="200" ry="26" fill="url(#shadow)"/>
  <g transform="translate(300 290) scale(.66)">${silhouette(shapeFor(sample), initials(sample.brand || cat.name), sample.brand || cat.name, isLight(body))}</g>
</svg>
`
}

function bannerSvg(banner, idx) {
  const themes = [
    ['#0F1B2D', '#1C2B43', '#C9A24B'],
    ['#1A1F2B', '#2C3445', '#D9A441'],
    ['#1E2418', '#334028', '#D4AE5C'],
    ['#2A1A12', '#47291B', '#E8CF8D'],
  ]
  const [a, b, g] = themes[idx % themes.length]
  const catId = (banner.ctaLink || '').split('/').pop()
  const items = products.filter((p) => p.category === catId).slice(0, 3)
  const placed = items.map((p, i) => {
    const pal = PALETTE[p.category] || DEFAULT
    const body = p.colors?.[0]?.hex || pal.body
    const x = [1180, 930, 1420][i]
    const s = [0.85, 0.6, 0.6][i]
    const y = [360, 420, 420][i]
    const svg = silhouette(shapeFor(p), initials(p.brand), p.brand, isLight(body)).replace(/url\(#b\)/g, `url(#b${i})`).replace(/url\(#d\)/g, `url(#d${i})`)
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs>
      <linearGradient id="b${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, 0.12)}"/><stop offset="1" stop-color="${shade(body, -0.12)}"/></linearGradient>
      <linearGradient id="d${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(body, -0.45)}"/><stop offset="1" stop-color="${shade(body, -0.6)}"/></linearGradient>
    </defs>${svg}</g>`
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
  <ellipse cx="1180" cy="620" rx="420" ry="40" fill="url(#shadow)"/>
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
