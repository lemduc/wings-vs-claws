// Per-route SEO metadata. Keep titles unique and descriptive — this is what
// search engines and social cards show. baseUrl is overridable for a custom domain.
import { LESSONS } from './data.js'

export const SITE = {
  name: 'Wings vs Claws',
  // Update this when a custom domain is wired up.
  baseUrl: 'https://wings-vs-claws.pages.dev',
  defaultDescription:
    'Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.',
}

const PAGE_META = {
  '/': {
    title: 'Hermes Agent vs OpenClaw — IAM, side by side',
    description: 'A source-grounded comparison of how two open-source AI agents handle identity & access management: authN, authZ, secrets, isolation, and delegation.',
  },
  '/learn': {
    title: 'Start here — Learn IAM, from directories to agents',
    description: 'Pick a learning path by level and work through identity & access management, ending where it gets hard: autonomous AI agents.',
  },
  '/foundations': {
    title: 'IAM Foundations — core concepts, explained',
    description: 'Short visual lessons on AuthN vs AuthZ, access models, OAuth/OIDC, Zero Trust, non-human identities, and agent delegation.',
  },
  '/journey': {
    title: 'The journey of IAM — pre-AI to agents',
    description: 'How identity & access management evolved across seven eras, from ACLs and directories to non-human identities and autonomous agents.',
  },
  '/compare': {
    title: 'Hermes vs OpenClaw — IAM diff & control matrix',
    description: 'Eight IAM dimensions compared side by side, plus an 11-control capability matrix, sourced from each project’s security docs.',
  },
  '/topology': {
    title: 'Enforcement topology — defense-in-depth vs gate chain',
    description: 'How Hermes stacks seven defensive layers while OpenClaw chains permission gates. Two shapes of least privilege, visualized.',
  },
  '/trace': {
    title: 'Access trace simulator — agentic IAM in action',
    description: 'Pick an access scenario and watch each agent’s documented IAM controls gate it, layer by layer.',
  },
  '/delegation': {
    title: 'Delegation lab — scoped on-behalf-of, visualized',
    description: 'See why narrowing scope on every hop (RFC 8693 token exchange) contains an agent’s blast radius as work flows to sub-agents.',
  },
  '/oauth-flow': {
    title: 'OAuth flow lab — the Authorization Code dance',
    description: 'Step through the OAuth 2.0 / OIDC Authorization Code flow one message at a time, from consent to scoped API access.',
  },
  '/game': {
    title: 'Defense in Depth — an IAM mini-game',
    description: 'Block incoming threats by arming the right defensive layer. Learn the seven-layer model by playing it.',
  },
  '/playground': {
    title: 'Config posture playground — score your agent IAM',
    description: 'Flip agent security settings and watch the IAM posture move, with every risk weight tied to a real control.',
  },
  '/quiz': {
    title: 'IAM foundations quiz — test yourself',
    description: 'One question from each foundation lesson. Score 67% or better to pass; your best is saved.',
  },
  '/glossary': {
    title: 'IAM glossary — agentic identity terms, defined',
    description: 'Concise, sourced definitions of the IAM vocabulary used across the site, from pairing codes to SecretRef and defense-in-depth.',
  },
  '/cases': {
    title: 'Case files — learn from agent & NHI breaches',
    description: 'Real and representative ways non-human identity goes wrong — and the one control that would have changed the outcome.',
  },
  '/standards': {
    title: 'Standards radar — protocols for agentic IAM',
    description: 'OAuth, OIDC, token exchange, SPIFFE, MCP authorization, the OAuth on-behalf-of draft, and NIST — the standards shaping identity for AI agents.',
  },
}

export function metaFor(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  if (pathname.startsWith('/learn/')) {
    const slug = pathname.replace('/learn/', '')
    const lesson = LESSONS.find((l) => l.slug === slug)
    if (lesson) return { title: `${lesson.title} — IAM lesson`, description: lesson.tldr }
  }
  return { title: 'Learn IAM, from directories to agents', description: SITE.defaultDescription }
}

// All routes for the static sitemap.
export const SITEMAP_ROUTES = [
  ...Object.keys(PAGE_META),
  ...LESSONS.map((l) => `/learn/${l.slug}`),
]
