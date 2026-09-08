# Changelog

All notable changes to Wings vs Claws. The site is an interactive, source-grounded
guide to IAM for the AI-agent era.

## v0.5 — September 2026

### Identity proofing, and a hardening pass

**Content**

- New foundation lesson **Identity proofing & eKYC**, placed first in the
  foundations sequence: proofing vs authentication, identity assurance levels
  (NIST SP 800-63A IAL1–3), what remote eKYC actually checks, ICAO 9303 passive
  authentication, and the presentation-vs-injection attack distinction that
  generative face-swapping made urgent.
- Standards radar gains NIST SP 800-63A and ISO/IEC 30107-3; the glossary gains
  identity proofing, eKYC, presentation attack, injection attack, and passive
  authentication.

**Correctness**

- Unknown URLs used to render the homepage with a 200 status — every typo was a
  soft 404 that duplicated the site. There is now a real 404 page, the Worker
  answers with a 404 status, and the page is marked `noindex` with no canonical.
- Every route renders an `<h1>`. Only the homepage had one; the prerendered HTML
  did include one, so what crawlers read disagreed with what the app rendered.
- The footer's "last updated" stamp and version now derive from the changelog
  instead of being hand-maintained (they had drifted a release behind).
- Defense-in-depth game: deferred transitions are tracked and cancelled, so
  timers no longer outlive the component or the round that scheduled them.

**Security**

- `react-router-dom` 6.30 → 7.18, clearing the open-redirect advisory
  (GHSA-wrjc-x8rr-h8h6). `npm audit --omit=dev` is now clean.
- `Strict-Transport-Security` added alongside the existing security headers.

**Engineering**

- CI on every PR: lint, content-integrity tests, build, a staleness check on
  generated files, and a production dependency audit. There was no CI before.
- ESLint (flat config) and Vitest added; 11 tests assert that lesson slugs are
  unique, internal links resolve, quiz answers index into their options, every
  sitemap route has real metadata, and the Worker's route allowlist is current.
- `data.js` no longer ships in the entry bundle — the ⌘K palette and the SEO
  head manager load it on demand. Entry chunk 231 kB → 202 kB (78 → 67 kB gzip),
  including the router upgrade and the new lesson.

## v0.4 — July 2026

### Fact-check refresh
Every agent claim re-verified against live primary docs (July 2026).

- **OpenClaw corrections**: credential store is the per-agent SQLite database
  (`openclaw-agent.sqlite`; the `~/.openclaw/credentials/` JSON path is legacy,
  migrated by `openclaw doctor --fix`) — with the honest caveat that plaintext
  still works and agent-readable files stay exposed. License shown as MIT.
  SecretRef marked static-credentials-only (OAuth profiles can't use it).
- **Hermes additions**: Daytona joins the backend list; approval prompts fail
  closed (deny) after 60s; dashboard/remote auth documented (Nous Portal OAuth,
  self-hosted OIDC, basic auth — fails closed on non-loopback bind; `--insecure`
  is a deprecated no-op since the June 2026 hardening).
- **Symmetry fix**: both isolation cells now state sandboxing is opt-in —
  Hermes defaults to an unisolated `local` backend (containers run as root
  unless `docker_run_as_host_user`), OpenClaw ships `sandbox.mode: "off"`.
- **Two new real-incident case files**: the Vidar infostealer sweep of an
  OpenClaw state directory (Hudson Rock, Feb 2026 — first documented infostealer
  harvest of an AI agent's credentials and memory) and ClawHub's top-ranked
  skill caught exfiltrating data (Cisco, Jan 2026; Snyk's ToxicSkills on the
  no-vetting marketplace).

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
