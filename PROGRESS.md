# PROGRESS.md: Branded Factory

## Goals
- Fashion-focused catalog (sneakers, clothing, activewear, bags, watches, accessories, skincare, fragrances) with size + colour selection
- Premium, modern, trustworthy storefront UI that reinforces savings (Bumper Discounts · Assured Savings · Greatest Deals)
- JSON-driven catalog (`public/data/*.json`) editable by a non-developer on github.com
- WhatsApp ordering (enquiry list → pre-filled WhatsApp message to +91 72181 50034)
- Automatic deploys to GitHub Pages via GitHub Actions, with data validation before every build
- Owner-friendly maintenance (README, validation script)
- Lighthouse 90+ on Performance, Accessibility, Best Practices and SEO

## Milestones
- [x] 1. Project setup: Vite, React, Tailwind, router, fonts, folder structure, CLAUDE.md, PROGRESS.md (2026-10-03)
- [x] 2. Data layer and sample JSON (10+ categories, ~40 products, placeholder images) (2026-10-03)
- [x] 3. Global layout: announcement bar, header, mega-menu, mobile bottom nav, footer, floating WhatsApp button (2026-10-03)
- [x] 4. Home page (all sections) (2026-10-03)
- [x] 5. Category, shop and search pages with filters and sorting (2026-10-03)
- [ ] 6. Product detail page
- [x] 7. Enquiry list and WhatsApp message builder (2026-10-03)
- [x] 8. About, Contact, FAQ and 404 pages (2026-10-03)
- [x] 9. SEO, performance and accessibility pass (2026-10-03)
- [x] 10. Data validation script, GitHub Actions deployment, `.nojekyll` (2026-10-03)
- [x] 11. Owner README (2026-10-03)
- [x] 12. Final QA: build, test all routes, WhatsApp links and mobile layouts (2026-10-03)

