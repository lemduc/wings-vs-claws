import { useCallback, useEffect, useRef, useState } from 'react'
import { HERMES_LAYERS, THREATS } from '../data.js'

const LIVES = 3

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Game() {
  const [phase, setPhase] = useState('idle') // idle | playing | over
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [resolved, setResolved] = useState(null) // null | { ok, correctLayer }
  const [best, setBest] = useState(0)

  const tick = useRef(null)
  const pending = useRef([])
  const livesRef = useRef(LIVES)
  const progressRef = useRef(0)
  const scoreRef = useRef(0)
  const idxRef = useRef(0)
  const streakRef = useRef(0)
  const resolvedRef = useRef(null)
  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { progressRef.current = progress }, [progress])
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { idxRef.current = idx }, [idx])
  useEffect(() => { streakRef.current = streak }, [streak])
  useEffect(() => { resolvedRef.current = resolved }, [resolved])

  // Every deferred transition (advance / finish) is registered here so it can
  // be cancelled. Previously these timers were fire-and-forget: leaving the
  // page mid-round left them to run against an unmounted component, and a
  // restart could not cancel work the previous round had already scheduled.
  const clearPending = useCallback(() => {
    pending.current.forEach(clearTimeout)
    pending.current = []
  }, [])

  const later = useCallback((fn, ms) => {
    pending.current.push(setTimeout(fn, ms))
  }, [])

  useEffect(() => () => { clearPending(); clearInterval(tick.current) }, [clearPending])

  useEffect(() => {
    try { setBest(Number(localStorage.getItem('wvc-best') || 0)) } catch { /* ignore */ }
  }, [])

  const threat = phase === 'playing' ? queue[idx] : null

  const start = useCallback(() => {
    clearPending()
    clearInterval(tick.current)
    setQueue(shuffle([...THREATS, ...THREATS, ...THREATS]))
    setIdx(0); setProgress(0); setLives(LIVES); setScore(0); setStreak(0)
    resolvedRef.current = null
    setResolved(null); setPhase('playing')
  }, [clearPending])

  const finish = useCallback(() => {
    clearInterval(tick.current)
    clearPending()
    setPhase('over')
  }, [clearPending])

  // Persist the high score as an effect — state updaters must stay pure.
  useEffect(() => {
    if (phase !== 'over') return
    try {
      const b = Number(localStorage.getItem('wvc-best') || 0)
      if (scoreRef.current > b) {
        localStorage.setItem('wvc-best', String(scoreRef.current))
        setBest(scoreRef.current)
      }
    } catch { /* ignore */ }
  }, [phase])

  const advance = useCallback(() => {
    if (idxRef.current + 1 >= queue.length) { finish(); return }
    resolvedRef.current = null
    setResolved(null); setProgress(0)
    setIdx((i) => i + 1)
  }, [queue.length, finish])

  // Resolve the current threat — either the player armed a layer, or it breached.
  const resolve = useCallback((ok, correctLayer) => {
    clearInterval(tick.current)
    resolvedRef.current = { ok, correctLayer }
    setResolved(resolvedRef.current)
    if (ok) {
      const bonus = Math.round(100 - progressRef.current) // earlier block = more points
      setScore((s) => s + 100 + bonus)
      setStreak((s) => s + 1)
      later(advance, 850)
    } else {
      setStreak(0)
      const nl = livesRef.current - 1
      setLives(nl)
      if (nl <= 0) later(finish, 1500)
      else later(advance, 1500)
    }
  }, [advance, finish, later])

  // Drive the threat toward the core. Speed reads score/streak through refs so
  // the interval keeps its 90ms cadence instead of being torn down and
  // recreated on every point scored.
  useEffect(() => {
    if (phase !== 'playing' || resolved || !threat) return
    tick.current = setInterval(() => {
      const step = 1.0 + Math.min(scoreRef.current / 1400, 1.7) + streakRef.current * 0.04
      const np = Math.min(progressRef.current + step, 100)
      progressRef.current = np
      setProgress(np)
      // A threat that reaches the core breaches. Decided here in the timer
      // rather than inside a state updater, which must stay pure. The ref
      // guard stops a tick that lands before the effect tears the interval
      // down from resolving the same threat twice.
      if (np >= 100 && !resolvedRef.current) resolve(false, threat.layer)
    }, 90)
    return () => clearInterval(tick.current)
  }, [phase, idx, resolved, threat, resolve])

  const pick = useCallback((n) => {
    if (phase !== 'playing' || resolved || !threat) return
    resolve(n === threat.layer, threat.layer)
  }, [phase, resolved, threat, resolve])

  // Keyboard: 1-N to arm a layer, Enter to start / restart.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Enter' && phase !== 'playing') { start(); return }
      const n = Number(e.key)
      if (n >= 1 && n <= HERMES_LAYERS.length) pick(n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, pick, start])

  return (
    <section id="game">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">mini-game</div>
          <h1><span className="fn">defenseInDepth</span><span className="pn">()</span></h1>
          <p>
            Threats race toward the core. Arm the Hermes layer that actually stops each one —
            press <b>1–{HERMES_LAYERS.length}</b> or click. Block it before it lands. Three cores. Go.
          </p>
        </div>

        <div className="game term">
          <div className="term-bar">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="lbl">🪽 defense-in-depth.exe</span>
            <span className="fname">
              {'♥'.repeat(Math.max(0, lives))}<span className="lost">{'♥'.repeat(LIVES - Math.max(0, lives))}</span>
              {'  score '}{score}{'  best '}{Math.max(best, score)}
            </span>
          </div>

          <div className="game-body">
            {phase === 'idle' && (
              <div className="game-cta">
                <pre className="ascii">{`   threats  →→→   [ 🔒 CORE ]`}</pre>
                <p>Arm the right layer to block each threat. One wrong call (or a miss) costs a core.</p>
                <button className="btn" onClick={start}>▶ start  <span className="k">(enter)</span></button>
              </div>
            )}

            {phase === 'over' && (
              <div className="game-cta">
                <pre className="ascii">{lives > 0 ? '   ✓ ALL THREATS REPELLED' : '   ✗ CORE BREACHED'}</pre>
                <p>final score <b className="tok-green">{score}</b> · best <b className="tok-blue">{Math.max(best, score)}</b></p>
                <button className="btn" onClick={start}>↻ play again  <span className="k">(enter)</span></button>
              </div>
            )}

            {phase === 'playing' && threat && (
              <>
                <div className="track">
                  <div className="threat" style={{ left: `calc(${progress}% - 18px)` }}>
                    <span className="ico">{threat.icon}</span>
                  </div>
                  <div className="core">🔒</div>
                  <div className="track-line" />
                </div>

                <div className={`threat-card ${resolved ? (resolved.ok ? 'ok' : 'bad') : ''}`}>
                  <span className="tname">{threat.icon} {threat.name}</span>
                  <span className="tdesc">{threat.desc}</span>
                  {resolved && (
                    <span className="verdict">
                      {resolved.ok
                        ? `✓ blocked at layer ${resolved.correctLayer} — ${HERMES_LAYERS[resolved.correctLayer - 1].short}`
                        : `✗ breached — layer ${resolved.correctLayer} (${HERMES_LAYERS[resolved.correctLayer - 1].short}) was the stop`}
                    </span>
                  )}
                </div>

                <div className="layers-grid">
                  {HERMES_LAYERS.map((l, i) => {
                    const n = i + 1
                    const isCorrect = resolved && resolved.correctLayer === n
                    const isWrongPick = resolved && !resolved.ok && resolved.correctLayer === n
                    return (
                      <button
                        key={n}
                        className={`layer-btn ${isCorrect ? 'correct' : ''} ${isWrongPick ? 'reveal' : ''}`}
                        onClick={() => pick(n)}
                        disabled={!!resolved}
                      >
                        <span className="ln">{n}</span>
                        <span className="ll">{l.short}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="game-hud">
                  <span>streak <b className="tok-blue">{streak}</b></span>
                  <span className="bar"><i style={{ width: `${100 - progress}%` }} /></span>
                  <span className="cores">{'🔒'.repeat(Math.max(0, lives))}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="disclaimer">each threat→layer mapping follows Hermes's documented defense-in-depth model</div>
      </div>
    </section>
  )
}
