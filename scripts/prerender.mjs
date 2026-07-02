// Post-build: write a static per-route index.html with correct <title>/OG/
// canonical baked into the served markup, AND real page content inside #root
// so crawlers / AI search / no-JS readers see the substance, not an empty div.
// React's createRoot().render() replaces the static content on hydration.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { SITE, metaFor, SITEMAP_ROUTES } from '../src/seo.js'
import { LESSONS, GLOSSARY, CASES, STANDARDS, ERAS, IAM_DIMENSIONS, IAM_MATRIX } from '../src/data.js'

const distDir = new URL('../dist/', import.meta.url)
const template = readFileSync(new URL('index.html', distDir), 'utf8')

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// --- static content blocks per route (plain semantic HTML) -------------------
function lessonHtml(l) {
  return `<article><h1>${esc(l.title)}</h1><p><strong>${esc(l.tldr)}</strong></p>${l.sections
    .map((s) => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`)
    .join('')}<h2>How it changes for AI agents</h2><p>${esc(l.agentTwist)}</p>${
    l.code ? `<h2>In practice</h2><pre>${esc(l.code.body)}</pre>` : ''
  }</article>`
}

const CONTENT = {
  '/glossary': `<article><h1>IAM glossary</h1><dl>${GLOSSARY.map(
    (g) => `<dt>${esc(g.term)}</dt><dd>${esc(g.def)}</dd>`,
  ).join('')}</dl></article>`,
  '/cases': `<article><h1>Case files — agent &amp; NHI incidents</h1>${CASES.map(
    (c) =>
      `<section><h2>${esc(c.title)} (${esc(c.year)})</h2><p>${esc(c.what)}</p><p><strong>Identity angle:</strong> ${esc(c.identity)}</p><p><strong>What stops it:</strong> ${esc(c.stopper)}</p></section>`,
  ).join('')}</article>`,
  '/standards': `<article><h1>Standards shaping agentic IAM</h1><ul>${STANDARDS.map(
    (s) => `<li><strong>${esc(s.name)}</strong> (${esc(s.status)}) — ${esc(s.what)}</li>`,
  ).join('')}</ul></article>`,
  '/journey': `<article><h1>The journey of IAM — seven eras</h1>${ERAS.map(
    (e) =>
      `<section><h2>Era ${e.n}: ${esc(e.title)} (${esc(e.range)})</h2><p>Identity meant: ${esc(e.identity)}</p><p>Stack: ${esc(e.tech.join(', '))}</p><p>${e.here ? 'Open problem' : 'What broke'}: ${esc(e.broke)}</p></section>`,
  ).join('')}</article>`,
  '/compare': `<article><h1>Hermes Agent vs OpenClaw — IAM comparison</h1>${IAM_DIMENSIONS.map(
    (d) =>
      `<section><h2>${esc(d.dimension)}</h2><p><strong>Hermes:</strong> ${esc(d.hermes)}</p><p><strong>OpenClaw:</strong> ${esc(d.openclaw)}</p></section>`,
  ).join('')}<h2>Control matrix</h2><ul>${IAM_MATRIX.map(
    (r) => `<li>${esc(r.control)} — Hermes: ${r.hermes}, OpenClaw: ${r.openclaw}</li>`,
  ).join('')}</ul></article>`,
}

function contentFor(route) {
  if (CONTENT[route]) return CONTENT[route]
  if (route.startsWith('/learn/')) {
    const l = LESSONS.find((x) => x.slug === route.replace('/learn/', ''))
    if (l) return lessonHtml(l)
  }
  return ''
}

function render(route) {
  const { title, description } = metaFor(route)
  const fullTitle = esc(`${title} · ${SITE.name}`)
  const desc = esc(description)
  const url = SITE.baseUrl + route
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${fullTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  const content = contentFor(route)
  if (content) {
    // Inside #root: crawlers see it; React clears it on mount.
    html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  }
  return html
}

let n = 0
let withContent = 0
for (const route of SITEMAP_ROUTES) {
  if (route === '/') continue // keep the branded default in dist/index.html
  const dir = new URL(`.${route}/`, distDir)
  mkdirSync(dir, { recursive: true })
  writeFileSync(new URL('index.html', dir), render(route))
  n++
  if (contentFor(route)) withContent++
}
console.log(`prerender: ${n} routes (${withContent} with static content)`)
