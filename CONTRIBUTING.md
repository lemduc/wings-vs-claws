# Contributing to Wings vs Claws

Thanks for helping make agentic IAM easier to learn. This is an interactive,
source-grounded learning hub — contributions that add accuracy, clarity, or
hands-on interactivity are very welcome.

## Ways to contribute

- **Suggest or improve a lesson** — open a *Content suggestion* issue, or PR a new
  entry in `src/data.js` (`LESSONS`). Each lesson needs a flow diagram, a
  "how it changes for agents" twist, and a short quiz.
- **Add a glossary term, case file, or standard** — `GLOSSARY`, `CASES`, and
  `STANDARDS` in `src/data.js`.
- **Fix or source a claim** — every factual claim should trace to a primary source.
  If something is wrong or stale, cite the correction.
- **File a bug** — use the *Bug report* template with repro steps.

## Ground rules

- **Stay sourced.** Prefer official docs / specs / primary research over blog
  summaries. Label anything illustrative as illustrative.
- **Keep the voice** — concise, code-geek, beginner-friendly (progressive disclosure).
- **No fabricated benchmarks or ratings.**

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # generates sitemap + RSS, then builds to dist/
```

The build regenerates `public/sitemap.xml` and `public/feed.xml` from `src/seo.js`
and `src/changelog.js`, so add new routes/releases there.

## Embedding a widget

The config-posture playground can be embedded anywhere via iframe:

```html
<iframe src="https://wings-vs-claws.pages.dev/embed/playground"
        width="100%" height="640" style="border:0" title="Agentic IAM posture"></iframe>
```
