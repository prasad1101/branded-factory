# CLAUDE.md: Branded Factory project memory

Read this file and `PROGRESS.md` at the start of every session, then continue from where the last session stopped.

## Project summary
**Branded Factory** is a premium online store for **original branded fashion**: sneakers, sports shoes, slides, men's/women's clothing, activewear, bags, watches, accessories, skincare and fragrances (Nike, Adidas, Puma…). No grocery/household items (owner decision, 2026-10-03).
Brand promise: **Bumper Discounts · Assured Savings · Greatest Deals**. The UI should feel like a luxury retailer having a sale: premium and trustworthy, with discounts loud and clear.

- No backend, no payment gateway. Customers build an **enquiry list** (cart replacement) and send it via **WhatsApp**.
- WhatsApp number: **+91 72181 50034**, stored as `"whatsappNumber": "917218150034"` in `public/data/site.json`.
- All catalog content lives in JSON under `public/data/`, fetched at runtime. The owner edits JSON on GitHub → GitHub Actions validates, builds and deploys.
- Repo: https://github.com/prasad1101/branded-factory · Live: https://prasad1101.github.io/branded-factory/

## Tech stack
- Vite + React 18 (JavaScript, **no TypeScript**)
- React Router v6 with **HashRouter**
- Tailwind CSS v3 (`tailwind.config.js` holds design tokens)
- Framer Motion via **`LazyMotion` + `m` components** (features load async from `src/lib/motionFeatures.js`), wrapped in `<MotionConfig reducedMotion="user">`. Always import `m`, never `motion` (LazyMotion runs in `strict` mode and will throw).
- lucide-react icons (v1 has **no brand icons**, so WhatsApp/Instagram/Facebook are custom SVGs in `src/components/BrandIcons.jsx`)
- Embla Carousel (`embla-carousel-react` + autoplay) for carousels
- Fuse.js for fuzzy search, loaded on demand on first search (`src/lib/search.js`, `useProductSearch(enabled)`)
- react-helmet-async for per-page `<title>`/meta (via `src/components/Seo.jsx`)

## Folder structure
```
public/
  data/site.json, categories.json, products.json   ← owner-editable content
  images/products|categories|banners/              ← images (SVG placeholders shipped)
  .nojekyll, favicon.svg, manifest.webmanifest, icons/
scripts/
  validate-data.js          ← `npm run validate-data` (runs in CI before build)
  generate-placeholders.js  ← regenerates sample SVG placeholder images
  vite-route-preload.js     ← Vite plugin: injects route→chunk map into index.html for modulepreload
src/
  App.jsx                   ← providers + routes (lazy-loaded pages)
  components/               ← reusable UI (ProductCard, PriceBlock, DiscountBadge, ...)
  components/layout/        ← AnnouncementBar, Header, MegaMenu, MobileNav, Footer, ...
  context/                  ← DataContext (JSON cache), EnquiryContext (list), ToastContext
  hooks/                    ← useProducts, useCategories, useSite, useFilters, ...
  lib/data.js               ← fetches + caches JSON, derives computed fields
  lib/utils.js              ← discount calc, INR formatting, WhatsApp builder, asset URL resolver
  pages/                    ← one file per route
.github/workflows/deploy.yml
```

## Design tokens
| Token | Value | Use |
|---|---|---|
| `navy` | `#0F1B2D` | base, headings, primary buttons |
| `gold` | `#C9A24B` | premium accents (use `gold-700` for gold **text** on light bg for contrast) |
| `coral-600` | `#C9363B` | discount badges (white text, AA contrast) |
| `save` | `#15803D` | "You save ₹X" |
| `cream` | `#FAF7F2` | page background |
| `ink` / `ink-muted` | `#1B2333` / `#5B6577` | body text |
| `whatsapp-dark` | `#0F7C70` | WhatsApp buttons (white text) |

Fonts: **Fraunces** (serif headings, `font-serif`) and **Manrope** (body, `font-sans`), loaded from Google Fonts in `index.html`.
Shared component classes in `src/index.css`: `container-px`, `btn-primary`, `btn-gold`, `btn-outline`, `btn-whatsapp`, `chip`, `eyebrow`, `input`, `skeleton`.

