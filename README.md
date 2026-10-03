# Branded Factory

**Bumper Discounts · Assured Savings · Greatest Deals**

This is the website for Branded Factory, an online store for **original branded fashion**: sneakers, clothing, activewear, bags, watches, accessories, skincare and fragrances (Nike, Adidas, Puma and more). Customers browse products, **pick a size and colour**, add them to an **enquiry list**, and send the list to you on **WhatsApp**. There is no online payment and no database.

- **Live site:** https://prasad1101.github.io/branded-factory/
- **WhatsApp orders go to:** +91 72181 50034

Everything you'll want to change (products, categories, banners, messages, phone number) lives in three files. You can edit them in your web browser on github.com, and the website updates itself in about 2 minutes. **You don't need to know how to code.**

---

## Contents

1. [The 3 files you'll edit](#1-the-3-files-youll-edit)
2. [How to edit a file on github.com](#2-how-to-edit-a-file-on-githubcom)
3. [Add a new product](#3-add-a-new-product)
4. [Edit or remove a product](#4-edit-or-remove-a-product)
5. [Upload product images](#5-upload-product-images)
6. [Add a category](#6-add-a-category)
7. [Change banners, announcements, WhatsApp number and contact details](#7-change-banners-announcements-whatsapp-number-and-contact-details)
8. [Edit the FAQ and About text](#8-edit-the-faq-and-about-text)
9. [How publishing works (and what to do if it fails)](#9-how-publishing-works-and-what-to-do-if-it-fails)
10. [First-time setup: turn on GitHub Pages](#10-first-time-setup-turn-on-github-pages)
11. [Run the site on your own computer (optional)](#11-run-the-site-on-your-own-computer-optional)
12. [Things to fill in before launch](#12-things-to-fill-in-before-launch)

---

## 1. The 3 files you'll edit

| File | What's in it |
|---|---|
| [`public/data/products.json`](public/data/products.json) | Every product: name, brand, prices, images, description… |
| [`public/data/categories.json`](public/data/categories.json) | The list of categories (Sneakers, Men's Clothing, Bags, …) |
| [`public/data/site.json`](public/data/site.json) | Store name, WhatsApp number, banners, announcement messages, address, email, FAQ, About text |

Images go in [`public/images/`](public/images/):

```
public/images/products/     ← product photos
public/images/categories/   ← category pictures
public/images/banners/      ← big home-page banners
```

> **Discounts are calculated automatically.** You only type the **MRP** and the **selling price**. The website works out the "% OFF" badge and the "You save ₹X" line, so they're always correct.

### JSON in 30 seconds

These files use a format called JSON. The rules that matter:

- Text goes in **"double quotes"**. Numbers (prices) and `true` / `false` do **not**.
- Items in a list are separated by **commas**, but there's **no comma after the last item**.
- Every `{` needs a matching `}` and every `[` needs a matching `]`.

Don't worry about breaking the site: every change is checked automatically before it goes live (see [section 9](#9-how-publishing-works-and-what-to-do-if-it-fails)).

---

## 2. How to edit a file on github.com

1. Go to https://github.com/prasad1101/branded-factory and sign in.
2. Click into the folders: **public** → **data** → click the file (for example `products.json`).
3. Click the **pencil icon ✏️** ("Edit this file") at the top right of the file.
4. Make your change.
5. Click the green **Commit changes…** button, type a short note (e.g. "Add Nike running shoes"), and click **Commit changes** again.
6. Wait about 2 minutes, then refresh the website.

**Tip:** to find a product quickly in a long file, press `Ctrl + F` (Windows) or `Cmd + F` (Mac) while editing and type its name or ID.

---

## 3. Add a new product

1. Open `public/data/products.json` and click the pencil ✏️.
2. Scroll to the **very end** of the file. The last lines look like this:

   ```json
       "dateAdded": "2026-09-20"
     }
   ]
   ```

3. Type a **comma** right after that last `}` (so it becomes `},`), then paste the template below on the next line, **before** the final `]`.
4. Fill in your details and commit.

### Copy-paste product template

```json
  {
    "id": "bf-0046",
    "name": "Men's Running Shoes",
    "brand": "Nike",
    "category": "sports-shoes",
    "subcategory": "Running",
    "mrp": 7995,
    "price": 4797,
    "sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    "unavailableSizes": ["UK 11"],
    "colors": [
      { "name": "Black", "hex": "#1F1F1F" },
      { "name": "White", "hex": "#F4F4F2" }
    ],
    "images": [
      "images/products/bf-0046-1.jpg",
      "images/products/bf-0046-2.jpg"
    ],
    "shortDescription": "One line that sells the product.",
    "description": "A longer description: material, fit, how it feels, who it is for.",
    "highlights": [
      "100% original, brand-sealed box",
      "Breathable mesh upper",
      "Easy exchange for size (see FAQ)"
    ],
    "tags": ["bestseller"],
    "inStock": true,
    "featured": false,
    "rating": 4.5,
    "dateAdded": "2026-10-03"
  }
```

**For items without sizes** (skincare, perfume, bags, watches): leave out `sizes`, `unavailableSizes` and `colors` (or keep `colors` if it comes in several colours), and use `"size"` for the pack size instead, e.g. `"size": "100 ml"`.

### What each field means

| Field | Required? | What to write |
|---|---|---|
| `id` | ✅ | A unique code. Continue the pattern: `bf-0046`, `bf-0047`, … **Never reuse an ID.** |
| `name` | ✅ | Product name as customers should see it. |
| `brand` | ✅ | Brand name. Customers can filter by brand. |
| `category` | ✅ | Must exactly match an `id` from `categories.json`, e.g. `sneakers`, `men-clothing`, `bags`, `skincare`. |
| `subcategory` | recommended | A type within the category, e.g. `Running`, `T-Shirts`, `Jeans`, `Backpacks`. Used for the "Type" filter. |
| `mrp` | ✅ | The MRP on the tag/box. **Number only**, no ₹, no quotes: `7995` |
| `price` | ✅ | Your selling price. Must be **less than or equal to** MRP. |
| `sizes` | for clothing & footwear | The sizes customers choose from, in order: `["S", "M", "L", "XL"]`, `["UK 6", "UK 7", "UK 8"]`, `["28", "30", "32"]`. Customers must pick one before ordering. |
| `unavailableSizes` | optional | Sizes that are sold out right now, e.g. `["UK 11"]`. They show crossed out and can't be chosen. Spelling must match `sizes` exactly. Delete the line (or use `[]`) when everything is back. |
| `colors` | optional | Colours customers choose from: `[{ "name": "Black", "hex": "#1F1F1F" }]`. `hex` is the swatch colour (find codes at [htmlcolorcodes.com](https://htmlcolorcodes.com)). Optional per colour: `"images": ["images/products/bf-0046-red-1.jpg"]` to show different photos for that colour. |
| `size` | for other items | One fixed size like `"100 ml"`, `"30 L"`, `"43 mm"`, `"One size"`. Shown on the product and in WhatsApp orders. |
| `images` | recommended | List of image paths (first one is the main photo). See [section 5](#5-upload-product-images). If empty `[]`, a tasteful placeholder is shown. |
| `shortDescription` | recommended | One short line shown near the price. |
| `description` | optional | Longer text. Start a new paragraph by typing `\n\n` inside the text. |
| `highlights` | optional | Short bullet points shown with green ticks. |
| `tags` | optional | Special labels (see below). Use `[]` for none. |
| `inStock` | ✅ | `true` or `false`. When `false`, the button changes to "Ask about availability on WhatsApp". |
| `featured` | optional | `true` shows it in "Featured Products" on the home page and ranks it higher. |
| `rating` | optional | A number from 0 to 5, e.g. `4.5`. Use `0` to hide stars. |
| `dateAdded` | recommended | `"YYYY-MM-DD"`. Newest products appear in "New Arrivals". |

### Special tags

| Tag | Effect |
|---|---|
| `"bestseller"` | "Bestseller" label on the card + appears in the Bestsellers row |
| `"deal-of-the-day"` | Appears in the **Deal of the Day** section (with the countdown to midnight) |
| `"new"` | Just a label for your own use. "New Arrivals" is based on `dateAdded` |

Example with two tags: `"tags": ["bestseller", "deal-of-the-day"]`

---

## 4. Edit or remove a product

**Change a price, mark out of stock, fix a typo:** open `products.json`, find the product (`Ctrl/Cmd + F` its name or ID), change the value, commit.

- Out of stock → change `"inStock": true` to `"inStock": false`
- One size sold out → add it to `"unavailableSizes"`, e.g. `"unavailableSizes": ["UK 9"]`
- New colour → add `{ "name": "Olive", "hex": "#5E6B3A" }` to `"colors"`
- New price → change `"price": 449` to the new number (MRP stays the same unless it changed on the pack)

**Remove a product:** delete everything from its opening `{` to its closing `},`, including the comma. If it's the **last** product in the file, also delete the comma after the product **before** it, so the file still ends with `}` then `]`.

> Tip: instead of deleting, you can set `"inStock": false` to keep the page but stop orders.

---

## 5. Upload product images

### Recommended image sizes

| Image | Size | Format | File size |
|---|---|---|---|
| Product photos | **800 × 800 px** (square) | WebP or JPG | under **200 KB** |
| Category pictures | **600 × 600 px** (square) | WebP or JPG | under 150 KB |
| Home banners | **1600 × 700 px** (wide) | WebP or JPG | under 300 KB |

- Use a plain light background for product photos so the site looks consistent. Shoes look best from the side, facing left; clothing laid flat or on a plain hanger.
- Keep the product in the **centre**. Banners: keep the important part on the **right half** (text sits on the left).
- Free tools to resize/compress: [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com).

### How to name images

Use the product ID, a dash, and a number. **Lowercase, no spaces:**

```
bf-0046-1.jpg   ← main photo (shown first)
bf-0046-2.jpg   ← second photo (shown on hover and in the gallery)
bf-0046-3.jpg   ← more photos if you like
```

> ⚠️ **Names are case-sensitive.** `BF-0046-1.JPG` and `bf-0046-1.jpg` are different files to the website. The checker will warn you if they don't match.

### Upload on github.com

1. Open the folder **public** → **images** → **products**.
2. Click **Add file** → **Upload files**.
3. Drag your images in, then click **Commit changes**.
4. In `products.json`, make sure the product's `images` list uses the same names, e.g.
   `"images": ["images/products/bf-0046-1.jpg", "images/products/bf-0046-2.jpg"]`

**Upload the images first, then add the product** (or do both before the site rebuilds). If a product points to an image that doesn't exist, the update is stopped and the live site stays as it was. That way a listing never goes live with a missing photo.

The sample products use generated `.svg` placeholder pictures. Replace them with your real photos anytime. Just upload the photo and update the path in `products.json` (e.g. change `bf-0001-1.svg` to `bf-0001-1.jpg`).

---

## 6. Add a category

Open `public/data/categories.json`, add a comma after the last `}`, and paste:

```json
  {
    "id": "kids-footwear",
    "name": "Kids' Footwear",
    "image": "images/categories/kids-footwear.jpg",
    "description": "Little sizes, big brands",
    "featured": false,
    "order": 12
  }
```

| Field | What to write |
|---|---|
| `id` | Lowercase letters and hyphens only (`kids-footwear`). This is what products use in their `category` field and what appears in the web address. **Don't change it later**, or products and old links will stop matching. |
| `name` | The name customers see. |
| `image` | A square picture uploaded to `public/images/categories/`. |
| `description` | Short tagline shown on the category page. |
| `featured` | `true` adds a row of this category's products to the home page. |
| `order` | Position in menus and grids (1 = first). |

Then add products with `"category": "kids-footwear"`.

---

## 7. Change banners, announcements, WhatsApp number and contact details

All of these are in `public/data/site.json`.

### Announcement bar (thin strip at the very top)

```json
"announcementBar": [
  "🎉 Bumper discounts on Nike, Adidas, Puma & more",
  "✅ 100% original brands, assured savings",
  "💬 Pick your size & order on WhatsApp"
],
```

Add, remove or reword messages. They rotate every few seconds.

### Home page banners (the big slideshow)

```json
"heroBanners": [
  {
    "id": "b1",
    "eyebrow": "Sneaker week",
    "title": "Iconic Sneakers, Bumper Prices",
    "subtitle": "Nike, Adidas, Puma and more. Up to 50% off MRP.",
    "image": "images/banners/sneakers.jpg",
    "ctaText": "Shop Sneakers",
    "ctaLink": "/category/sneakers"
  }
]
```

- `eyebrow`: small label above the title (optional).
- `ctaText` / `ctaLink`: the button. Useful links:
  - a category: `/category/sneakers`
  - a product: `/product/bf-0001`
  - biggest discounts: `/shop?sort=discount`
  - all products: `/shop`
  - a search: `/search?q=nike`
  - a brand: `/shop?brand=Nike`
  - a size: `/shop?size=UK%209` (`%20` = space)
- Each banner needs a different `id` (`b1`, `b2`, …). The first banner is the one people see first.

### WhatsApp number

```json
"whatsappNumber": "917218150034",
"phoneDisplay": "+91 72181 50034",
```

- `whatsappNumber`: **digits only, with country code (91), no + and no spaces.** Every WhatsApp button on the site uses this.
- `phoneDisplay`: how the number is shown to customers (any format you like).

### Contact details and social links

```json
"address": "Shop No. 4, MG Road, Pune 411001",
"email": "hello@brandedfactory.in",
"businessHours": "Mon–Sun, 9:00 AM – 9:00 PM",
"socialLinks": {
  "instagram": "https://instagram.com/yourpage",
  "facebook": "https://facebook.com/yourpage"
},
```

Leave a value as `""` to hide it (e.g. no email shown if `"email": ""`).

### Other text

- `storeName`, `tagline`: used in page titles and the About page.
- `footerNote`: small print at the bottom of every page.

---

## 8. Edit the FAQ and About text

Also in `site.json`:

- `"about"`: the paragraph on the About page (and in the footer).
- `"aboutValues"`: the three "promise" cards on the About page.
- `"faq"`: a list of questions and answers:

  ```json
  { "q": "Do you deliver on Sundays?", "a": "Yes, between 10 AM and 6 PM." }
  ```

Some answers contain **`[EDIT: …]`** notes, e.g. your size-exchange policy, delivery areas, charges and return policy. These are highlighted in yellow on the FAQ page so you can spot them. **Replace each one with your real policy.** The checker also lists any you've missed.

---

## 9. How publishing works (and what to do if it fails)

Every time you commit a change on the `main` branch:

1. GitHub starts the **"Deploy to GitHub Pages"** job (see the **Actions** tab of the repository).
2. It **checks your data**: duplicate IDs, missing fields, price higher than MRP, a category that doesn't exist, missing images, broken JSON…
3. If everything is fine, it builds and publishes the site, usually **within 2 minutes**.

**If there's a problem, the live site is not changed.** Customers keep seeing the previous version, and you'll see a red ❌ next to your commit (GitHub also emails you).

To fix it:

1. Open the **Actions** tab → click the failed run → click **Validate & build** → open the step **"Validate store data"**.
2. Read the message. It tells you the file, the product and what's wrong, for example:

   ```
   • products.json › item 46 (id "bf-0046") "Men's Running Shoes"
     "price" (8995) is greater than "mrp" (7995). The selling price can't be more than the MRP.
   ```

   or, for a typo in the JSON:

   ```
   • products.json › line 812, column 5
     Invalid JSON: Expected ',' or '}' after property value…
     Tip: check for a missing comma between items…
   ```

3. Edit the file again, fix it, commit. A new run starts automatically.

Yellow **warnings** (e.g. "No size", unfinished FAQ answers) don't stop publishing. They're reminders.

**Seeing the old version after a change?** Wait 2 minutes, then refresh. On phones, pull down to refresh or close and reopen the browser tab.

---

## 10. First-time setup: turn on GitHub Pages

You only do this once.

1. Open https://github.com/prasad1101/branded-factory → **Settings** → **Pages** (left menu).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Go to the **Actions** tab. If the latest "Deploy to GitHub Pages" run failed before Pages was enabled, open it and click **Re-run all jobs**.
4. After about 2 minutes the site is live at https://prasad1101.github.io/branded-factory/

### Using your own domain later (optional)

If you buy a domain (e.g. `www.brandedfactory.in`):

1. In `vite.config.js`, change `base: '/branded-factory/'` to `base: '/'`.
2. Settings → Pages → **Custom domain**: enter your domain and follow GitHub's DNS instructions.
3. In `public/manifest.webmanifest`, change `"/branded-factory/"` to `"/"` (two places), and update the `og:url`/`og:image` addresses in `index.html` and `SITE_URL` in `src/components/Seo.jsx`.

---

## 11. Run the site on your own computer (optional)

Only needed if you (or a developer) want to preview changes before publishing.

1. Install **Node.js 22 or newer** from https://nodejs.org
2. Download the code (green **Code** button → Download ZIP, or `git clone https://github.com/prasad1101/branded-factory.git`).
3. Open a terminal in the folder and run:

   ```bash
   npm install           # first time only
   npm run dev           # starts a preview at http://localhost:5173/branded-factory/
   ```

Other useful commands:

```bash
npm run validate-data          # check the JSON files for mistakes
npm run build                  # build the production site into dist/
npm run preview                # preview the built site
npm run generate-placeholders  # create placeholder .svg images for products that reference missing .svg files
```

### For developers

Vite + React 18 + Tailwind CSS + React Router (HashRouter) + Framer Motion + Embla Carousel + Fuse.js. See [`CLAUDE.md`](CLAUDE.md) for architecture, design tokens and rules, and [`PROGRESS.md`](PROGRESS.md) for status and decisions.

---

## 12. Things to fill in before launch

- [ ] **Real product photos** (replace the sample `.svg` placeholders) and your real catalog, prices and stock in `products.json`. The sample listings use real brand names with made-up prices, so replace or remove them before launch.
- [ ] **Shop address**, **email** and **business hours** in `site.json`
- [ ] **Instagram / Facebook** links in `site.json` (or leave empty to hide)
- [ ] **FAQ answers** marked `[EDIT: …]`: payment options, size guide, size exchange policy, delivery areas & time, delivery charges, return policy
- [ ] Check **sizes**, **sold-out sizes** and **colours** on every clothing/footwear product
- [ ] **About** text (`about` and `aboutValues`) in your own words
- [ ] **Banner images** for the home page (1600 × 700)
- [ ] Check the WhatsApp number: **+91 72181 50034**

---

*Prices and availability are subject to change. All brand names and trademarks belong to their respective owners.*
