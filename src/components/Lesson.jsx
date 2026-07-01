import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { LESSONS } from '../data.js'
import { markViewed } from '../progress.js'
import Quiz from './Quiz.jsx'
import Linkify from './Linkify.jsx'

function Flow({ steps }) {
  return (
    <div className="flow">
      {steps.map((s, i) => (
        <div className="flow-step" key={i}>
          <div className="flow-box">
            <span className="flow-label">{s.label}</span>
            {s.sub && <span className="flow-sub">{s.sub}</span>}
          </div>
          {i < steps.length - 1 && <span className="flow-arrow">→</span>}
        </div>
      ))}
    </div>
  )
}

export default function Lesson() {
  const { slug } = useParams()
  const lesson = LESSONS.find((l) => l.slug === slug)
  const idx = LESSONS.findIndex((l) => l.slug === slug)

  useEffect(() => {
    if (lesson) markViewed(lesson.slug)
  }, [lesson])

  if (!lesson) return <Navigate to="/foundations" replace />

  const next = LESSONS[idx + 1]

  return (
    <article className="lesson">
      <div className="section-head">
        <div className="eyebrow">
          <Link to="/foundations" className="crumb">foundations</Link> / {lesson.level.toLowerCase()}
        </div>
        <h2>{lesson.icon} {lesson.title}</h2>
        <p className="lesson-tldr">{lesson.tldr}</p>
      </div>

      {lesson.flow && <Flow steps={lesson.flow} />}

      <div className="lesson-body">
        {lesson.sections.map((s) => (
          <div className="lesson-sec" key={s.h}>
            <h3>{s.h}</h3>
            <p><Linkify text={s.p} /></p>
          </div>
        ))}
      </div>

      <div className="agent-twist">
        <div className="at-head">🤖 how it changes for agents</div>
        <p><Linkify text={lesson.agentTwist} /></p>
      </div>

      {lesson.code && (
        <div className="lesson-code">
          <div className="lc-label">{lesson.code.label}</div>
          <pre><code>{lesson.code.body}</code></pre>
        </div>
      )}

      <Quiz questions={lesson.quiz} id={`lesson:${lesson.slug}`} title={`check: ${lesson.title}`} />

      <div className="lesson-foot">
        <div className="related">
          {lesson.related.map((r) => (
            <Link key={r.to} to={r.to} className="rel-link">→ {r.label}</Link>
          ))}
        </div>
        {next ? (
          <Link to={`/learn/${next.slug}`} className="btn next-lesson">next: {next.title} →</Link>
        ) : (
          <Link to="/quiz" className="btn next-lesson">take the full quiz →</Link>
        )}
      </div>
    </article>
  )
}
