// Cloudflare Worker: serve the static assets and attach security headers.
// SPA fallback + prerendered per-route HTML are handled by the assets binding.
const CSP_BASE =
  "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
  "script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; " +
  "base-uri 'self'; object-src 'none'; form-action 'self'; "

export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request)
    const headers = new Headers(res.headers)
    const path = new URL(request.url).pathname

    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
    // The /embed/* widgets are meant to be framed anywhere; everything else is same-origin only.
    const frameAncestors = path.startsWith('/embed') ? "frame-ancestors *" : "frame-ancestors 'self'"
    headers.set('Content-Security-Policy', CSP_BASE + frameAncestors)

    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
}
