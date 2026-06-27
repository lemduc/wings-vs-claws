import { VERDICT } from '../data.js'

export default function Verdict() {
  return (
    <section id="verdict">
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
    </section>
  )
}
