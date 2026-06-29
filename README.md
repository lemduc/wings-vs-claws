# Wings vs Claws 🪽🦞

**Learn IAM — from directories to agents.** An interactive, source-grounded learning
hub for identity & access management in the AI-agent era, built around a comparison of
two open-source agents: **Hermes Agent** (Nous Research) and **OpenClaw** (Peter Steinberger).

🔗 **Live:** https://wings-vs-claws.pages.dev

## What's inside

- **Learn** — a *Start here* with learning paths by level, and **Foundations** lessons
  (AuthN vs AuthZ, access models, federation/SSO, OAuth/OIDC, MFA, Zero Trust, workload
  identity, NHIs, agent delegation) — each with a diagram, an "how it changes for agents"
  twist, and a quiz.
- **The journey** — IAM's evolution across seven eras, as a `git log`.
- **Case study** — Hermes vs OpenClaw: access-trace simulator, diff + control matrix,
  enforcement-topology diagrams.
- **Practice** — delegation-chain visualizer, OAuth flow walkthrough, a Defense-in-Depth
  game, a config-posture playground, and a cumulative quiz.
- **Reference** — glossary (with inline hover-defs), standards radar, and case files.
- Plus a ⌘K command palette, light/dark themes, progress tracking, and per-page SEO.

## Stack

React 18 + Vite + React Router, plain CSS. All content lives in `src/data.js` /
`src/changelog.js` so every claim is traceable and easy to extend.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # regenerates sitemap + RSS, then builds to dist/
npm run deploy   # build + deploy to Cloudflare Pages
```

## Embed

The config-posture playground is embeddable:

```html
<iframe src="https://wings-vs-claws.pages.dev/embed/playground"
        width="100%" height="640" style="border:0" title="Agentic IAM posture"></iframe>
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Content must be sourced; illustrative pieces are
labeled as such. Releases are tracked in [CHANGELOG.md](CHANGELOG.md) and at `/changelog`.

## Disclaimer

Independent and unofficial — not affiliated with Nous Research or the OpenClaw project.
IAM claims are drawn from each project's published security docs (retrieved June 2026);
interactive pieces illustrate documented mechanisms, not live runs. Verify against the
official docs before relying on any control here.
