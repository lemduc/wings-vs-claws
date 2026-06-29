import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'

// Route-level code-splitting: each page loads as its own chunk on demand.
const Hero = lazy(() => import('./components/Hero.jsx'))
const Verdict = lazy(() => import('./components/Verdict.jsx'))
const Simulator = lazy(() => import('./components/Simulator.jsx'))
const Compare = lazy(() => import('./components/Compare.jsx'))
const Architecture = lazy(() => import('./components/Architecture.jsx'))
const Playground = lazy(() => import('./components/Playground.jsx'))
const Game = lazy(() => import('./components/Game.jsx'))
const Glossary = lazy(() => import('./components/Glossary.jsx'))
const Sources = lazy(() => import('./components/Sources.jsx'))
const Journey = lazy(() => import('./components/Journey.jsx'))
const StartHere = lazy(() => import('./components/StartHere.jsx'))
const Foundations = lazy(() => import('./components/Foundations.jsx'))
const Lesson = lazy(() => import('./components/Lesson.jsx'))
const QuizPage = lazy(() => import('./components/QuizPage.jsx'))
const Cases = lazy(() => import('./components/Cases.jsx'))
const Standards = lazy(() => import('./components/Standards.jsx'))
const Delegation = lazy(() => import('./components/Delegation.jsx'))
const OAuthFlow = lazy(() => import('./components/OAuthFlow.jsx'))

function Overview() {
  return (<><Hero /><Verdict /></>)
}
function GlossaryPage() {
  return (<><Glossary /><Sources /></>)
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/learn" element={<StartHere />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="/learn/:slug" element={<Lesson />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/trace" element={<Simulator />} />
          <Route path="/delegation" element={<Delegation />} />
          <Route path="/oauth-flow" element={<OAuthFlow />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/topology" element={<Architecture />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/game" element={<Game />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="*" element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
