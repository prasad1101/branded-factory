/**
 * Vite plugin: lets index.html start downloading the JavaScript for the page in the URL
 * (e.g. #/product/bf-0001 → Product chunk) without waiting for the main bundle to run first.
 * This removes one network round trip for visitors who land on a deep link (shared product links).
 *
 * It replaces the ROUTE_CHUNKS comment placeholder in index.html with { routeName: [chunk files] }.
 */
const ROUTES = {
  Categories: ['categories'],
  Category: ['category'],
  Shop: ['shop', 'search'],
  Product: ['product'],
  Enquiry: ['enquiry'],
  About: ['about'],
  Contact: ['contact'],
  Faq: ['faq'],
}

export default function routePreload() {
  return {
    name: 'bf-route-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const chunks = Object.values(ctx.bundle).filter((c) => c.type === 'chunk')
        const byName = Object.fromEntries(chunks.map((c) => [c.fileName, c]))
        const map = {}
        for (const chunk of chunks) {
          const match = chunk.facadeModuleId && chunk.facadeModuleId.match(/src\/pages\/(\w+)\.jsx$/)
          if (!match || !ROUTES[match[1]]) continue
          // The page chunk plus its static imports (shared components), minus the entry bundle
          const files = new Set([chunk.fileName])
          const walk = (c) =>
            c.imports.forEach((f) => {
              if (files.has(f) || byName[f]?.isEntry) return
              files.add(f)
              if (byName[f]) walk(byName[f])
            })
          walk(chunk)
          ROUTES[match[1]].forEach((route) => (map[route] = [...files]))
        }
        return html.replace('/*ROUTE_CHUNKS*/ null', JSON.stringify(map))
      },
    },
  }
}
