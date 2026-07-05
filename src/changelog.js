// Release notes — rendered by the Changelog page and the RSS feed generator.
export const CHANGES = [
  {
    version: '0.4', date: '2026-07-06', title: 'Fact-check refresh',
    items: [
      'Re-verified every agent claim against live primary docs (July 2026) after a deep fact-check pass.',
      'OpenClaw: credential store corrected to the per-agent SQLite database (plaintext JSON is legacy); license shown as MIT; SecretRef noted as static-credentials-only.',
      'Hermes: added Daytona backend, the 60s fail-closed approval timeout, and dashboard auth (Nous Portal OAuth / self-hosted OIDC / basic; --insecure now a no-op).',
      'Both isolation cells now say sandboxing is opt-in — Hermes defaults to an unisolated local backend, OpenClaw ships with sandbox.mode "off".',
      'Two new real-incident case files: the Vidar infostealer sweep of an OpenClaw state dir (Hudson Rock, Feb 2026) and ClawHub’s exfiltrating #1 skill (Cisco, Jan 2026).',
    ],
  },
  {
    version: '0.3', date: '2026-06-29', title: 'Polish, labs & reach',
    items: [
      'Interactive labs: delegation-chain visualizer and OAuth flow walkthrough.',
      'Inline glossary auto-linking; three new foundation lessons; standards radar.',
      'Route code-splitting, accessibility pass, per-page SEO, sitemap, and OG image.',
      'Community: contribution guide, embeddable playground, this changelog + RSS.',
    ],
  },
  {
    version: '0.2', date: '2026-06-28', title: 'IAM learning hub',
    items: [
      'Reorganized into a learning hub: start-here paths, foundation lessons, quizzes, progress tracking.',
      'The journey page (IAM eras as a git-log) and the Rosetta Stone mapping.',
      'Defense-in-Depth mini-game, config-posture playground, ⌘K palette, light/dark theme.',
    ],
  },
  {
    version: '0.1', date: '2026-06-27', title: 'Hermes vs OpenClaw',
    items: [
      'Interactive IAM comparison: access-trace simulator, diff + control matrix, topology diagrams.',
    ],
  },
]
