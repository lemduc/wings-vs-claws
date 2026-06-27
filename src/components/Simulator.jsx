import { useEffect, useRef, useState } from 'react'
import { AGENTS, SCENARIOS, TRACES } from '../data.js'

// Map free-text to the closest scripted IAM scenario.
function pickScenario(text) {
  const t = text.toLowerCase()
  if (/dm|message|unknown|stranger|who|auth|login|pair/.test(t)) return 'unknown-dm'
  if (/token|key|secret|credential|api|oauth|password/.test(t)) return 'github-token'
  if (/rm |delete|danger|destroy|shell|sudo|format|wipe/.test(t)) return 'dangerous-cmd'
  if (/subagent|delegate|spawn|child|sub-?task/.test(t)) return 'spawn-subagent'
  return 'unknown-dm'
}

function Lane({ agent, lines, revealed }) {
  const a = AGENTS[agent]
  return (
    <div className={`lane term ${agent}`}>
      <div className="term-bar">
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="lbl">{a.symbol} {a.name}</span>
        <span className="fname">{a.file}</span>
      </div>
      <div className="term-body">
        {lines.length === 0 ? (
          <div className="empty">// select a scenario to trace {a.name}'s IAM path</div>
        ) : (
          <>
            <div className="cmd prompt">
              iam-trace --agent <span className="arg">{agent}</span>
            </div>
            {lines.map((l, i) => (
              <div className={`logline ${i < revealed ? 'show' : ''}`} key={i}>
                <span className="tag">{l.tag}</span>
                <span className="verb">{l.verb}</span>
                <span className="txt">{l.line}</span>
              </div>
            ))}
            {revealed >= lines.length ? (
              <div className="done">✓ access decision resolved</div>
            ) : (
              <div className="done running">› tracing<span className="caret" /></div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Simulator() {
  const [scenarioId, setScenarioId] = useState(null)
  const [custom, setCustom] = useState('')
  const [revealed, setRevealed] = useState(0)
  const timers = useRef([])

  const trace = scenarioId ? TRACES[scenarioId] : null

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }

  function run(id) {
    clearTimers()
    setScenarioId(id)
    setRevealed(0)
    const steps = Math.max(TRACES[id].hermes.length, TRACES[id].openclaw.length)
    for (let i = 1; i <= steps; i++) {
      timers.current.push(setTimeout(() => setRevealed(i), i * 480))
    }
  }

  useEffect(() => clearTimers, [])

  return (
    <section id="simulator">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">interactive</div>
          <h2><span className="fn">traceAccess</span><span className="pn">(scenario)</span></h2>
          <p>
            Pick an access scenario — or describe your own — and watch each agent's
            documented IAM controls gate it, layer by layer.
          </p>
        </div>

        <div className="sim-tasks">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              className={`task-btn ${scenarioId === s.id ? 'active' : ''}`}
              onClick={() => run(s.id)}
            >
              <span className="ti">{s.icon}</span>
              <span><span className="k">{i}: </span>{s.title}</span>
            </button>
          ))}
        </div>

        <form
          className="custom-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (custom.trim()) run(pickScenario(custom))
          }}
        >
          <div className="inwrap">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="describe an access scenario, e.g. “agent needs my AWS keys”"
              aria-label="Custom scenario"
            />
          </div>
          <button className="btn" type="submit" disabled={!custom.trim()}>trace ↵</button>
        </form>

        <div className="lanes">
          <Lane agent="hermes" lines={trace ? trace.hermes : []} revealed={revealed} />
          <Lane agent="openclaw" lines={trace ? trace.openclaw : []} revealed={revealed} />
        </div>

        {trace && (
          <div className="disclaimer">
            illustrative trace — each line dramatizes a documented IAM mechanism, not a live run
          </div>
        )}
      </div>
    </section>
  )
}
