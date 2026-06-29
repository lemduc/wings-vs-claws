import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Hero from './components/Hero.jsx'
import Verdict from './components/Verdict.jsx'
import Simulator from './components/Simulator.jsx'
import Compare from './components/Compare.jsx'
import Architecture from './components/Architecture.jsx'
import Playground from './components/Playground.jsx'
import Game from './components/Game.jsx'
import Glossary from './components/Glossary.jsx'
import Sources from './components/Sources.jsx'
import Journey from './components/Journey.jsx'
import StartHere from './components/StartHere.jsx'
import Foundations from './components/Foundations.jsx'
import Lesson from './components/Lesson.jsx'
import QuizPage from './components/QuizPage.jsx'
import Cases from './components/Cases.jsx'
import Standards from './components/Standards.jsx'

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
