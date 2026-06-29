# Changelog

All notable changes to Wings vs Claws. The site is an interactive, source-grounded
guide to IAM for the AI-agent era.

## v0.3 — June 2026

### Phase 3 — Polish & reach
- Route-level code-splitting (each page is its own lazy-loaded chunk).
- Accessibility: skip-to-content link, visible `:focus-visible` rings, `main`
  landmark, global `prefers-reduced-motion` handling.
- Freshness: "last updated" footer + this changelog.
- Open Graph / Twitter image for shared links.

### Phase 2 — Interactive labs
- Delegation-chain visualizer (`/delegation`): scoped on-behalf-of delegation.
- OAuth Authorization Code flow walkthrough (`/oauth-flow`).

### Phase 1 — Stickier learning
- Inline glossary auto-linking with hover definitions in lessons.
- Three new foundation lessons: Federation & SSO, MFA & step-up, Workload identity.
- Standards radar (`/standards`): the protocols shaping agentic IAM.

### Phase 0 — Foundations & findability
- Per-page SEO/meta, auto-generated sitemap, robots.txt.
- Dependency security fixes (15 alerts → 2 dev-only).

## v0.2 — earlier

- Reorganized into an IAM learning hub: Start-here paths, Foundations lessons,
  reusable quiz engine + progress tracking, case files.
- The journey page (IAM eras as a git-log) + Rosetta Stone mapping.
- Defense-in-Depth mini-game, config-posture playground, ⌘K command palette,
  light/dark theme, multi-page navigation.

## v0.1 — initial

- Interactive Hermes Agent vs OpenClaw IAM comparison: access-trace simulator,
  diff + control matrix, enforcement-topology diagrams.
