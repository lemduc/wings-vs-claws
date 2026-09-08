import { Link } from 'react-router-dom'
import { NAV } from '../nav.js'

// Real 404 page. The Worker serves this shell with a 404 status (see
// worker.js), so unknown URLs are not soft-404s that duplicate the homepage.
export default function NotFound() {
  return (
    <section id="notfound">
      <div className="section-head">
        <div className="eyebrow">404</div>
        <h1><span className="fn">resolve</span><span className="pn">(path) // no such route</span></h1>
        <p>
          That page does not exist. In IAM terms: the principal is fine, the resource is not.
          Try one of these instead, or press <kbd>⌘K</kbd> to search.
        </p>
      </div>

      <div className="nf-groups">
        {NAV.map((section) => (
          <div className="nf-group" key={section.title}>
            <div className="sidesection-title">{section.title}</div>
            <ul>
              {section.items.map((p) => (
                <li key={p.path}>
                  <Link to={p.path}>{p.label}</Link>
                  <span className="nf-blurb"> — {p.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
