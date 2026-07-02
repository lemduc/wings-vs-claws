// Cloudflare Worker: serves the static assets with security headers, and hosts
// a tiny DEMO authorization server for the live PKCE lab (/api/oauth/*).
// SPA fallback + prerendered per-route HTML are handled by the assets binding.
const CSP_BASE =
  "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
  "script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; " +
  "base-uri 'self'; object-src 'none'; form-action 'self'; "

// ---------- demo authorization server (PKCE, RFC 7636) ----------------------
// Stateless: the "authorization code" encodes {challenge, scope, exp}. The
// token endpoint re-derives S256(code_verifier) and compares — a REAL PKCE
// verification. Tokens are unsigned demo JWTs with zero privileges.
const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const b64urlDecode = (s) => {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/')
  return atob(pad + '='.repeat((4 - (pad.length % 4)) % 4))
}

async function s256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return b64url(digest)
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

async function handleOAuth(request, path) {
  if (request.method !== 'POST') return json({ error: 'invalid_request', hint: 'POST only' }, 405)
  let body
  try { body = await request.json() } catch { return json({ error: 'invalid_request', hint: 'JSON body required' }, 400) }

  if (path === '/api/oauth/authorize') {
    const { code_challenge, code_challenge_method, scope } = body
    if (code_challenge_method !== 'S256') {
      return json({ error: 'invalid_request', hint: 'only S256 is accepted (plain is unsafe)' }, 400)
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(code_challenge || '')) {
      return json({ error: 'invalid_request', hint: 'code_challenge must be base64url(SHA-256(verifier))' }, 400)
    }
    // "User consents" — a real AS would authenticate the user here.
    const code = b64url(new TextEncoder().encode(JSON.stringify({
      c: code_challenge,
      s: String(scope || 'demo:read').slice(0, 64),
      exp: Date.now() + 120_000, // 2-minute code lifetime
    })))
    return json({ code, note: 'authorization code issued — exchange it within 120s' })
  }

  if (path === '/api/oauth/token') {
    const { code, code_verifier } = body
    let payload
    try { payload = JSON.parse(b64urlDecode(String(code || ''))) } catch {
      return json({ error: 'invalid_grant', hint: 'malformed authorization code' }, 400)
    }
    if (Date.now() > payload.exp) return json({ error: 'invalid_grant', hint: 'code expired (120s lifetime)' }, 400)
    if (!/^[A-Za-z0-9_-]{43,128}$/.test(String(code_verifier || ''))) {
      return json({ error: 'invalid_request', hint: 'code_verifier must be 43–128 unreserved chars (RFC 7636)' }, 400)
    }
    const derived = await s256(code_verifier)
    if (derived !== payload.c) {
      // The whole point of PKCE: a stolen code without the verifier is useless.
      return json({ error: 'invalid_grant', hint: `S256(code_verifier) = ${derived.slice(0, 12)}… does not match the code_challenge bound to this code` }, 401)
    }
    const now = Math.floor(Date.now() / 1000)
    const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'none', typ: 'JWT' })))
    const claims = b64url(new TextEncoder().encode(JSON.stringify({
      iss: 'https://iam.vjsonline.org/api/oauth',
      sub: 'user:demo',
      act: { sub: 'agent:demo' },        // the on-behalf-of chain from the lessons
      scope: payload.s,
      iat: now,
      exp: now + 300,
      demo: 'unsigned token — zero privileges, for learning only',
    })))
    return json({
      access_token: `${header}.${claims}.`,
      token_type: 'Bearer',
      expires_in: 300,
      scope: payload.s,
    })
  }

  return json({ error: 'invalid_request' }, 404)
}

// ---------- main fetch -------------------------------------------------------
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname

    if (path.startsWith('/api/oauth/')) {
      const res = await handleOAuth(request, path)
      res.headers.set('X-Content-Type-Options', 'nosniff')
      return res
    }

    const res = await env.ASSETS.fetch(request)
    const headers = new Headers(res.headers)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
    // The /embed/* widgets are meant to be framed anywhere; everything else is same-origin only.
    const frameAncestors = path.startsWith('/embed') ? 'frame-ancestors *' : "frame-ancestors 'self'"
    headers.set('Content-Security-Policy', CSP_BASE + frameAncestors)

    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
}
