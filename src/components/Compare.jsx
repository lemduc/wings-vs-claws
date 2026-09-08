import { IAM_DIMENSIONS, IAM_MATRIX, METHODOLOGY, VERIFIED } from '../data.js'

function Mark({ value, who }) {
  const map = { yes: ['✓', 'yes'], partial: ['◐', 'partial'], no: ['✗', 'no'] }
  const [glyph, cls] = map[value] || map.no
  return <span className={cls} data-who={who}>{glyph}</span>
}

export default function Compare() {
  return (
    <>
      <section id="compare">
        <div className="section-head">
          <div className="eyebrow">head to head</div>
          <h1><span className="fn">diff</span><span className="pn"> hermes.iam openclaw.iam</span></h1>
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
      </section>

      <section id="matrix">
        <div className="section-head">
          <div className="eyebrow">controls</div>
          <h2><span className="fn">capabilities</span><span className="pn">[]</span></h2>
          <p>✓ first-class · ◐ partial / possible · ✗ not a focus — as documented, verified {VERIFIED.label}.</p>
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

        <details className="methodology">
          <summary>How these ratings were made</summary>
          {METHODOLOGY.map((m) => (
            <div className="meth-sec" key={m.h}>
              <h3>{m.h}</h3>
              <p>{m.p}</p>
            </div>
          ))}
          <p className="meth-foot">
            Claims last checked against the projects’ live documentation in {VERIFIED.label}.
            Spotted something out of date?{' '}
            <a href="https://github.com/lemduc/wings-vs-claws/issues/new?template=content_suggestion.md" target="_blank" rel="noreferrer">
              open a content issue ↗
            </a>
          </p>
        </details>
      </section>
    </>
  )
}
