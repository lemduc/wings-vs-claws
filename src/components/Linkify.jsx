import { GLOSSARY } from '../data.js'

// Build a regex of all glossary terms (longest first so multi-word terms win).
const DEFS = Object.fromEntries(GLOSSARY.map((g) => [g.term.toLowerCase(), g.def]))
const escaped = [...GLOSSARY]
  .map((g) => g.term)
  .sort((a, b) => b.length - a.length)
  .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
const PATTERN = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi')

// Wrap the first occurrence of each glossary term in a hover-defined link.
export default function Linkify({ text }) {
  if (!text) return null
  const re = new RegExp(PATTERN.source, 'gi')
  const out = []
  const seen = new Set()
  let last = 0
  let key = 0
  let m
  while ((m = re.exec(text)) !== null) {
    const term = m[0]
    const lc = term.toLowerCase()
    if (seen.has(lc)) continue
    seen.add(lc)
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(
      <span className="glink" data-def={DEFS[lc]} tabIndex={0} key={key++}>{term}</span>,
    )
    last = m.index + term.length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}
