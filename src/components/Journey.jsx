import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ERAS, ROSETTA, JOURNEY_SOURCES } from '../data.js'

function Commit({ era, open, onToggle }) {
  return (
    <div className={`commit ${era.here ? 'here' : ''} ${open ? 'open' : ''}`}>
      <div className="graph">
        <span className="node" />
        <span className="line" />
      </div>
      <div className="commit-body">
        <button className="commit-head" onClick={onToggle}>
          <span className="chash">{era.hash}</span>
          <span className="cref">(era/{era.n})</span>
          {era.here && <span className="chead">HEAD → agents</span>}
          <span className="ctitle">{era.title}</span>
          <span className="cdate">{era.range}</span>
        </button>
        {open && (
          <div className="commit-detail">
            <div className="cd-row"><span className="cd-k">identity</span><span className="cd-v">{era.identity}</span></div>
            <div className="cd-row">
              <span className="cd-k">stack</span>
              <span className="cd-chips">
                {era.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
              </span>
            </div>
            <div className="cd-broke">{era.here ? '◇ the open problem: ' : '✗ what broke → next era: '}{era.broke}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Journey() {
  const [open, setOpen] = useState(() => new Set(['era6']))
  const toggle = (id) =>
    setOpen((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <>
      <section id="journey">
        <div className="section-head">
          <div className="eyebrow">the road to agentic identity</div>
          <h2><span className="fn">git log</span><span className="pn"> --oneline identity</span></h2>
          <p>
            Every era of IAM solved the last one’s problem — and created a new kind of identity to
            govern. AI agents are just the newest, and unruliest, commit on that branch.
          </p>
        </div>

        <div className="term">
          <div className="term-bar">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="lbl">history of identity</span>
            <span className="fname">7 commits · oldest first</span>
          </div>
          <div className="term-body commitlog">
            {ERAS.map((era) => (
              <Commit key={era.id} era={era} open={open.has(era.id)} onToggle={() => toggle(era.id)} />
            ))}
          </div>
        </div>

        <Link to="/compare" className="journey-cta">
          <span className="jc-k">›</span>
          <span>Hermes &amp; OpenClaw are two answers to era 6 — see how they handle it</span>
          <span className="jc-arrow">→</span>
        </Link>
      </section>

      <section id="rosetta">
        <div className="section-head">
          <div className="eyebrow">agents are reinventing IAM</div>
          <h2><span className="fn">rosetta</span><span className="pn">{'  // control ↔ ancestor'}</span></h2>
          <p>
            Strip the agent jargon and you find 30 years of IAM staring back. Each control these
            agents ship maps to an idea the industry already named.
          </p>
        </div>
        <div className="rosetta-grid">
          {ROSETTA.map((r) => (
            <div className="ros" key={r.agent}>
              <div className="ros-top">
                <span className="ros-agent">{r.agent}</span>
                <span className="ros-arrow">≈</span>
                <span className="ros-classic">{r.classic}</span>
                <span className="ros-era">{r.era}</span>
              </div>
              <div className="ros-note">{r.note}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sources">
        <h5>journey sources</h5>
        <ul>
          {JOURNEY_SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>
          ))}
        </ul>
        <p className="fine">
          Historical dates are well-established IAM milestones; Era 5–6 figures (144:1 NHI ratio,
          97% over-permissioned, the OAuth on-behalf-of draft, MCP/NIST work) are drawn from the
          sources above (retrieved June 2026). The era framing is an editorial synthesis, not an
          official taxonomy.
        </p>
      </div>
    </>
  )
}
