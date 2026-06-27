import { HERMES_LAYERS, OPENCLAW_GATES } from '../data.js'

export default function Architecture() {
  return (
    <section id="architecture">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">under the hood</div>
          <h2><span className="fn">enforcement</span><span className="pn">.topology</span></h2>
          <p>
            Hermes stacks seven independent defensive layers; OpenClaw chains permission
            gates that each must say yes. Two different shapes of "least privilege."
          </p>
        </div>

        <div className="arch-grid">
          <div className="term">
            <div className="term-bar" style={{ borderBottomColor: 'var(--hermes-dim)' }}>
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="lbl">🪽 Hermes — defense-in-depth</span>
              <span className="fname">7 layers</span>
            </div>
            <div className="term-body">
              {HERMES_LAYERS.map((l, i) => (
                <div className="layer" key={i}>
                  <span className="n">{i + 1}</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="term">
            <div className="term-bar" style={{ borderBottomColor: 'var(--claw-dim)' }}>
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="lbl">🦞 OpenClaw — every gate must allow</span>
              <span className="fname">request → grant</span>
            </div>
            <div className="term-body">
              {OPENCLAW_GATES.map((g, i) => (
                <div className="gate" key={i}>
                  <span className="g">{g.gate}</span>
                  <div className="d">{g.detail}</div>
                </div>
              ))}
              <div className="gate-deny">→ action allowed only if all gates pass · else deny</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
