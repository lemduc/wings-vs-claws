import { CASES } from '../data.js'

export default function Cases() {
  return (
    <section id="cases">
      <div className="section-head">
        <div className="eyebrow">reference · learn from failure</div>
        <h2><span className="fn">caseFiles</span><span className="pn">[]</span></h2>
        <p>
          Real (and representative) ways agent &amp; non-human identity goes wrong — and the one
          control that would have changed the outcome.
        </p>
      </div>

      <div className="cases">
        {CASES.map((c) => (
          <div className="case" key={c.id}>
            <div className="case-head">
              <span className="case-icon">{c.icon}</span>
              <div className="case-title-wrap">
                <div className="case-title">{c.title}</div>
                <div className="case-meta">
                  <span>{c.year}</span>
                  <span className={`case-sev ${c.severity === 'real incident' ? 'real' : ''}`}>{c.severity}</span>
                  <span className="case-era">{c.era}</span>
                </div>
              </div>
            </div>
            <div className="case-row"><span className="case-k">what happened</span><span className="case-v">{c.what}</span></div>
            <div className="case-row"><span className="case-k">the identity angle</span><span className="case-v">{c.identity}</span></div>
            <div className="case-row stop"><span className="case-k">what stops it</span><span className="case-v">{c.stopper}</span></div>
            <div className="case-foot">
              <span className="case-maps">maps to: {c.maps}</span>
              <a href={c.source} target="_blank" rel="noreferrer">source ↗</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
