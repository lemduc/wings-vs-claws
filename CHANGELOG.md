# Changelog

All notable changes to Wings vs Claws. The site is an interactive, source-grounded
guide to IAM for the AI-agent era.

## v0.5 — September 2026

### Fact-check, identity proofing, and a hardening pass

**Fact-check (against live primary docs, September 2026)**

- **Hermes documents eight defense layers, not seven.** *File write safety* —
  a protected-path denylist for `write_file`/`patch` plus the optional
  `HERMES_WRITE_SAFE_ROOT` — is layer 3, shifting isolation through
  sanitization down one. The topology diagram, the mini-game, the threat
  mapping, and every mention of the count now derive from `HERMES_LAYERS`
  rather than restating it, and tests fail if they drift apart again.
- **The approval timeout is 300 seconds, not 60**, and **`smart` is the default
  approval mode, not `manual`** — an auxiliary LLM scores risk, auto-approving
  low-risk calls and escalating uncertain ones. Both were stated the other way.
- Hermes additions: `vercel_sandbox` backend, `HERMES_WRITE_SAFE_ROOT`, CGNAT
  and cloud-metadata ranges in the SSRF guard, `approvals.deny` glob rules
  evaluated ahead of YOLO, and a wider env-strip list (`CREDENTIAL`, `PASSWD`,
  `AUTH`) plus `LC_ALL` in the MCP passthrough.
- **OpenClaw's SSRF / egress rating moves from ◐ to ✓.** Its SSRF policy is
  strict by default across the browser and web-fetch tools, refusing private
  and internal destinations unless explicitly opted out, and it applies
  whether or not the sandbox is enabled — so it is not the opt-in case that ◐
  describes. The comparison cells now carry that fact, since the mark has to
  be traceable to sourced text on the page.
- OpenClaw: sandboxes are hardened by default once enabled — `capDrop: ["ALL"]`,
  `no-new-privileges`, `readOnlyRoot`, a non-root user, and `network: "none"`.
  Backends now include SSH and OpenShell managed remote sandboxes. OAuth tokens
  and dynamic client secrets live in `state/openclaw.sqlite`; SecretRef gains a
  credential-store provider. `security audit` grew `--deep`/`--fix`/`--json`
  and structured `checkId` findings. `tools.sessions.visibility` defaults to
  `all` — gateway-wide — and has to be narrowed by hand.

**Content**

- New foundation lesson **Sessions, tokens & revocation**. The site covered
  token issuance and stopped. This covers what happens after: server-side
  session record vs self-contained token, the four things that decide whether
  a session is safe, **revocation latency** as the real exposure window,
  sender-constrained tokens (DPoP RFC 9449, mTLS-bound RFC 8705) against
  bearer-token theft, and validating a token properly rather than parsing it.
- New foundation lesson **Audit, logging & forensics**. The comparison had an
  audit dimension but no lesson: where identity events come from and who else
  reads them, what a good record contains (including the "why", the field most
  often missing), the absence of any single logging standard as a procurement
  question, tiered retention, and the fact that you can only investigate what
  you were permitted to collect.
- New case file **Storm-0558**: forged tokens signed with a 2016 consumer
  signing key that leaked into a crash dump, accepted for enterprise tenants
  through a separate validation flaw. ~25 organizations, ~60,000 emails from
  one department, six weeks. Found via a `MailItemsAccessed` log that required
  a premium licence tier — the control that mattered was a paid add-on. Sourced
  to the CSRB review.
- Supporting reference: DPoP, mTLS-bound tokens and the OpenID Shared Signals
  Framework on the standards radar; revocation latency, sender-constrained
  token, bearer token and correlation ID in the glossary.
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
