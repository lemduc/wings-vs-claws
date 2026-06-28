import { Link } from 'react-router-dom'
import { LEARNING_PATHS, LESSONS } from '../data.js'
import { useProgress } from '../progress.js'

export default function StartHere() {
  const progress = useProgress()
  const lessonsRead = LESSONS.filter((l) => progress.viewed[l.slug]).length
  const quizzesTaken = Object.keys(progress.quiz).length
  const totalSteps = LESSONS.length
  const pctRead = Math.round((lessonsRead / totalSteps) * 100)

  // Simple badges derived from progress.
  const badges = [
    { id: 'starter', label: 'First lesson', got: lessonsRead >= 1 },
    { id: 'half', label: 'Halfway', got: lessonsRead >= Math.ceil(totalSteps / 2) },
    { id: 'foundations', label: 'Foundations complete', got: lessonsRead >= totalSteps },
    { id: 'quizzer', label: 'Quiz taker', got: quizzesTaken >= 1 },
    { id: 'ace', label: 'Quiz ace (≥80%)', got: Object.values(progress.quiz).some((s) => s >= 80) },
  ]

  return (
    <section id="start">
      <div className="section-head">
        <div className="eyebrow">start here</div>
        <h2>Learn IAM — from directories to agents</h2>
        <p>
          A hands-on tour of identity &amp; access management, ending where it gets hard: autonomous
          AI agents. Pick a path by where you’re starting from.
        </p>
      </div>

      <div className="progress-strip">
        <div className="ps-bar"><i style={{ width: `${pctRead}%` }} /></div>
        <div className="ps-meta">{lessonsRead}/{totalSteps} lessons · {quizzesTaken} quizzes taken</div>
        <div className="ps-badges">
          {badges.map((b) => (
            <span key={b.id} className={`badge ${b.got ? 'got' : ''}`} title={b.label}>
              {b.got ? '★' : '☆'} {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="paths">
        {LEARNING_PATHS.map((p) => (
          <div className="path" key={p.id}>
            <div className="path-head">
              <span className="path-icon">{p.icon}</span>
              <div>
                <div className="path-title">{p.title}</div>
                <div className="path-who">{p.who}</div>
              </div>
            </div>
            <ol className="path-steps">
              {p.steps.map((s, i) => {
                const isLesson = s.to.startsWith('/learn/')
                const slug = isLesson ? s.to.replace('/learn/', '') : null
                const done = slug && progress.viewed[slug]
                return (
                  <li key={s.to + i}>
                    <Link to={s.to} className={done ? 'done' : ''}>
                      <span className="step-n">{i + 1}</span>{s.label}{done && <span className="step-done">✓</span>}
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>

      <Link to="/foundations" className="journey-cta">
        <span className="jc-k">›</span>
        <span>Or just start at the beginning — the Foundations lessons</span>
        <span className="jc-arrow">→</span>
      </Link>
    </section>
  )
}
