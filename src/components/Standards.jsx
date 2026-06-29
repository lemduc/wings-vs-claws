import { STANDARDS, STANDARDS_SOURCES } from '../data.js'

const TRACK = {
  enterprise: { label: 'enterprise', cls: 'tr-ent' },
  agentic: { label: 'agentic', cls: 'tr-agt' },
  both: { label: 'both', cls: 'tr-both' },
}

export default function Standards() {
  return (
    <>
      <section id="standards">
        <div className="section-head">
          <div className="eyebrow">reference · the moving frontier</div>
          <h2><span className="fn">standards</span><span className="pn">.radar</span></h2>
          <p>
            Agentic IAM is being assembled from two directions: the <b className="tok-blue">enterprise</b> stack
            (OAuth, OIDC, SPIFFE) extended downward, and new <b className="tok-orange">agentic</b> work
            (MCP auth, on-behalf-of, NIST) built upward. Here’s what to watch.
          </p>
        </div>

        <div className="std-grid">
          {STANDARDS.map((s) => {
            const tr = TRACK[s.track]
            return (
              <div className={`std ${tr.cls}`} key={s.name}>
                <div className="std-top">
                  <span className="std-name">{s.name}</span>
                  <span className={`std-track ${tr.cls}`}>{tr.label}</span>
                </div>
                <div className="std-status">{s.status}</div>
                <div className="std-what">{s.what}</div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="sources">
        <h5>standards sources</h5>
        <ul>
          {STANDARDS_SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>
          ))}
        </ul>
        <p className="fine">
          Status and dates reflect public materials as of June 2026; agent-identity standards
          are moving fast — treat this as a snapshot, not a spec.
        </p>
      </div>
    </>
  )
}
