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

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const { title, description } = metaFor(pathname)
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
  }, [pathname])
  return null
}
