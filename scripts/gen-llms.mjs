// Generates llms.txt + per-lesson markdown so AI crawlers and agents can read
// the site's content directly (the SPA body is otherwise JS-rendered).
// Runs in prebuild; outputs land in public/ and ship with the build.
import { writeFileSync, mkdirSync } from 'node:fs'
import { SITE } from '../src/seo.js'
import { LESSONS, GLOSSARY, CASES, STANDARDS, ERAS, IAM_DIMENSIONS } from '../src/data.js'

const pub = new URL('../public/', import.meta.url)
mkdirSync(new URL('md/', pub), { recursive: true })

// --- per-lesson markdown -----------------------------------------------------
function lessonMd(l) {
  const secs = l.sections.map((s) => `## ${s.h}\n\n${s.p}`).join('\n\n')
  const quiz = l.quiz
    .map((q, i) => `${i + 1}. ${q.q}\n   - Answer: ${q.options[q.answer]} — ${q.explain}`)
    .join('\n')
  return `# ${l.title}

> ${l.tldr}

${secs}

## How it changes for AI agents

${l.agentTwist}
${l.code ? `\n## In practice\n\n\`\`\`\n${l.code.body}\n\`\`\`\n` : ''}
## Quick check

${quiz}

---
Source: ${SITE.baseUrl}/learn/${l.slug} · Part of ${SITE.name} — ${SITE.defaultDescription}
`
}

for (const l of LESSONS) {
  writeFileSync(new URL(`md/${l.slug}.md`, pub), lessonMd(l))
}

// --- reference markdown (glossary, cases, standards, journey, comparison) ----
writeFileSync(
  new URL('md/glossary.md', pub),
  `# IAM Glossary (agentic identity)\n\n${GLOSSARY.map((g) => `- **${g.term}** — ${g.def}`).join('\n')}\n\n---\nSource: ${SITE.baseUrl}/glossary\n`,
)
writeFileSync(
  new URL('md/cases.md', pub),
  `# Case files — agent & NHI incidents\n\n${CASES.map((c) => `## ${c.title} (${c.year}, ${c.severity})\n\n- What happened: ${c.what}\n- Identity angle: ${c.identity}\n- What stops it: ${c.stopper}\n- Maps to: ${c.maps} (${c.era})`).join('\n\n')}\n\n---\nSource: ${SITE.baseUrl}/cases\n`,
)
writeFileSync(
  new URL('md/standards.md', pub),
  `# Standards shaping agentic IAM\n\n${STANDARDS.map((s) => `- **${s.name}** (${s.status}; track: ${s.track}) — ${s.what}`).join('\n')}\n\n---\nSource: ${SITE.baseUrl}/standards\n`,
)
writeFileSync(
  new URL('md/journey.md', pub),
  `# The journey of IAM — seven eras\n\n${ERAS.map((e) => `## Era ${e.n}: ${e.title} (${e.range})\n\n- Identity meant: ${e.identity}\n- Stack: ${e.tech.join(', ')}\n- ${e.here ? 'Open problem' : 'What broke'}: ${e.broke}`).join('\n\n')}\n\n---\nSource: ${SITE.baseUrl}/journey\n`,
)
writeFileSync(
  new URL('md/comparison.md', pub),
  `# Hermes Agent vs OpenClaw — IAM comparison\n\n${IAM_DIMENSIONS.map((d) => `## ${d.dimension}\n\n- Hermes: ${d.hermes}\n- OpenClaw: ${d.openclaw}`).join('\n\n')}\n\n---\nSource: ${SITE.baseUrl}/compare · Both cells sourced from each project's security documentation.\n`,
)

// --- llms.txt index -----------------------------------------------------------
const llms = `# ${SITE.name}

> ${SITE.defaultDescription}

An interactive learning hub for identity & access management (IAM) in the
AI-agent era, built around a source-grounded comparison of two open-source
agents (Hermes Agent, OpenClaw). Content is written by an IAM practitioner;
factual claims trace to primary sources.

## Lessons

${LESSONS.map((l) => `- [${l.title}](${SITE.baseUrl}/md/${l.slug}.md): ${l.tldr}`).join('\n')}

## Reference

- [IAM glossary](${SITE.baseUrl}/md/glossary.md): agentic identity terms, defined
- [The journey of IAM](${SITE.baseUrl}/md/journey.md): seven eras, from ACLs to agents
- [Hermes vs OpenClaw comparison](${SITE.baseUrl}/md/comparison.md): eight IAM dimensions side by side
- [Standards radar](${SITE.baseUrl}/md/standards.md): OAuth, token exchange, MCP auth, SPIFFE, NIST
- [Case files](${SITE.baseUrl}/md/cases.md): real & representative agent/NHI incidents

## Optional

- [Changelog](${SITE.baseUrl}/changelog): release notes
- [RSS feed](${SITE.baseUrl}/feed.xml)
`
writeFileSync(new URL('llms.txt', pub), llms)
console.log(`llms.txt + ${LESSONS.length + 5} markdown docs`)
