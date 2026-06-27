import { useEffect, useRef, useState } from 'react'
import { AGENTS, TASKS, TRACES } from '../data.js'

// Maps a free-text custom task to the closest scripted trace, so the
// "type your own" box always produces a sensible illustrative run.
function pickTrace(text) {
  const t = text.toLowerCase()
  if (/slack|email|message|reply|inbox|dm/.test(t)) return 'slack-triage'
  if (/train|trajector|fine-?tune|rl|dataset|export/.test(t)) return 'rl-export'
  if (/morning|daily|schedule|brief|every day|each day|remind/.test(t)) return 'morning-brief'
  if (/research|browse|web|buy|shop|compare|summari/.test(t)) return 'browse-buy'
  return 'slack-triage'
}

function Lane({ agent, steps, revealed }) {
  const a = AGENTS[agent]
  return (
    <div className={`lane ${agent}`}>
      <div className="lane-head">
        <span className="emoji">{a.symbol}</span>
        <div>
          <h4>{a.name}</h4>
          <div className="sub">{a.motto}</div>
        </div>
      </div>
      {steps.length === 0 ? (
        <div className="empty">Pick a task to see how {a.name} would approach it.</div>
      ) : (
        steps.map((s, i) => (
          <div className={`step ${i < revealed ? 'show' : ''}`} key={i}>
            <span className="dot">{i + 1}</span>
            <div className="body">
              <div className="label">{s.label}</div>
              <div className="detail">{s.detail}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default function Simulator() {
  const [taskId, setTaskId] = useState(null)
  const [custom, setCustom] = useState('')
  const [revealed, setRevealed] = useState(0)
  const timers = useRef([])

  const trace = taskId ? TRACES[taskId] : null
  const maxSteps = trace ? Math.max(trace.hermes.length, trace.openclaw.length) : 0

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }

  function run(id) {
    clearTimers()
    setTaskId(id)
    setRevealed(0)
    const steps = Math.max(TRACES[id].hermes.length, TRACES[id].openclaw.length)
    for (let i = 1; i <= steps; i++) {
      timers.current.push(setTimeout(() => setRevealed(i), i * 520))
    }
  }

  useEffect(() => clearTimers, [])

  return (
    <section id="simulator">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Interactive</div>
          <h2>Run the same task through both</h2>
          <p>
            Pick a task — or type your own — and watch each agent's documented architecture
            light up step by step.
          </p>
        </div>

        <div className="sim-tasks">
          {TASKS.map((t) => (
            <button
              key={t.id}
              className={`task-btn ${taskId === t.id ? 'active' : ''}`}
              onClick={() => run(t.id)}
            >
              <span className="ti">{t.icon}</span>
              <span>{t.title}</span>
            </button>
          ))}
        </div>

        <form
          className="custom-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (custom.trim()) run(pickTrace(custom))
          }}
        >
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="…or describe your own task, e.g. “summarize my unread email”"
            aria-label="Custom task"
          />
          <button className="btn" type="submit" disabled={!custom.trim()}>
            Simulate
          </button>
        </form>

        <div className="lanes">
          <Lane agent="hermes" steps={trace ? trace.hermes : []} revealed={revealed} />
          <Lane agent="openclaw" steps={trace ? trace.openclaw : []} revealed={revealed} />
        </div>

        {trace && (
          <div className="disclaimer">
            Illustrative simulation — these traces dramatize each project's documented
            architecture, not a live run. {revealed < maxSteps ? 'Running…' : 'Done.'}
          </div>
        )}
      </div>
    </section>
  )
}
