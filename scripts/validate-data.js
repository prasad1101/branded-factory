#!/usr/bin/env node
/**
 * Checks the store's JSON files before every deploy, so a typo can't break the live site.
 *
 *   npm run validate-data
 *
 * ERRORS (deploy stops, the live site keeps the previous version):
 *   - invalid JSON (missing comma, quote, bracket…)
 *   - duplicate product or category IDs
 *   - missing required fields
 *   - price greater than MRP, or prices that aren't positive numbers
 *   - a product whose "category" doesn't exist in categories.json
 *   - image files that don't exist in public/ (paths are case-sensitive!)
 *   - a WhatsApp number that isn't digits with the country code
 * WARNINGS (deploy continues): things that look unusual but won't break anything.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const dataDir = path.join(pub, 'data')

const useColor = process.stdout.isTTY || process.env.GITHUB_ACTIONS
const c = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)
const red = c(31)
const yellow = c(33)
const green = c(32)
const bold = c(1)
const dim = c(2)

const errors = []
const warnings = []
const err = (file, where, msg) => errors.push({ file, where, msg })
const warn = (file, where, msg) => warnings.push({ file, where, msg })

/** Read + parse JSON, reporting the line/column of syntax errors in plain English. */
function readJSON(file) {
  const full = path.join(dataDir, file)
  if (!fs.existsSync(full)) {
    err(file, '', `File is missing. Expected it at public/data/${file}`)
    return null
  }
  const text = fs.readFileSync(full, 'utf8')
  try {
    return JSON.parse(text)
  } catch (e) {
    const m = String(e.message).match(/position (\d+)/)
    let where = ''
    if (m) {
      const pos = Number(m[1])
      const before = text.slice(0, pos)
      const line = before.split('\n').length
      const col = pos - before.lastIndexOf('\n')
      const snippet = text.split('\n')[line - 1]?.trim().slice(0, 80)
      where = `line ${line}, column ${col}`
      err(file, where, `Invalid JSON: ${e.message.replace(/ in JSON at position \d+.*/, '')}. Near: ${snippet}\n      Tip: check for a missing comma between items, a trailing comma before ] or }, or an unclosed "quote".`)
    } else {
      err(file, where, `Invalid JSON: ${e.message}`)
    }
    return null
  }
}

