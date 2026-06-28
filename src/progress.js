// Lightweight learning-progress tracking in localStorage.
import { useEffect, useState } from 'react'

const KEY = 'wvc-progress'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { viewed: {}, quiz: {} }
  } catch {
    return { viewed: {}, quiz: {} }
  }
}

function save(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
    window.dispatchEvent(new Event('wvc:progress'))
  } catch { /* ignore */ }
}

export function markViewed(slug) {
  const p = getProgress()
  if (!p.viewed[slug]) { p.viewed[slug] = true; save(p) }
}

export function recordQuiz(id, pct) {
  const p = getProgress()
  p.quiz[id] = Math.max(p.quiz[id] || 0, pct)
  save(p)
}

// Subscribe to progress changes.
export function useProgress() {
  const [p, setP] = useState(getProgress)
  useEffect(() => {
    const h = () => setP(getProgress())
    window.addEventListener('wvc:progress', h)
    return () => window.removeEventListener('wvc:progress', h)
  }, [])
  return p
}
