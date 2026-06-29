import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { NAV } from '../nav.js'
import ThemeToggle from './ThemeToggle.jsx'
import CommandPalette from './CommandPalette.jsx'
import Seo from './Seo.jsx'

function openPalette() {
  window.dispatchEvent(new CustomEvent('wvc:open-palette'))
}

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  // Scroll to top on route change; close the mobile drawer.
  useEffect(() => {
    window.scrollTo(0, 0)
    setNavOpen(false)
  }, [pathname])

  return (
    <div className="app">
      <Seo />
      <CommandPalette />
      <a className="skip-link" href="#main">skip to content</a>

      <header className="topbar">
        <button className="hamburger" onClick={() => setNavOpen((o) => !o)} aria-label="Toggle navigation">≡</button>
        <NavLink to="/" className="brand">
          <span className="w">wings</span><span className="slash">/</span><span className="c">claws</span>
          <span className="comment"> :: iam</span>
        </NavLink>
        <div className="topbar-right">
          <ThemeToggle />
          <button className="kbtn" onClick={openPalette} aria-label="Open command palette">⌘K</button>
        </div>
      </header>

      <div className="shell">
        <aside className={`sidebar ${navOpen ? 'open' : ''}`}>
          <nav className="sidenav">
            {NAV.map((section) => (
              <div className="sidesection" key={section.title}>
                <div className="sidesection-title">{section.title}</div>
                {section.items.map((p) => (
                  <NavLink
                    key={p.path}
                    to={p.path}
                    end={p.path === '/'}
                    className={({ isActive }) => `sidelink ${isActive ? 'active' : ''}`}
                  >
                    <span className="si">{p.icon}</span>
                    <span className="sl">
                      <span className="slabel">{p.label}</span>
                      <span className="sblurb">{p.blurb}</span>
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidefoot">
            <button className="palette-cue" onClick={openPalette}>
              <span>search</span><kbd>⌘K</kbd>
            </button>
          </div>
        </aside>

        {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

        <main className="content" id="main">
          <Suspense fallback={<div className="page-loading">loading<span className="caret" /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
