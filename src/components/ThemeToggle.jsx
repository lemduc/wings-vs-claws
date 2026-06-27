import { useEffect, useState } from 'react'

function getInitial() {
  try {
    const saved = localStorage.getItem('wvc-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* ignore */ }
  return document.documentElement.getAttribute('data-theme') || 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('wvc-theme', theme) } catch { /* ignore */ }
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === 'dark' ? '☀ light' : '☾ dark'}
    </button>
  )
}
