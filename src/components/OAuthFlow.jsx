import { useState } from 'react'

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
    </section>
  )
}
