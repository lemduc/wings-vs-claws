import { AGENTS, COMPARISON, FEATURE_MATRIX, VERDICT, SOURCES } from './data.js'
import Simulator from './components/Simulator.jsx'
import Architecture from './components/Architecture.jsx'

function AgentCard({ id }) {
  const a = AGENTS[id]
  return (
    <div className={`card-agent ${id}`}>
      <div className="emoji">{a.symbol}</div>
      <h3>{a.name}</h3>
      <div className="tag">{a.tagline}</div>
      <div className="motto">“{a.motto}”</div>
      <div className="blurb">{a.blurb}</div>
      <div className="meta-row">
        <span className="pill">{a.creator}</span>
        <span className="pill">{a.debut}</span>
        <span className="pill">{a.license}</span>
        <span className="pill">{a.version}</span>
      </div>
      <div className="card-links">
        <a href={a.site} target="_blank" rel="noreferrer">Website ↗</a>
        <a href={a.repo} target="_blank" rel="noreferrer">GitHub ↗</a>
      </div>
    </div>
  )
}

function Mark({ value }) {
  const map = { yes: ['✓', 'yes'], partial: ['◐', 'partial'], no: ['—', 'no'] }
  const [glyph, cls] = map[value] || map.no
  return <span className={cls}>{glyph}</span>
}

export default function App() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            Wings <span className="vs">vs</span> Claws
          </div>
          <a className="link" href="#simulator">Simulator</a>
          <a className="link" href="#compare">Compare</a>
          <a className="link" href="#architecture">Architecture</a>
          <a className="link" href="#verdict">Verdict</a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <h1>
            <span className="h">Hermes Agent</span> vs <span className="c">OpenClaw</span>
          </h1>
          <p className="sub">
            Two open-source autonomous agents, two very different philosophies. The winged,
            self-improving researcher's agent — versus the clawed, local-first personal assistant.
            Explore the difference interactively.
          </p>
          <div className="split">
            <AgentCard id="hermes" />
            <div className="vs-badge">VS</div>
            <AgentCard id="openclaw" />
          </div>
        </div>
      </header>

      <Simulator />

      <section id="compare">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Head to head</div>
            <h2>Side by side</h2>
            <p>Every cell below comes from the projects' official sites, docs, and repos.</p>
          </div>
          <table className="cmp">
            <thead>
              <tr>
                <th></th>
                <th className="th-h">🪽 Hermes Agent</th>
                <th className="th-c">🦞 OpenClaw</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.dimension}>
                  <td className="dim">{row.dimension}</td>
                  <td>{row.hermes}</td>
                  <td>{row.openclaw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="matrix">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Capabilities</div>
            <h2>Feature matrix</h2>
            <p>✓ first-class · ◐ partial / possible · — not a focus</p>
          </div>
          <table className="matrix">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Capability</th>
                <th>🪽 Hermes</th>
                <th>🦞 OpenClaw</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_MATRIX.map((r) => (
                <tr key={r.feature}>
                  <td className="feat">{r.feature}</td>
                  <td className="mark"><Mark value={r.hermes} /></td>
                  <td className="mark"><Mark value={r.openclaw} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Architecture />

      <section id="verdict">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">So which one?</div>
            <h2>Which should you pick?</h2>
            <p>They optimize for different people. Here's the short version.</p>
          </div>
          <div className="verdict-grid">
            <div className="verdict-card hermes">
              <h4>🪽 Choose Hermes Agent</h4>
              <p>{VERDICT.hermes}</p>
            </div>
            <div className="verdict-card openclaw">
              <h4>🦞 Choose OpenClaw</h4>
              <p>{VERDICT.openclaw}</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <h5>Sources</h5>
          <ul>
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
              </li>
            ))}
          </ul>
          <p className="fine">
            Wings vs Claws is an independent, unofficial comparison built for demonstration.
            Not affiliated with Nous Research or the OpenClaw project. Factual claims are drawn
            from the sources above (retrieved June 2026); the interactive simulator presents
            illustrative traces of each project's documented architecture, not live runs.
            Product details change quickly — check the official sites for the latest.
          </p>
        </div>
      </footer>
    </>
  )
}
