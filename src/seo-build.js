// Build-time SEO helpers. Imported only by scripts/ (which run in Node), never
// by the browser bundle — this is the module that is allowed to pull in the
// full data.js content set.
import { LESSONS } from './data.js'
import { PAGE_META, metaFor } from './seo.js'

// All content routes, for the sitemap, the prerenderer, and the Worker's
// 404 handling. Single source of truth for "which paths really exist".
export const SITEMAP_ROUTES = [
  ...Object.keys(PAGE_META),
  ...LESSONS.map((l) => `/learn/${l.slug}`),
]

// Routes that exist but are deliberately kept out of the sitemap.
export const UNLISTED_ROUTES = ['/embed/playground']

export const ALL_ROUTES = [...SITEMAP_ROUTES, ...UNLISTED_ROUTES]

export function metaForBuild(pathname) {
  return metaFor(pathname, LESSONS)
}
