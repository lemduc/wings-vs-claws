import { useMemo, useState } from 'react'
import { recordQuiz } from '../progress.js'

// Reusable quiz runner. `questions` = [{ q, options, answer, explain }].
// `id` is the progress key; `title` optional.
export default function Quiz({ questions, id, title = 'knowledge check' }) {
  const [picks, setPicks] = useState({})
  const [done, setDone] = useState(false)

  const score = useMemo(
    () => questions.reduce((n, q, i) => n + (picks[i] === q.answer ? 1 : 0), 0),
    [picks, questions],
  )
  const pct = Math.round((score / questions.length) * 100)
  const allAnswered = Object.keys(picks).length === questions.length

  function choose(qi, oi) {
    if (done) return
    setPicks((p) => ({ ...p, [qi]: oi }))
  }
  function submit() {
    setDone(true)
    if (id) recordQuiz(id, pct)
  }
  function reset() {
    setPicks({}); setDone(false)
  }

  return (
    <div className="quiz">
      <div className="quiz-head">
        <span className="qh-label">✓ {title}</span>
        {done && <span className={`qh-score ${pct >= 67 ? 'pass' : 'fail'}`}>{score}/{questions.length} · {pct}%</span>}
      </div>

      {questions.map((q, qi) => (
        <div className="qz" key={qi}>
          <div className="qz-q"><span className="qz-n">{qi + 1}.</span> {q.q}</div>
          <div className="qz-opts">
            {q.options.map((o, oi) => {
              const picked = picks[qi] === oi
              let cls = ''
              if (done) {
                if (oi === q.answer) cls = 'correct'
                else if (picked) cls = 'wrong'
              } else if (picked) cls = 'picked'
              return (
                <button key={oi} className={`qz-opt ${cls}`} onClick={() => choose(qi, oi)} disabled={done}>
                  <span className="qz-mark">{String.fromCharCode(97 + oi)}</span>{o}
                </button>
              )
            })}
          </div>
          {done && <div className="qz-explain">// {q.explain}</div>}
        </div>
      ))}

      <div className="quiz-actions">
        {!done ? (
          <button className="btn" onClick={submit} disabled={!allAnswered}>submit ↵</button>
        ) : (
          <>
            <span className={`quiz-verdict ${pct >= 67 ? 'pass' : 'fail'}`}>
              {pct >= 67 ? '✓ passed' : '✗ review and retry'}
            </span>
            <button className="btn ghost" onClick={reset}>↻ retry</button>
          </>
        )}
      </div>
    </div>
  )
}
