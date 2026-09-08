// Content-integrity tests. data.js is the factual backbone of the site, and it
// is edited far more often than the components — these catch the mistakes that
// actually happen: a renamed slug leaving dead links, a route with no SEO
// metadata, a quiz answer pointing past the end of its options list.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { LESSONS, GLOSSARY, LEARNING_PATHS, CASES, STANDARDS, VERIFIED, METHODOLOGY, HERMES_LAYERS, THREATS, AGENTS } from '../src/data.js'
import { PAGE_META, metaFor, NOT_FOUND_META } from '../src/seo.js'
import { ALL_ROUTES, SITEMAP_ROUTES } from '../src/seo-build.js'
import { PAGES } from '../src/nav.js'

const lessonRoutes = LESSONS.map((l) => `/learn/${l.slug}`)
const knownRoutes = new Set([...Object.keys(PAGE_META), ...lessonRoutes, ...PAGES.map((p) => p.path)])

describe('lessons', () => {
  it('have unique, url-safe slugs', () => {
    const slugs = LESSONS.map((l) => l.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('carry the fields the Lesson page renders', () => {
    for (const l of LESSONS) {
      expect(l, l.slug).toMatchObject({
        title: expect.any(String),
        tldr: expect.any(String),
        icon: expect.any(String),
        level: expect.any(String),
        agentTwist: expect.any(String),
      })
      expect(l.sections.length, l.slug).toBeGreaterThan(0)
      expect(l.quiz.length, l.slug).toBeGreaterThan(0)
      expect(l.related.length, l.slug).toBeGreaterThan(0)
    }
  })

  it('have quiz answers that index into their options', () => {
    for (const l of LESSONS) {
      for (const q of l.quiz) {
        expect(q.options.length, `${l.slug}: ${q.q}`).toBeGreaterThan(1)
        expect(q.answer, `${l.slug}: ${q.q}`).toBeGreaterThanOrEqual(0)
        expect(q.answer, `${l.slug}: ${q.q}`).toBeLessThan(q.options.length)
      }
    }
  })
})

describe('internal links', () => {
  it('resolve from lesson "related" blocks', () => {
    for (const l of LESSONS) {
      for (const r of l.related) expect(knownRoutes.has(r.to), `${l.slug} → ${r.to}`).toBe(true)
    }
  })

  it('resolve from learning paths', () => {
    for (const path of LEARNING_PATHS) {
      for (const step of path.steps) {
        expect(knownRoutes.has(step.to), `${path.id} → ${step.to}`).toBe(true)
      }
    }
  })
})

describe('seo', () => {
  it('gives every sitemap route real metadata, not the 404 fallback', () => {
    for (const route of SITEMAP_ROUTES) {
      const meta = metaFor(route, LESSONS)
      expect(meta, route).not.toBe(NOT_FOUND_META)
      expect(meta.title.length, route).toBeGreaterThan(10)
      expect(meta.description.length, route).toBeGreaterThan(50)
    }
  })

  it('uses a unique title per page', () => {
    const titles = SITEMAP_ROUTES.map((r) => metaFor(r, LESSONS).title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('falls back to noindex 404 metadata for unknown routes', () => {
    expect(metaFor('/nope', LESSONS)).toBe(NOT_FOUND_META)
    expect(metaFor('/learn/not-a-lesson', LESSONS)).toBe(NOT_FOUND_META)
    expect(NOT_FOUND_META.noindex).toBe(true)
  })
})

describe('worker route allowlist', () => {
  // The Worker returns 404 for anything outside generated/routes.js. If that
  // file goes stale, real pages start 404ing — so assert it is regenerated.
  it('is in sync with the route list (run `npm run prebuild` if this fails)', () => {
    const generated = readFileSync(new URL('../generated/routes.js', import.meta.url), 'utf8')
    for (const route of ALL_ROUTES) {
      expect(generated, `missing ${route}`).toContain(`"${route}"`)
    }
  })
})

describe('reference content', () => {
  it('has unique glossary terms', () => {
    const terms = GLOSSARY.map((g) => g.term)
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('gives every case file and standard a description', () => {
    for (const c of CASES) expect(c.title, JSON.stringify(c).slice(0, 60)).toBeTruthy()
    for (const s of STANDARDS) expect(s.what.length, s.name).toBeGreaterThan(20)
  })
})

describe('freshness', () => {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  it('has a verification label that matches its date', () => {
    const [y, m] = VERIFIED.date.split('-')
    expect(VERIFIED.label).toBe(`${MONTHS[Number(m) - 1]} ${y}`)
  })

  it('states the verification date in one place only', () => {
    // Components must read VERIFIED rather than hardcoding a month, which is
    // how "June 2026" survived on three pages after the July fact-check.
    const files = ['Sources', 'Standards', 'Journey', 'Compare']
    for (const f of files) {
      const src = readFileSync(new URL(`../src/components/${f}.jsx`, import.meta.url), 'utf8')
      expect(src, `${f}.jsx hardcodes a date`).not.toMatch(/\b(January|February|March|April|May|June|July|August|September|October|November|December) 20\d\d\b/)
    }
  })

  it('explains the rating scale', () => {
    expect(METHODOLOGY.length).toBeGreaterThanOrEqual(3)
    for (const m of METHODOLOGY) expect(m.p.length, m.h).toBeGreaterThan(100)
  })
})

describe('the Hermes layer model', () => {
  // Hermes went from 7 to 8 layers between the July and September fact-checks.
  // The layer count is referenced by the diagram, the game's keyboard handler,
  // the threat mapping, and the copy — so assert they cannot fall out of step.
  it('maps every threat to a layer that exists', () => {
    for (const t of THREATS) {
      expect(t.layer, t.id).toBeGreaterThanOrEqual(1)
      expect(t.layer, t.id).toBeLessThanOrEqual(HERMES_LAYERS.length)
    }
  })

  it('gives every layer at least one threat, so the game can teach it', () => {
    const covered = new Set(THREATS.map((t) => t.layer))
    for (let i = 1; i <= HERMES_LAYERS.length; i++) {
      expect(covered.has(i), `layer ${i} (${HERMES_LAYERS[i - 1].short}) has no threat`).toBe(true)
    }
  })

  it('states the layer count consistently in prose', () => {
    const n = HERMES_LAYERS.length
    expect(AGENTS.hermes.iamModel).toContain(`${n}-layer`)
    // No page may spell the count out — it drifts. Read HERMES_LAYERS instead.
    const words = /\b(\d+|three|four|five|six|seven|eight|nine|ten)[- ](layers?\b|defensive layers\b)/i
    for (const f of ['Architecture', 'Game']) {
      const src = readFileSync(new URL(`../src/components/${f}.jsx`, import.meta.url), 'utf8')
      expect(src, `${f}.jsx spells out the layer count`).not.toMatch(words)
    }
  })
})
