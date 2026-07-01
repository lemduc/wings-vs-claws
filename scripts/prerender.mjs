// Post-build: write a static per-route index.html with correct <title>/OG/
// canonical baked into the served markup, so social scrapers and crawlers that
// don't execute JS get page-specific cards. Content still hydrates client-side.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { SITE, metaFor, SITEMAP_ROUTES } from '../src/seo.js'

const distDir = new URL('../dist/', import.meta.url)
const template = readFileSync(new URL('index.html', distDir), 'utf8')

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function render(route) {
  const { title, description } = metaFor(route)
  const fullTitle = esc(`${title} · ${SITE.name}`)
  const desc = esc(description)
  const url = SITE.baseUrl + route
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${fullTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
}

let n = 0
for (const route of SITEMAP_ROUTES) {
  if (route === '/') continue // keep the branded default in dist/index.html
  const dir = new URL(`.${route}/`, distDir)
  mkdirSync(dir, { recursive: true })
  writeFileSync(new URL('index.html', dir), render(route))
  n++
}
console.log(`prerender: ${n} routes`)
