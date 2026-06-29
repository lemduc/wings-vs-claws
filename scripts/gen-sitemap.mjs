// Generates public/sitemap.xml from the route list in src/seo.js.
// Runs automatically on `npm run build` via the prebuild script.
import { writeFileSync } from 'node:fs'
import { SITE, SITEMAP_ROUTES } from '../src/seo.js'

const urls = SITEMAP_ROUTES
  .map((r) => `  <url><loc>${SITE.baseUrl}${r === '/' ? '/' : r}</loc></url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml: ${SITEMAP_ROUTES.length} urls`)
