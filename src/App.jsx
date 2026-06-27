import { AGENTS, IAM_DIMENSIONS, IAM_MATRIX, VERDICT, SOURCES } from './data.js'
import Simulator from './components/Simulator.jsx'
import Architecture from './components/Architecture.jsx'
import Game from './components/Game.jsx'
import Glossary from './components/Glossary.jsx'
import Playground from './components/Playground.jsx'
import CommandPalette from './components/CommandPalette.jsx'

function openPalette() {
  window.dispatchEvent(new CustomEvent('wvc:open-palette'))
}

function AgentCard({ id }) {
  const a = AGENTS[id]
  return (
    <div className={`agentcard term ${id}`}>
      <div className={`term-bar ${id}`}>
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="fname">{a.file}</span>
      </div>
      <div className="term-body">
        <h3>{a.symbol} {a.name}</h3>
        <div className="model">IAM model: <b>{a.iamModel}</b></div>
        <p className="motto">{a.motto}</p>
        <p className="blurb">{a.blurb}</p>
        <div className="kv">
          <span>{a.creator}</span>
          <span>{a.license}</span>
        </div>
        <div className="links">
          <a href={a.site} target="_blank" rel="noreferrer">security docs ↗</a>
          <a href={a.repo} target="_blank" rel="noreferrer">source ↗</a>
        </div>
      </div>
    </div>
  )
}

function Mark({ value, who }) {
  const map = { yes: ['✓', 'yes'], partial: ['◐', 'partial'], no: ['✗', 'no'] }
  const [glyph, cls] = map[value] || map.no
  return <span className={cls} data-who={who}>{glyph}</span>
}

export default function App() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            <span className="w">wings</span><span className="slash">/</span><span className="c">claws</span>
            <span className="comment"> :: iam</span>
          </div>
          <a className="link" href="#simulator">trace</a>
          <a className="link" href="#compare">compare</a>
          <a className="link" href="#matrix">controls</a>
          <a className="link" href="#architecture">topology</a>
          <a className="link" href="#game">game</a>
          <a className="link" href="#playground">config</a>
          <a className="link" href="#glossary">glossary</a>
          <button className="kbtn" onClick={openPalette} aria-label="Open command palette">⌘K</button>
        </div>
      </nav>

      <CommandPalette />

      <header className="hero">
        <div className="wrap">
          <div className="eyebrow">$ ./compare --topic=iam hermes openclaw</div>
          <h1>
            <span className="w">Hermes Agent</span> <span className="vs">vs</span> <span className="c">OpenClaw</span>
            <br />two agents, two IAM philosophies
          </h1>
          <p className="sub">
            Both run as autonomous, tool-wielding processes on your infrastructure — which makes
            them <span className="tok-orange">non-human identities</span> with real blast radius.
            This is a source-grounded look at how each one handles{' '}
            <span className="tok-blue">authentication, authorization, secrets, isolation, and delegation</span>.
            Code-level, IAM-only.
          </p>
          <div className="split">
            <AgentCard id="hermes" />
            <AgentCard id="openclaw" />
          </div>
        </div>
      </header>

      <Simulator />

      <section id="compare">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">head to head</div>
            <h2><span className="fn">diff</span><span className="pn"> hermes.iam openclaw.iam</span></h2>
            <p>Eight IAM dimensions, side by side. Every cell traces to the projects' own security docs.</p>
          </div>
          <div className="dims">
            {IAM_DIMENSIONS.map((row) => (
              <div className="dim" key={row.id}>
                <div className="dim-head">
                  <div className="name">{row.dimension}</div>
                  <div className="sub">{row.sub}</div>
                </div>
                <div className="dim-cols">
                  <div className="dim-col h">
                    <div className="who">🪽 HERMES</div>
                    {row.hermes}
                  </div>
                  <div className="dim-col c">
                    <div className="who">🦞 OPENCLAW</div>
                    {row.openclaw}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="matrix">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">controls</div>
            <h2><span className="fn">capabilities</span><span className="pn">[]</span></h2>
            <p>✓ first-class · ◐ partial / possible · ✗ not a focus — as documented (June 2026).</p>
          </div>
          <table className="matrix">
            <thead>
              <tr>
                <th className="l">IAM control</th>
                <th className="h">🪽 Hermes</th>
                <th className="c">🦞 OpenClaw</th>
              </tr>
            </thead>
            <tbody>
              {IAM_MATRIX.map((r) => (
                <tr key={r.control}>
                  <td className="feat">{r.control}</td>
                  <td className="mark"><Mark value={r.hermes} who="Hermes" /></td>
                  <td className="mark"><Mark value={r.openclaw} who="OpenClaw" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Architecture />

      <Game />

      <Playground />

      <section id="verdict">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">so which model?</div>
            <h2><span className="fn">return</span><span className="pn"> recommendation</span></h2>
            <p>They optimize for different threat models. The short version:</p>
          </div>
          <div className="verdict-grid">
            <div className="verdict-card term hermes">
              <div className="term-bar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="fname">choose-hermes.md</span>
              </div>
              <div className="term-body">
                <span className="ret">// when the threat is the agent itself</span>
                {VERDICT.hermes}
              </div>
            </div>
            <div className="verdict-card term openclaw">
              <div className="term-bar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="fname">choose-openclaw.md</span>
              </div>
              <div className="term-body">
                <span className="ret">// when you want explicit IAM ergonomics</span>
                {VERDICT.openclaw}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Glossary />

      <footer>
        <div className="wrap">
          <h5>sources</h5>
          <ul>
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
              </li>
            ))}
          </ul>
          <p className="fine">
            Wings/Claws :: iam is an independent, unofficial comparison built for demonstration —
            not affiliated with Nous Research or the OpenClaw project. IAM claims are drawn from each
            project's published security documentation (retrieved June 2026); the simulator presents
            illustrative traces of documented mechanisms, not live runs or transcripts. Security
            posture and defaults change quickly — verify against the official docs before relying on
            any control here.
          </p>
        </div>
      </footer>
    </>
  )
}
