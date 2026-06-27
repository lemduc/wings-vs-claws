import { useMemo, useState } from 'react'
import { PLAYGROUND } from '../data.js'

function verdictFor(score) {
  if (score >= 90) return { label: 'HARDENED', cls: 'v-good' }
  if (score >= 70) return { label: 'REASONABLE', cls: 'v-ok' }
  if (score >= 45) return { label: 'RISKY', cls: 'v-warn' }
  return { label: 'DANGEROUS', cls: 'v-bad' }
}

export default function Playground() {
  const [cfg, setCfg] = useState(() =>
    Object.fromEntries(PLAYGROUND.map((s) => [s.id, s.default])),
  )

  const { score, risks } = useMemo(() => {
    let total = 0
    const flagged = []
    for (const s of PLAYGROUND) {
      const opt = s.options.find((o) => o.v === cfg[s.id])
      if (opt && opt.risk > 0) {
        total += opt.risk
        flagged.push({ id: s.id, label: s.label, choice: opt.label, risk: opt.risk, note: s.note })
      }
    }
    return { score: Math.max(0, 100 - total), risks: flagged }
  }, [cfg])

  const verdict = verdictFor(score)

  function reset() {
    setCfg(Object.fromEntries(PLAYGROUND.map((s) => [s.id, s.default])))
  }
  function worstCase() {
    setCfg(
      Object.fromEntries(
        PLAYGROUND.map((s) => [
          s.id,
          s.options.reduce((a, b) => (b.risk > a.risk ? b : a)).v,
        ]),
      ),
    )
  }

  return (
    <section id="playground">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">interactive</div>
          <h2><span className="fn">configPosture</span><span className="pn">(agent.toml)</span></h2>
          <p>
            Flip the security settings and watch the IAM posture move. Every weight reflects a
            real control from the two projects’ docs.
          </p>
        </div>

        <div className="pg-grid">
          <div className="term pg-config">
            <div className="term-bar">
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="fname">agent.toml</span>
            </div>
            <div className="term-body">
              <div className="pg-comment"># edit any value — posture recomputes live</div>
              {PLAYGROUND.map((s) => {
                const opt = s.options.find((o) => o.v === cfg[s.id])
                const risky = opt && opt.risk > 0
                return (
                  <div className={`pg-line ${risky ? 'risky' : ''}`} key={s.id}>
                    <span className="pg-key">{s.label}</span>
                    <span className="pg-eq">=</span>
                    <select
                      className={`pg-select ${risky ? 'risky' : ''}`}
                      value={cfg[s.id]}
                      onChange={(e) => setCfg({ ...cfg, [s.id]: e.target.value })}
                    >
                      {s.options.map((o) => (
                        <option key={o.v} value={o.v}>
                          {o.label}{o.risk > 0 ? `  (+${o.risk} risk)` : '  ✓'}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
              <div className="pg-actions">
                <button className="btn ghost" onClick={reset}>↺ secure defaults</button>
                <button className="btn ghost" onClick={worstCase}>☠ worst case</button>
              </div>
            </div>
          </div>

          <div className="term pg-verdict">
            <div className="term-bar">
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="fname">posture.out</span>
            </div>
            <div className="term-body">
              <div className="pg-score">
                <div className="pg-num">{score}<span className="pg-den">/100</span></div>
                <div className={`pg-badge ${verdict.cls}`}>{verdict.label}</div>
              </div>
              <div className="pg-meter">
                <i style={{ width: `${score}%` }} className={verdict.cls} />
              </div>
              {risks.length === 0 ? (
                <div className="pg-clean">✓ no risky settings — every control at its safe default.</div>
              ) : (
                <div className="pg-risks">
                  <div className="pg-risks-head">// {risks.length} risk{risks.length > 1 ? 's' : ''} flagged</div>
                  {risks.map((r) => (
                    <div className="pg-risk" key={r.id}>
                      <span className="pg-risk-tag">{r.label} = {r.choice}</span>
                      <span className="pg-risk-note">{r.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="disclaimer">illustrative scoring — weights are relative, not an official rating from either project</div>
      </div>
    </section>
  )
}
