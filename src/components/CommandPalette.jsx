import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOSSARY, SCENARIOS, LESSONS } from '../data.js'
import { PAGES } from '../nav.js'

function buildCommands() {
  const pages = PAGES.map((p) => ({
    kind: 'page', key: `p:${p.id}`, label: p.label, hint: p.blurb, path: p.path,
  }))
  const lessons = LESSONS.map((l) => ({
    kind: 'page', key: `l:${l.slug}`, label: l.title, hint: 'lesson', path: `/learn/${l.slug}`,
  }))
  const terms = GLOSSARY.map((g) => ({
    kind: 'term', key: `t:${g.term}`, label: g.term, hint: 'term', term: g.term,
  }))
  const scenarios = SCENARIOS.map((sc) => ({
    kind: 'scenario', key: `c:${sc.id}`, label: sc.title, hint: 'run trace', scenario: sc.id,
  }))
  return [...pages, ...lessons, ...terms, ...scenarios]
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const commands = useMemo(buildCommands, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.includes(q))
  }, [query, commands])

  useEffect(() => { setActive(0) }, [query, open])

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    function onOpen() { setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wvc:open-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wvc:open-palette', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); requestAnimationFrame(() => inputRef.current?.focus()) }
  }, [open])

  function run(cmd) {
    setOpen(false)
    if (cmd.kind === 'page') {
      navigate(cmd.path)
    } else if (cmd.kind === 'term') {
      navigate('/glossary')
      setTimeout(() => window.dispatchEvent(new CustomEvent('wvc:term', { detail: cmd.term })), 160)
    } else if (cmd.kind === 'scenario') {
      navigate('/trace')
      setTimeout(() => window.dispatchEvent(new CustomEvent('wvc:scenario', { detail: cmd.scenario })), 160)
    }
  }

  function onListKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) run(results[active]) }
  }

  if (!open) return null

  return (
    <div className="palette-overlay" onMouseDown={() => setOpen(false)}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <span className="pi-prompt">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onListKey}
            placeholder="jump to a page, term, or scenario…"
            aria-label="Command palette"
          />
          <span className="pi-esc">esc</span>
        </div>
        <div className="palette-list">
          {results.map((c, i) => (
            <button
              key={c.key}
              className={`palette-item ${i === active ? 'active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(c)}
            >
              <span className={`pi-kind k-${c.kind}`}>{c.kind === 'page' ? '#' : c.kind === 'term' ? '¶' : '▸'}</span>
              <span className="pi-label">{c.label}</span>
              <span className="pi-hint">{c.hint}</span>
            </button>
          ))}
          {results.length === 0 && <div className="palette-empty">no matches</div>}
        </div>
        <div className="palette-foot">
          <span><b>↑↓</b> navigate</span><span><b>↵</b> open</span><span><b>esc</b> close</span>
        </div>
      </div>
    </div>
  )
}
