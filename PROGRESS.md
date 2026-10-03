# PROGRESS.md: Branded Factory

## Goals
- Premium, modern, trustworthy storefront UI that reinforces savings (Bumper Discounts · Assured Savings · Greatest Deals)
- JSON-driven catalog (`public/data/*.json`) editable by a non-developer on github.com
- WhatsApp ordering (enquiry list → pre-filled WhatsApp message to +91 72181 50034)
- Automatic deploys to GitHub Pages via GitHub Actions, with data validation before every build
- Owner-friendly maintenance (README, validation script)
- Lighthouse 90+ on Performance, Accessibility, Best Practices and SEO

## Milestones
- [x] 1. Project setup: Vite, React, Tailwind, router, fonts, folder structure, CLAUDE.md, PROGRESS.md (2026-10-03)
- [x] 2. Data layer and sample JSON (10+ categories, ~40 products, placeholder images) (2026-10-03)
- [ ] 3. Global layout: announcement bar, header, mega-menu, mobile bottom nav, footer, floating WhatsApp button
- [ ] 4. Home page (all sections)
- [ ] 5. Category, shop and search pages with filters and sorting
- [ ] 6. Product detail page
- [ ] 7. Enquiry list and WhatsApp message builder
- [ ] 8. About, Contact, FAQ and 404 pages
- [ ] 9. SEO, performance and accessibility pass
- [ ] 10. Data validation script, GitHub Actions deployment, `.nojekyll`
- [ ] 11. Owner README
- [ ] 12. Final QA: build, test all routes, WhatsApp links and mobile layouts

## Current status
Data layer complete: 12 categories and 45 sample products in `public/data/`, 106 generated SVG placeholders, `src/lib/data.js` + `utils.js`, Data/Enquiry/Toast contexts and hooks. Next up: global layout.

## Next steps
1. Announcement bar, sticky glass header with search suggestions and mega-menu
2. Mobile bottom nav and slide-in drawer
3. Footer and floating WhatsApp button
4. Route skeleton with lazy-loaded pages and page transitions

## Decisions log
- 2026-10-03: Using **HashRouter** because GitHub Pages has no server-side routing (deep links/refresh would 404).
- 2026-10-03: `base: '/branded-factory/'` in Vite, with all runtime URLs resolved through `import.meta.env.BASE_URL`.
- 2026-10-03: **Tailwind v3** (JS config file) rather than v4, so design tokens live in a familiar `tailwind.config.js`.
- 2026-10-03: **Embla Carousel** over Swiper: smaller bundle, headless, easy to style.
- 2026-10-03: Fonts **Fraunces** (headings) + **Manrope** (body).
- 2026-10-03: lucide-react v1 dropped brand icons, so WhatsApp/Instagram/Facebook icons are small inline SVG components.
- 2026-10-03: Enquiry list stores only `{id, qty}` in localStorage so prices always come from the latest products.json.
- 2026-10-03: Discount % is rounded **down** so savings are never overstated.
- 2026-10-03: JSON is fetched with `cache: 'no-cache'` so edits show right after deploy.
- 2026-10-03: Discount badges use `coral-600` (#C9363B) rather than #E5484D so white text meets WCAG AA.

## Known issues / TODO
- Owner to fill in: business address, email, social links, real product photos, FAQ/About copy (placeholders marked).

## Changelog
- 2026-10-03: Data layer: sample JSON (12 categories, 45 products), SVG placeholder generator (`npm run generate-placeholders`), DataContext/EnquiryContext/ToastContext, `useCatalog`/`useSite`/`useCategories`/`useProducts`/`useProduct`/`useEnquiry`/`useToast`, SmartImage with branded fallback, skeleton loaders.
- 2026-10-03: Project setup (Vite, React 18, Tailwind tokens, HashRouter shell, fonts, favicon, manifest, CLAUDE.md, PROGRESS.md).
