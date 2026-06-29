import { SOURCES } from '../data.js'
import { SITE } from '../seo.js'

export default function Sources() {
  return (
    <div className="sources">
      <h5>sources</h5>
      <ul>
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
          </li>
        ))}
      </ul>
      <p className="fine">
        Wings/Claws :: iam is an independent, unofficial comparison built for demonstration —
        not affiliated with Nous Research or the OpenClaw project. IAM claims are drawn from each
        project's published security documentation (retrieved June 2026); the simulator presents
        illustrative traces of documented mechanisms, not live runs or transcripts. Security
        posture and defaults change quickly — verify against the official docs before relying on
        any control here.
      </p>
      <p className="updated">Last updated {SITE.lastUpdated} · v{SITE.version} · <a href="/changelog">changelog</a> · <a href="https://github.com/lemduc/wings-vs-claws/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">contribute</a> · <a href="https://github.com/lemduc/wings-vs-claws" target="_blank" rel="noreferrer">source ↗</a></p>
    </div>
  )
}
