import { IAM_DIMENSIONS, IAM_MATRIX } from '../data.js'

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
      </section>

      <section id="matrix">
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
      </section>
    </>
  )
}
