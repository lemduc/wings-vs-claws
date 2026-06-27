import { useEffect, useRef, useState } from 'react'
import { GLOSSARY } from '../data.js'

const REL = {
  both: { label: 'both', cls: 'rel-both' },
  hermes: { label: '🪽 hermes', cls: 'rel-h' },
  openclaw: { label: '🦞 openclaw', cls: 'rel-c' },
}

export default function Glossary() {
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')
  const refs = useRef({})

  // The command palette can request a term — expand it and scroll it in.
  useEffect(() => {
    function onTerm(e) {
      const term = e.detail
      setOpen(term)
      setQuery('')
      requestAnimationFrame(() => {
        refs.current[term]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
    window.addEventListener('wvc:term', onTerm)
    return () => window.removeEventListener('wvc:term', onTerm)
  }, [])

  const items = GLOSSARY.filter(
    (g) => !query || (g.term + g.def).toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section id="glossary">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">reference</div>
          <h2><span className="fn">glossary</span><span className="pn">.iam</span></h2>
          <p>The vocabulary used across this site, defined. Press <b>⌘K</b> to jump to any term.</p>
        </div>

        <div className="custom-row gloss-search">
          <div className="inwrap">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filter terms…"
              aria-label="Filter glossary"
            />
          </div>
        </div>

        <div className="gloss-grid">
          {items.map((g) => {
            const isOpen = open === g.term
            const rel = REL[g.rel]
            return (
              <div
                key={g.term}
                ref={(el) => (refs.current[g.term] = el)}
                className={`gloss ${isOpen ? 'open' : ''}`}
              >
                <button className="gloss-head" onClick={() => setOpen(isOpen ? null : g.term)}>
                  <span className="caret-i">{isOpen ? '▾' : '▸'}</span>
                  <span className="gterm">{g.term}</span>
                  <span className={`rel ${rel.cls}`}>{rel.label}</span>
                </button>
                {isOpen && <div className="gdef">{g.def}</div>}
              </div>
            )
          })}
          {items.length === 0 && <div className="lane empty">// no terms match “{query}”</div>}
        </div>
      </div>
    </section>
  )
}
