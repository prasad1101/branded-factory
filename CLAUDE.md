# CLAUDE.md: Branded Factory project memory

Read this file and `PROGRESS.md` at the start of every session, then continue from where the last session stopped.

## Project summary
**Branded Factory** is a premium online supermart storefront (branded skincare, household, grocery, etc.).
Brand promise: **Bumper Discounts · Assured Savings · Greatest Deals**. The UI should feel like a luxury retailer having a sale: premium and trustworthy, with discounts loud and clear.

- No backend, no payment gateway. Customers build an **enquiry list** (cart replacement) and send it via **WhatsApp**.
- WhatsApp number: **+91 72181 50034**, stored as `"whatsappNumber": "917218150034"` in `public/data/site.json`.
- All catalog content lives in JSON under `public/data/`, fetched at runtime. The owner edits JSON on GitHub → GitHub Actions validates, builds and deploys.
- Repo: https://github.com/prasad1101/branded-factory · Live: https://prasad1101.github.io/branded-factory/

## Tech stack
- Vite + React 18 (JavaScript, **no TypeScript**)
- React Router v6 with **HashRouter**
- Tailwind CSS v3 (`tailwind.config.js` holds design tokens)
- Framer Motion (wrapped in `<MotionConfig reducedMotion="user">`)
- lucide-react icons (v1 has **no brand icons**, so WhatsApp/Instagram/Facebook are custom SVGs in `src/components/BrandIcons.jsx`)
- Embla Carousel (`embla-carousel-react` + autoplay) for carousels
- Fuse.js for fuzzy search
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
| `whatsapp-dark` | `#128C7E` | WhatsApp buttons (white text) |

Fonts: **Fraunces** (serif headings, `font-serif`) and **Manrope** (body, `font-sans`), loaded from Google Fonts in `index.html`.
Shared component classes in `src/index.css`: `container-px`, `btn-primary`, `btn-gold`, `btn-outline`, `btn-whatsapp`, `chip`, `eyebrow`, `input`, `skeleton`.

## Data schemas
**site.json**: `storeName, tagline, whatsappNumber, currency, announcementBar[], heroBanners[{id,title,subtitle,eyebrow?,image,ctaText,ctaLink,theme?}], socialLinks{instagram,facebook}, address, email, phoneDisplay, about, footerNote`

**categories.json**: `[{ id, name, image, description, featured, order }]`

**products.json**: `[{ id, name, brand, category, subcategory, mrp, price, size, images[], shortDescription, description, highlights[], tags[], inStock, featured, rating, dateAdded }]`
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

## Coding conventions
- Functional components + hooks, named default exports per file, PascalCase component files.
- Tailwind utility classes; reuse the component classes above rather than inventing new colours.
- Routes are lazy-loaded with `React.lazy` in `App.jsx`.
- Filter/sort state lives in the URL query string (`useFilters` hook).
- localStorage keys: `bf_enquiry_v1`, `bf_recent_v1`, `bf_customer_v1`. Always wrap access in try/catch.
- Respect `prefers-reduced-motion` (MotionConfig + CSS media query).

## Deployment
- `.github/workflows/deploy.yml`: on push to `main` → `npm ci` → `npm run validate-data` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`.
- GitHub Settings → Pages → Source must be **GitHub Actions**.

## Workflow per milestone
Build → update `PROGRESS.md` (tick milestone, status, next steps, changelog) → commit (`feat: ... (milestone N)`) → push to `main`.
