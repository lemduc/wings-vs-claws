import { useState } from 'react'

// ---- live PKCE lab helpers (real WebCrypto, real server-side verification) --
const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

function randomVerifier() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return b64url(bytes) // 43 chars, RFC 7636 compliant
}

async function s256(text) {
  return b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
}

function decodeJwtClaims(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload + '='.repeat((4 - (payload.length % 4)) % 4)))
  } catch { return null }
}

const ACTORS = ['User', 'App', 'Authz Server', 'Resource']

// Authorization Code flow (the OAuth 2.0 / OIDC workhorse).
const STEPS = [
  { from: 'User', to: 'App', msg: 'click "Connect"', detail: 'You ask the app to act on your behalf — e.g. read your calendar.' },
  { from: 'App', to: 'Authz Server', msg: 'redirect: client_id, scope, redirect_uri', detail: 'The app sends you to the authorization server with what it wants (scope) and where to return.' },
  { from: 'Authz Server', to: 'User', msg: 'authenticate + consent', detail: 'You log in at the authorization server and approve the requested scopes. The app never sees your password.' },
  { from: 'Authz Server', to: 'App', msg: 'redirect back: authorization code', detail: 'A short-lived, single-use code is handed to the app via the redirect — not the token yet.' },
  { from: 'App', to: 'Authz Server', msg: 'POST /token: code + client secret', detail: 'On its server, the app exchanges the code (plus its secret / PKCE) for tokens. This back-channel call keeps tokens off the browser.' },
  { from: 'Authz Server', to: 'App', msg: 'access token (+ id token)', detail: 'The app receives a scoped, expiring access token. With OIDC it also gets an id token saying who you are.' },
  { from: 'App', to: 'Resource', msg: 'GET /api + Bearer token', detail: 'The app calls the resource API, presenting the access token.' },
  { from: 'Resource', to: 'App', msg: 'verify scope → data', detail: 'The resource checks the token’s scope and returns only what was authorized. Authorization happens here, every call.' },
]

export default function OAuthFlow() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]

  return (
    <section id="oauth-flow">
      <div className="section-head">
        <div className="eyebrow">practice · lab</div>
        <h2><span className="fn">oauthCodeFlow</span><span className="pn">() // step {step + 1}/{STEPS.length}</span></h2>
        <p>
          The Authorization Code flow, one message at a time — how an app (or an agent) gets
          scoped access without ever seeing your password.
        </p>
      </div>

      <div className="oauth-actors">
        {ACTORS.map((a) => (
          <div
            key={a}
            className={`oauth-actor ${s.from === a ? 'active-from' : ''} ${s.to === a ? 'active-to' : ''}`}
          >
            <span className="oa-name">{a}</span>
          </div>
        ))}
      </div>

      <div className="oauth-msg">
        <div className="om-route">
          <span className="om-from">{s.from}</span>
          <span className="om-arrow">──▶</span>
          <span className="om-to">{s.to}</span>
        </div>
        <div className="om-line"><span className="prompt" />{s.msg}</div>
        <div className="om-detail">{s.detail}</div>
      </div>

      <div className="oauth-track">
        {STEPS.map((_, i) => (
          <button
            key={i}
            className={`ot-dot ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
            aria-label={`step ${i + 1}`}
          />
        ))}
      </div>

      <div className="oauth-actions">
        <button className="btn ghost" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>← prev</button>
        {step < STEPS.length - 1 ? (
          <button className="btn" onClick={() => setStep((x) => x + 1)}>next →</button>
        ) : (
          <button className="btn" onClick={() => setStep(0)}>↻ replay</button>
        )}
      </div>

      <LiveLab />
    </section>
  )
}

// ---- the live lab: real PKCE against this site's demo authorization server --
function LiveLab() {
  const [log, setLog] = useState([])
  const [busy, setBusy] = useState(false)
  const [claims, setClaims] = useState(null)

  const add = (cls, text) => setLog((l) => [...l, { cls, text }])

  async function run(tamper) {
    setBusy(true); setLog([]); setClaims(null)
    try {
      const verifier = randomVerifier()
      const challenge = await s256(verifier)
      add('info', `generated code_verifier   ${verifier}`)
      add('info', `S256 → code_challenge     ${challenge}`)

      add('send', 'POST /api/oauth/authorize  { code_challenge, method: S256 }')
      const authz = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code_challenge: challenge, code_challenge_method: 'S256', scope: 'demo:read' }),
      })
      if (!authz.ok) throw new Error(`authorize failed (${authz.status}) — the live endpoints run on the deployed site (iam.vjsonline.org), not the local dev server`)
      const { code } = await authz.json()
      add('recv', `← authorization code       ${code.slice(0, 28)}…`)

      const sentVerifier = tamper ? randomVerifier() : verifier
      if (tamper) add('warn', `TAMPERING: exchanging with a different verifier ${sentVerifier.slice(0, 16)}… (simulating a stolen code)`)

      add('send', 'POST /api/oauth/token      { code, code_verifier }')
      const tok = await fetch('/api/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: sentVerifier }),
      })
      const data = await tok.json()
      if (!tok.ok) {
        add('err', `← ${tok.status} ${data.error}: ${data.hint}`)
        add('ok', '✓ PKCE did its job — a stolen code is useless without the original verifier')
      } else {
        add('recv', `← access_token (${data.token_type}, ${data.expires_in}s, scope: ${data.scope})`)
        setClaims(decodeJwtClaims(data.access_token))
        add('ok', '✓ real exchange complete — the server verified S256(verifier) == challenge')
      }
    } catch (e) {
      add('err', String(e.message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="livelab term">
      <div className="term-bar">
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="lbl">⚡ try it live</span>
        <span className="fname">real PKCE · demo authorization server</span>
      </div>
      <div className="term-body">
        <p className="ll-intro">
          This runs a <b>real</b> PKCE exchange: your browser generates the verifier with
          WebCrypto, and this site's server actually verifies <code>S256(code_verifier)</code>{' '}
          before issuing a token. The token is an unsigned demo JWT with zero privileges.
        </p>
        <div className="ll-actions">
          <button className="btn" onClick={() => run(false)} disabled={busy}>▶ run the real flow</button>
          <button className="btn ghost" onClick={() => run(true)} disabled={busy}>☠ steal the code (wrong verifier)</button>
        </div>
        {log.length > 0 && (
          <div className="ll-log">
            {log.map((l, i) => <div key={i} className={`ll-line ${l.cls}`}>{l.text}</div>)}
          </div>
        )}
        {claims && (
          <pre className="ll-claims">{JSON.stringify(claims, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
