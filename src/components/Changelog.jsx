import { CHANGES } from '../changelog.js'

export default function Changelog() {
  return (
    <section id="changelog">
      <div className="section-head">
        <div className="eyebrow">what’s new</div>
        <h2><span className="fn">changelog</span><span className="pn"> // releases</span></h2>
        <p>
          The site evolves as the agentic-IAM space does. Follow along via{' '}
          <a href="/feed.xml">RSS</a> or watch the{' '}
          <a href="https://github.com/lemduc/wings-vs-claws" target="_blank" rel="noreferrer">repo</a>.
        </p>
      </div>

      <div className="cl-list">
        {CHANGES.map((r) => (
          <div className="cl-rel" key={r.version}>
            <div className="cl-head">
              <span className="cl-ver">v{r.version}</span>
              <span className="cl-title">{r.title}</span>
              <span className="cl-date">{r.date}</span>
            </div>
            <ul className="cl-items">
              {r.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