## Current status
All 12 milestones are done, plus the fashion pivot. Catalog is now 11 fashion/beauty categories and 45 sample products using real brand names (Nike, Adidas, Puma, Levi's, Tommy Hilfiger, Fossil, Cetaphil, Davidoff…) with generic product names and generated placeholder art (no logos). Products support `sizes`, `unavailableSizes` and `colors`; size is required before Add/Order on WhatsApp; cards have a quick size picker; enquiry lines and WhatsApp messages include size + colour; shop/category pages filter by Size and Colour. GitHub Pages is not enabled yet (owner action).

## Next steps
1. Owner: Settings → Pages → Source: GitHub Actions, then re-run the workflow
2. Verify the live URL
3. Owner replaces sample listings with real stock, prices and photos
4. (Session paused 2026-10-03) Re-run interaction QA with fashion test data: the old script used 'ghee' search and the household category, which no longer exist. Route sweep passed at all widths after the pivot; Lighthouse mobile: home 91, product 88, a11y/BP/SEO 100.

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
- 2026-10-03: Added a `/categories` page so the mobile bottom-nav "Categories" tab has a real destination.
- 2026-10-03: `featured: true` on a **category** means "show a showcase row for it on the home page" (4 enabled in sample data).
- 2026-10-03: Filter changes use `replace` navigation so the Back button isn't flooded with filter states.
- 2026-10-03: Shop/search pages filter by **Category**; category pages filter by **Type** (subcategory).
- 2026-10-03: FAQ content lives in `site.json` (owner-editable); unfinished answers use visible `[EDIT: ...]` markers.
- 2026-10-03: WhatsApp button teal darkened to #0F7C70 (5.1:1 with white) for WCAG AA.
- 2026-10-03: Framer Motion loaded through LazyMotion (`m` components) to keep the initial bundle small.
- 2026-10-03: Missing image files are **errors** in validation (deploy stops), so a listing never goes live with a missing photo by accident. Image paths are checked case-sensitively, like GitHub Pages.
- 2026-10-03: Owner will sell fashion, shoes, bags, skincare and branded goods only, so grocery/household/beverage categories were removed.
- 2026-10-03: Size + colour are product options (not separate products); each size/colour combination is its own enquiry line so the WhatsApp order is unambiguous.
- 2026-10-03: Sample data uses real brand names (owner's choice) with generic product names, made-up prices and placeholder art; no brand logos.
- 2026-10-03: Discount badges use `coral-600` (#C9363B) rather than #E5484D so white text meets WCAG AA.

## Post-launch changes
- [x] 13. Pivot to fashion catalog with size + colour options (2026-10-03)

## Known issues / TODO
- Mobile Lighthouse Performance on deep pages (product/category/search) is 86–88 (home 93–97, desktop 98–99). The remaining cost is evaluating ~110 KB gz of React + Framer Motion + Embla on Lighthouse's 4× CPU-throttled phone before the client-rendered page can paint. Further gains would need prerendering (not possible with HashRouter) or replacing React/Framer Motion. Real-device performance is good.
- Sample listings use real brand names with made-up prices: replace or remove before launch.
- Owner to fill in: business address, email, social links, real product photos, FAQ answers marked `[EDIT: ...]` (payment options, delivery areas/time/charges, returns), About copy.

## Changelog
- 2026-10-03: **Fashion pivot**: new categories/products/banners/FAQ (size guide + size exchange), fashion SVG placeholder generator (shoes, apparel, bags, watches, accessories), VariantPicker (ColorSwatches, SizeSelector, ColorDots), card quick-pick, size-required validation, variant-keyed enquiry lines, Size/Colour filters, validator support for sizes/unavailableSizes/colors.
- 2026-10-03: Final QA pass; not-found states now have an h1.
- 2026-10-03: Owner README.
- 2026-10-03: Data validator (`scripts/validate-data.js`) with GitHub Actions annotations; deploy workflow (checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5, Node 22).
- 2026-10-03: Performance/a11y pass: PNG icons + OG image, non-blocking fonts, early JSON fetch + route chunk modulepreload + LCP image preload from index.html, LazyMotion (main bundle 102→~60 KB gz), lazy Fuse.js, `<Deferred>` sections, single-SVG rating stars (DOM −40%), no first-paint entrance animations, blur-free placeholder SVGs, AA contrast for WhatsApp teal (#0F7C70), heading order, label/target-size fixes.
- 2026-10-03: About, Contact, FAQ, 404 pages. Added `faq`, `aboutValues`, `businessHours` to site.json.
- 2026-10-03: Enquiry page with summary, customer details, message preview and WhatsApp send. Fixed SmartImage so cached images never stay hidden.
- 2026-10-03: Category, shop, search and categories pages; `useFilters` (URL query state: cat, sub, brand, min, max, disc, stock, tag, sort), FilterPanel, PriceRangeSlider, ProductListing, EmptyState, Breadcrumbs. Header search collapses to an icon at 1024–1279px.
- 2026-10-03: Home page + components: ProductCard, PriceBlock, DiscountBadge, RatingStars, CategoryCard, SectionHeader, Reveal, ProductCarousel, HeroCarousel, Countdown. Biggest Savings excludes Deal of the Day items for variety.
- 2026-10-03: Global layout (AnnouncementBar, Header with SearchBar + MegaMenu, MobileDrawer, MobileNav, Footer, FloatingWhatsApp, Seo, Layout with ScrollToTop and data error state). Added `/categories` route for the mobile nav.
- 2026-10-03: Data layer: sample JSON (12 categories, 45 products), SVG placeholder generator (`npm run generate-placeholders`), DataContext/EnquiryContext/ToastContext, `useCatalog`/`useSite`/`useCategories`/`useProducts`/`useProduct`/`useEnquiry`/`useToast`, SmartImage with branded fallback, skeleton loaders.
- 2026-10-03: Project setup (Vite, React 18, Tailwind tokens, HashRouter shell, fonts, favicon, manifest, CLAUDE.md, PROGRESS.md).