/** Does this image path exist exactly (case-sensitive, like GitHub Pages)? */
function checkImage(file, where, img) {
  if (!img || typeof img !== 'string') return err(file, where, 'Image path is empty.')
  if (/^(https?:)?\/\//.test(img)) return warn(file, where, `Uses an external image (${img}). It's better to upload images into public/images/.`)
  const rel = img.replace(/^\.?\//, '')
  if (rel.startsWith('public/')) return err(file, where, `Image path should not start with "public/". Use "${rel.slice(7)}".`)
  const full = path.join(pub, rel)
  // Exact, case-sensitive match (macOS/Windows ignore case locally, GitHub Pages does not)
  const exists = fs.existsSync(full) && fs.readdirSync(path.dirname(full)).includes(path.basename(full))
  if (!exists) {
    // Help with the most common mistake: wrong upper/lower case
    const dir = path.dirname(full)
    const base = path.basename(full).toLowerCase()
    const near = fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => f.toLowerCase() === base && f !== path.basename(full)) : null
    return err(file, where, near ? `Image "${img}" not found. Did you mean "${path.posix.join(path.posix.dirname(rel), near)}"? (file names are case-sensitive)` : `Image "${img}" not found in public/. Upload it, or fix the path.`)
  }
  const kb = fs.statSync(full).size / 1024
  if (kb > 500) warn(file, where, `Image "${img}" is ${Math.round(kb)} KB. Keep images under ~200 KB so the site stays fast.`)
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0
const isPositiveNumber = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/* ---------------- site.json ---------------- */
const site = readJSON('site.json')
if (site) {
  const F = 'site.json'
  if (typeof site !== 'object' || Array.isArray(site)) err(F, '', 'Should be an object { ... }, not a list.')
  else {
    if (!isNonEmptyString(site.storeName)) err(F, 'storeName', 'Missing store name.')
    const wa = String(site.whatsappNumber ?? '')
    if (!wa) err(F, 'whatsappNumber', 'Missing WhatsApp number.')
    else if (!/^\d{10,15}$/.test(wa)) err(F, 'whatsappNumber', `"${wa}" should be digits only, with country code and no "+" or spaces, e.g. "917218150034".`)
    else if (wa.length === 10) warn(F, 'whatsappNumber', 'Looks like it is missing the country code (91 for India).')
    if (site.announcementBar !== undefined && !Array.isArray(site.announcementBar)) err(F, 'announcementBar', 'Should be a list of messages: ["…", "…"].')
    if (site.heroBanners !== undefined) {
      if (!Array.isArray(site.heroBanners)) err(F, 'heroBanners', 'Should be a list of banners.')
      else {
        const ids = new Set()
        site.heroBanners.forEach((b, i) => {
          const where = `heroBanners[${i}]${b?.id ? ` (id "${b.id}")` : ''}`
          if (!b || typeof b !== 'object') return err(F, where, 'Each banner should be an object { ... }.')
          if (!isNonEmptyString(b.id)) err(F, where, 'Missing "id".')
          else if (ids.has(b.id)) err(F, where, `Duplicate banner id "${b.id}".`)
          ids.add(b.id)
          if (!isNonEmptyString(b.title)) err(F, where, 'Missing "title".')
          if (b.image) checkImage(F, where, b.image)
          else warn(F, where, 'No "image": a plain dark background will be shown.')
          if (b.ctaLink && !String(b.ctaLink).startsWith('/')) warn(F, where, `ctaLink "${b.ctaLink}" should start with "/", e.g. "/category/skincare".`)
        })
      }
    }
    if (site.faq !== undefined && !Array.isArray(site.faq)) err(F, 'faq', 'Should be a list of { "q": "…", "a": "…" }.')
    ;(Array.isArray(site.faq) ? site.faq : []).forEach((f, i) => {
      if (!isNonEmptyString(f?.q) || !isNonEmptyString(f?.a)) err(F, `faq[${i}]`, 'Each FAQ needs a "q" (question) and an "a" (answer).')
      else if (f.a.includes('[EDIT:')) warn(F, `faq[${i}]`, `Answer still has an [EDIT: …] placeholder: "${f.q}"`)
    })
    if (site.email && !/^\S+@\S+\.\S+$/.test(site.email)) warn(F, 'email', `"${site.email}" doesn't look like an email address.`)
    if (!site.address || /edit in/i.test(site.address)) warn(F, 'address', 'Shop address is still a placeholder.')
  }
}

/* ---------------- categories.json ---------------- */
const categories = readJSON('categories.json')
const categoryIds = new Set()
if (categories) {
  const F = 'categories.json'
  if (!Array.isArray(categories)) err(F, '', 'Should be a list [ {...}, {...} ].')
  else {
    categories.forEach((cat, i) => {
      const where = `item ${i + 1}${cat?.id ? ` (id "${cat.id}")` : ''}`
      if (!cat || typeof cat !== 'object') return err(F, where, 'Each category should be an object { ... }.')
      if (!isNonEmptyString(cat.id)) err(F, where, 'Missing "id".')
      else {
        if (!ID_RE.test(cat.id)) err(F, where, `id "${cat.id}" should be lowercase letters, numbers and hyphens only, e.g. "baby-care".`)
        if (categoryIds.has(cat.id)) err(F, where, `Duplicate category id "${cat.id}".`)
        categoryIds.add(cat.id)
      }
      if (!isNonEmptyString(cat.name)) err(F, where, 'Missing "name".')
      if (cat.image) checkImage(F, where, cat.image)
      else warn(F, where, 'No "image": a branded placeholder will be shown.')
      if (cat.order !== undefined && typeof cat.order !== 'number') err(F, where, '"order" should be a number (no quotes), e.g. 3.')
      if (cat.featured !== undefined && typeof cat.featured !== 'boolean') err(F, where, '"featured" should be true or false (no quotes).')
    })
  }
}

/* ---------------- products.json ---------------- */
const products = readJSON('products.json')
if (products) {
  const F = 'products.json'
  if (!Array.isArray(products)) err(F, '', 'Should be a list [ {...}, {...} ].')
  else {
    const ids = new Set()
    const usedCategories = new Set()
    products.forEach((p, i) => {
      const where = `item ${i + 1}${p?.id ? ` (id "${p.id}")` : ''}${p?.name ? ` "${String(p.name).slice(0, 40)}"` : ''}`
      if (!p || typeof p !== 'object') return err(F, where, 'Each product should be an object { ... }.')

      for (const field of ['id', 'name', 'brand', 'category']) {
        if (!isNonEmptyString(p[field])) err(F, where, `Missing "${field}".`)
      }
      if (isNonEmptyString(p.id)) {
        if (ids.has(p.id)) err(F, where, `Duplicate product id "${p.id}". Every product needs its own unique id.`)
        ids.add(p.id)
        if (/[\s/?#]/.test(p.id)) err(F, where, `id "${p.id}" must not contain spaces, "/", "?" or "#".`)
      }
      if (isNonEmptyString(p.category)) {
        usedCategories.add(p.category)
        if (categories && Array.isArray(categories) && !categoryIds.has(p.category)) {
          err(F, where, `Unknown category "${p.category}". It must match an "id" in categories.json (${[...categoryIds].slice(0, 6).join(', ')}…).`)
        }
      }

      // Prices: discount and savings are calculated from these, so they must be right
      if (typeof p.mrp === 'string' || typeof p.price === 'string') err(F, where, 'Prices must be numbers without quotes or ₹, e.g. "mrp": 799.')
      else {
        if (!isPositiveNumber(p.mrp)) err(F, where, '"mrp" must be a number greater than 0.')
        if (!isPositiveNumber(p.price)) err(F, where, '"price" must be a number greater than 0.')
        if (isPositiveNumber(p.mrp) && isPositiveNumber(p.price)) {
          if (p.price > p.mrp) err(F, where, `"price" (${p.price}) is greater than "mrp" (${p.mrp}). The selling price can't be more than the MRP.`)
          else if (p.price === p.mrp) warn(F, where, 'price equals mrp, so no discount will be shown.')
          else if ((p.mrp - p.price) / p.mrp > 0.9) warn(F, where, `Discount is over 90% (${p.price} vs MRP ${p.mrp}). Double-check the prices.`)
        }
      }
      if ('discount' in p || 'discountPercent' in p || 'savings' in p) {
        warn(F, where, 'Has a discount/savings field. It is ignored: discounts are calculated automatically from mrp and price.')
      }

      // Images
      if (!Array.isArray(p.images)) err(F, where, '"images" should be a list, e.g. ["images/products/bf-0001-1.jpg"].')
      else if (p.images.length === 0) warn(F, where, 'No images: a branded placeholder will be shown.')
      else p.images.forEach((img, j) => checkImage(F, `${where} images[${j}]`, img))

      // Optional fields with the right type
      if (p.inStock !== undefined && typeof p.inStock !== 'boolean') err(F, where, '"inStock" should be true or false (no quotes).')
      if (p.featured !== undefined && typeof p.featured !== 'boolean') err(F, where, '"featured" should be true or false (no quotes).')
      if (p.tags !== undefined && !Array.isArray(p.tags)) err(F, where, '"tags" should be a list, e.g. ["bestseller"].')
      if (p.highlights !== undefined && !Array.isArray(p.highlights)) err(F, where, '"highlights" should be a list of short sentences.')
      if (p.rating !== undefined && (typeof p.rating !== 'number' || p.rating < 0 || p.rating > 5)) err(F, where, '"rating" should be a number from 0 to 5, e.g. 4.5.')
      if (p.dateAdded !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(p.dateAdded) || Number.isNaN(Date.parse(p.dateAdded)))) {
        err(F, where, `"dateAdded" should look like "2026-10-01" (year-month-day). Got "${p.dateAdded}".`)
      }
      if (!p.size) warn(F, where, 'No "size" (e.g. "200 ml"). It helps customers and appears in WhatsApp orders.')
      const known = ['bestseller', 'deal-of-the-day', 'new']
      ;(Array.isArray(p.tags) ? p.tags : []).forEach((t) => {
        if (typeof t !== 'string') err(F, where, 'Each tag should be text in quotes.')
        else if (/[A-Z\s]/.test(t) && known.includes(t.toLowerCase().replace(/\s+/g, '-'))) warn(F, where, `Tag "${t}" should be written "${t.toLowerCase().replace(/\s+/g, '-')}".`)
      })
    })

    if (Array.isArray(categories)) {
      categories.forEach((cat) => cat?.id && !usedCategories.has(cat.id) && warn('categories.json', `id "${cat.id}"`, 'This category has no products yet.'))
    }
    if (products.length && !products.some((p) => Array.isArray(p?.tags) && p.tags.includes('deal-of-the-day'))) {
      warn(F, '', 'No product is tagged "deal-of-the-day", so the Deal of the Day section is hidden.')
    }
  }
}

/* ---------------- Report ---------------- */
const print = (list, label, color) => {
  if (!list.length) return
  console.log('\n' + color(bold(`${label} (${list.length})`)))
  list.forEach((x) => console.log(`  ${color('•')} ${bold(x.file)}${x.where ? dim(` › ${x.where}`) : ''}\n    ${x.msg}`))
}

console.log(bold('\nBranded Factory · data check'))
console.log(dim(`  ${Array.isArray(products) ? products.length : 0} products · ${Array.isArray(categories) ? categories.length : 0} categories`))
print(warnings, 'Warnings', yellow)
print(errors, 'Errors', red)

// Surface problems as annotations in the GitHub Actions UI
if (process.env.GITHUB_ACTIONS) {
  const esc = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
  errors.forEach((x) => console.log(`::error file=public/data/${x.file},title=Data error::${esc(`${x.where ? x.where + ': ' : ''}${x.msg}`)}`))
}

if (errors.length) {
  console.log(red(bold(`\n✗ ${errors.length} error(s) found. Fix them and commit again. The live site has not been changed.\n`)))
  process.exit(1)
}
console.log(green(bold(`\n✓ Data looks good${warnings.length ? ` (${warnings.length} warning(s) to review)` : ''}.\n`)))
