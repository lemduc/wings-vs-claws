import { useEffect } from 'react'

// Bare frame for embedding a single widget via iframe — no nav/sidebar chrome.
export default function Embed({ title, children }) {
  useEffect(() => {
    if (title) document.title = `${title} · Wings vs Claws`
  }, [title])
  return (
    <div className="embed">
      <div className="embed-body">{children}</div>
      <a className="embed-credit" href="https://wings-vs-claws.pages.dev/" target="_blank" rel="noreferrer">
        ▲ Wings vs Claws — learn agentic IAM ↗
      </a>
    </div>
  )
}
