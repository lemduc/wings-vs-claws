import { Link } from 'react-router-dom'
import { LESSONS } from '../data.js'
import { useProgress } from '../progress.js'

export default function Foundations() {
  const progress = useProgress()
  const viewedCount = LESSONS.filter((l) => progress.viewed[l.slug]).length

  return (
    <section id="foundations">
      <div className="section-head">
        <div className="eyebrow">learn · core concepts</div>
        <h2><span className="fn">foundations</span><span className="pn">.iam</span></h2>
        <p>
          The IAM primitives, each as a short visual lesson with a "how it changes for agents"
          twist and a quick knowledge check. {viewedCount}/{LESSONS.length} read.
        </p>
      </div>

      <div className="lesson-grid">
        {LESSONS.map((l, i) => {
          const viewed = !!progress.viewed[l.slug]
          const score = progress.quiz[`lesson:${l.slug}`]
          return (
            <Link key={l.slug} to={`/learn/${l.slug}`} className={`lesson-card ${viewed ? 'viewed' : ''}`}>
              <div className="lc-top">
                <span className="lc-icon">{l.icon}</span>
                <span className="lc-n">{String(i + 1).padStart(2, '0')}</span>
                <span className={`lc-level lv-${l.level.toLowerCase()}`}>{l.level}</span>
                {viewed && <span className="lc-check">✓</span>}
              </div>
              <div className="lc-title">{l.title}</div>
              <div className="lc-tldr">{l.tldr}</div>
              {score != null && <div className="lc-score">quiz best: {score}%</div>}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
