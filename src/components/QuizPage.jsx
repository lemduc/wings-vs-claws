import { LESSONS } from '../data.js'
import Quiz from './Quiz.jsx'

// Cumulative quiz: one question pulled from each lesson.
const QUESTIONS = LESSONS.map((l) => l.quiz[0]).filter(Boolean)

export default function QuizPage() {
  return (
    <section id="quiz">
      <div className="section-head">
        <div className="eyebrow">practice · test yourself</div>
        <h2><span className="fn">quiz</span><span className="pn">() // {QUESTIONS.length} questions</span></h2>
        <p>One question from each foundation lesson. Score ≥ 67% to pass — your best is saved.</p>
      </div>
      <Quiz questions={QUESTIONS} id="cumulative" title="IAM foundations — final check" />
    </section>
  )
}
