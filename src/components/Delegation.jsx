import { useState } from 'react'
import { Link } from 'react-router-dom'

// A fixed scenario: "Draft and send a reply to my latest email."
// Each principal in the chain needs less than the one above it.
const CHAIN = [
  { who: 'You (user)', role: 'principal', needs: ['inbox:read', 'mail:send', 'calendar:read'] },
  { who: 'Orchestrator agent', role: 'acts for you', needs: ['inbox:read', 'mail:send'] },
  { who: 'Drafting sub-agent', role: 'acts for the agent', needs: ['inbox:read'] },
  { who: 'Sending sub-agent', role: 'acts for the agent', needs: ['mail:send'] },
]

const FULL_SCOPE = CHAIN[0].needs

export default function Delegation() {
  const [narrow, setNarrow] = useState(true)

  // Scope each hop actually holds: narrowed = exactly what it needs; full = everything.
  const held = (i) => (narrow ? CHAIN[i].needs : FULL_SCOPE)
  // Over-grant = scopes held but not needed.
  const over = (i) => held(i).filter((s) => !CHAIN[i].needs.includes(s))
  const actChain = (i) => CHAIN.slice(0, i + 1).map((c) => c.who.split(' ')[0]).join(' → ')

  const leaked = !narrow

  return (
    <section id="delegation">
      <div className="section-head">
        <div className="eyebrow">practice · lab</div>
        <h2><span className="fn">delegate</span><span className="pn">(user → agent → sub-agent)</span></h2>
        <p>
          An agent acts for you and hands work to sub-agents. Watch what each hop is allowed to do —
          and why <b className="tok-blue">narrowing scope on every hop</b> (RFC 8693 token exchange)
          is the whole ballgame.
        </p>
      </div>

      <div className="dlg-toggle">
        <button className={`dlg-mode ${narrow ? 'on' : ''}`} onClick={() => setNarrow(true)}>
          ✓ narrow on each hop <span className="k">least privilege</span>
        </button>
        <button className={`dlg-mode ${!narrow ? 'on bad' : ''}`} onClick={() => setNarrow(false)}>
          ⚠ pass the full token <span className="k">over-grant</span>
        </button>
      </div>

      <div className="dlg-chain">
        {CHAIN.map((c, i) => (
          <div className={`dlg-node ${over(i).length ? 'over' : ''}`} key={c.who}>
            <div className="dlg-top">
              <span className="dlg-who">{c.who}</span>
              <span className="dlg-role">{c.role}</span>
            </div>
            <div className="dlg-scopes">
              {held(i).map((s) => (
                <span className={`scope ${!CHAIN[i].needs.includes(s) ? 'unused' : ''}`} key={s}>{s}</span>
              ))}
            </div>
            {over(i).length > 0 && (
              <div className="dlg-warn">⚠ holds {over(i).length} scope{over(i).length > 1 ? 's' : ''} it never needs</div>
            )}
            <div className="dlg-act">act: {actChain(i)}</div>
          </div>
        ))}
      </div>

      <div className={`dlg-verdict ${leaked ? 'bad' : 'good'}`}>
        {leaked
          ? '✗ Over-granted: if any sub-agent is compromised or prompt-injected, it can read your inbox AND your calendar AND send mail — the full token leaked downstream.'
          : '✓ Contained: each sub-agent holds only what it needs. A compromised sending sub-agent can send mail, but cannot read your inbox or calendar. Accountability stays traceable via the act chain.'}
      </div>

      <div className="dlg-note">
        This is the problem standards are racing to solve — see{' '}
        <Link to="/learn/agent-delegation">the delegation lesson</Link> and{' '}
        <Link to="/standards">the standards radar</Link>.
      </div>
    </section>
  )
}
