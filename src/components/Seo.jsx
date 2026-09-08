import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, metaFor } from '../seo.js'

// Dependency-free head manager: updates <title>, description, canonical, and
// Open Graph / Twitter tags on each route change.
function setTag(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const m = selector.match(/\[([a-z]+)="([^"]+)"\]/)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function removeTag(selector) {
  document.head.querySelector(selector)?.remove()
}

function apply({ title, description, noindex }, pathname) {
  const fullTitle = `${title} · ${SITE.name}`
  const url = SITE.baseUrl + pathname
  document.title = fullTitle
  setTag('meta[name="description"]', 'content', description)
  setTag('link[rel="canonical"]', 'href', url)
  setTag('meta[property="og:title"]', 'content', fullTitle)
  setTag('meta[property="og:description"]', 'content', description)
  setTag('meta[property="og:url"]', 'content', url)
  setTag('meta[property="og:type"]', 'content', 'website')
  setTag('meta[property="og:image"]', 'content', SITE.ogImage)
  setTag('meta[name="twitter:card"]', 'content', 'summary_large_image')
  setTag('meta[name="twitter:image"]', 'content', SITE.ogImage)
  setTag('meta[name="twitter:title"]', 'content', fullTitle)
  setTag('meta[name="twitter:description"]', 'content', description)
  // Unknown routes must not be indexed, and must not claim a canonical of
  // their own — otherwise every typo'd URL becomes a duplicate of the site.
  if (noindex) {
    setTag('meta[name="robots"]', 'content', 'noindex, follow')
    removeTag('link[rel="canonical"]')
  } else {
    removeTag('meta[name="robots"]')
  }
}

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    let cancelled = false
    // Lesson metadata lives in data.js, which is intentionally kept out of the
    // main bundle. The lesson route chunk is already loading it, so this
    // dynamic import resolves against the same in-flight chunk.
    if (pathname.startsWith('/learn/')) {
      import('../data.js').then(({ LESSONS }) => {
        if (!cancelled) apply(metaFor(pathname, LESSONS), pathname)
      })
    } else {
      apply(metaFor(pathname), pathname)
    }
    return () => { cancelled = true }
  }, [pathname])
  return null
}