## Data schemas
**site.json**: `storeName, tagline, whatsappNumber, phoneDisplay, currency, announcementBar[], heroBanners[{id,eyebrow?,title,subtitle,image,ctaText,ctaLink}], socialLinks{instagram,facebook}, address, email, businessHours, about, aboutValues[{title,text}], faq[{q,a}], footerNote`
- FAQ answers may contain `[EDIT: ...]` placeholders; the FAQ page highlights them so the owner notices.

**categories.json**: `[{ id, name, image, description, featured, order }]` (`featured: true` = show a showcase row on the home page)

**products.json**: `[{ id, name, brand, category, subcategory, mrp, price, size?, sizes?[], unavailableSizes?[], colors?[{name, hex, images?[]}], images[], shortDescription, description, highlights[], tags[], inStock, featured, rating, dateAdded }]`
- `sizes` (clothing/footwear) must be chosen before Add/Order; `size` is a fixed pack size (e.g. "100 ml"). `unavailableSizes` ⊆ `sizes` are shown sold out. `colors[0]` is the default; a colour's optional `images` replace the gallery.
- Enquiry lines are keyed by `id|size|color` (`lineKey()` in EnquiryContext); WhatsApp lines read `Brand Name (Size UK 9, Black) × 1 — ₹6,497`.
- Tags with special meaning: `bestseller`, `deal-of-the-day`, `new`.
- `discountPercent` and `savings` are **computed** in `src/lib/data.js` (`enrichProduct`) via `utils.getDiscount()`. Never stored in JSON.

## Rules to never break
1. **HashRouter only.** GitHub Pages has no server-side routing; BrowserRouter would 404 on refresh.
2. **`base: '/branded-factory/'`** in `vite.config.js`. All runtime asset/data URLs go through `assetUrl()` in `src/lib/utils.js`, which prefixes `import.meta.env.BASE_URL`. Change base to `'/'` only if a custom domain is added.
3. **Discount % and savings are always calculated from `mrp` and `price`**, never typed manually.
4. **The WhatsApp number is only read from `site.json`** (via `useSite()`); never hardcode it in components.
5. Prices are formatted with `formatINR()` (`Intl.NumberFormat('en-IN')`, e.g. ₹1,23,456).
6. WhatsApp messages are URL-encoded with `encodeURIComponent` (`buildWhatsAppUrl()`).
7. Missing images fall back to the branded placeholder (`<SmartImage>`), never a broken icon.
8. Keep `npm run build` and `npm run validate-data` passing before every commit.

## Performance architecture (keep these when editing)
- `index.html` has an inline script that (1) starts fetching the 3 JSON files (`window.__BF_PRELOAD__`, consumed once by `lib/data.js`), (2) modulepreloads the current route's chunks (map injected at build time by `scripts/vite-route-preload.js`), (3) preloads the first hero banner on home / the product's first image on product pages.
- Google Fonts load non-blocking (`rel=preload` + `onload`).
- Home is imported eagerly; other routes are `React.lazy`.
- Long pages wrap below-the-fold sections in `<Deferred>` (mounts near the viewport).
- No entrance animation on the very first render (Layout page transition, hero text, product grid) because hidden-until-animated content delays LCP.
- `SmartImage` with `eager` renders immediately (no fade-in) for LCP.
- Placeholder SVGs avoid `feGaussianBlur` (costly to rasterise on phones).

## Coding conventions
- Functional components + hooks, named default exports per file, PascalCase component files.
- Tailwind utility classes; reuse the component classes above rather than inventing new colours.
- Routes are lazy-loaded with `React.lazy` in `App.jsx`.
- Filter/sort state lives in the URL query string (`useFilters` hook).
- localStorage keys: `bf_enquiry_v1`, `bf_recent_v1`, `bf_customer_v1`. Always wrap access in try/catch.
- Respect `prefers-reduced-motion` (MotionConfig + CSS media query).
- Headings must not skip levels (Lighthouse a11y): listing grids include a sr-only `<h2>`.

## Deployment
- `.github/workflows/deploy.yml`: on push to `main` → `npm ci` → `npm run validate-data` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`.
- GitHub Settings → Pages → Source must be **GitHub Actions**.

## Workflow per milestone
Build → update `PROGRESS.md` (tick milestone, status, next steps, changelog) → commit (`feat: ... (milestone N)`) → push to `main`.
