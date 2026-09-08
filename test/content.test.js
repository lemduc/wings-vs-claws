// Content-integrity tests. data.js is the factual backbone of the site, and it
// is edited far more often than the components — these catch the mistakes that
// actually happen: a renamed slug leaving dead links, a route with no SEO
// metadata, a quiz answer pointing past the end of its options list.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { LESSONS, GLOSSARY, LEARNING_PATHS, CASES, STANDARDS } from '../src/data.js'
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
