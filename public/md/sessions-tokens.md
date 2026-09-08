# Sessions, tokens & revocation

> Logging in is the easy part. The hard part is everything after: how the system keeps remembering you, how long that memory lasts, and how fast you can take it back.

## A session is a memory; a token is a claim

There are two ways to stay logged in. The server can keep a session record and hand you an opaque id that points at it — every request costs a lookup, but the server can end the session instantly. Or it can hand you a self-contained token that carries the claims and a signature — no lookup needed, which is why it scales, but the server has now given away a statement it cannot take back before expiry. Most modern stacks pick the second and then spend their effort managing that consequence.

## Four things decide whether a session is safe

How it is bound (a cookie with HttpOnly, Secure and SameSite, or a token bound to a key), how long it lives, how it is renewed — a refresh that rotates, so a stolen refresh token is detectable when it is replayed — and how it ends: logout, idle timeout, and an absolute lifetime. Getting one right and the other three wrong is the usual shape of a session bug.

## Revocation latency is the real exposure

Revoking access is not instant. There is a gap between disabling an account and the last valid token expiring, and inside that gap the credential still works. That window is the number worth knowing: a one-hour access token means up to an hour of access after you thought you had cut it off. Short lifetimes and rotation shrink the window; token introspection or a push signal like the OpenID Shared Signals Framework closes it, at the cost of a live dependency.

## Bearer tokens are cash; sender-constrained tokens are not

A bearer token grants access to whoever holds it — steal it and you are indistinguishable from the user. Sender-constrained tokens bind the token to a key the caller must prove it holds on every request: DPoP (RFC 9449) with a proof signature, or mTLS-bound tokens (RFC 8705) with a client certificate. A stolen token without the matching key is inert — the same idea as PKCE, applied to the token instead of the code.

## The receiver has to actually check

A signature only helps if someone verifies it, and verification means more than "does it parse". Check the signature against the expected key, the issuer, the audience, the expiry, and the algorithm — reject alg "none", and reject a key that has no business signing for this audience. A token validly signed by the wrong issuer and accepted anyway is not a broken token. It is a broken door.

## How it changes for AI agents

Agents hold credentials for long unattended stretches and hand them down to sub-agents, so revocation latency stops being a footnote and becomes the blast radius: the question is not whether you can revoke an agent, but how much it can still do in the minutes after you did. That argues for short-lived, sender-constrained, narrowly-scoped tokens issued per task rather than a standing credential in a config file — and for the delegation chain to travel inside the token, so a resource can refuse the whole branch at once.

## In practice

```
# Wrong: the token parses, therefore we trust it.
claims = jwt.decode(token, options={"verify_signature": False})   # never
user = claims["sub"]

# Right: every field the token's authority rests on is checked.
claims = jwt.decode(
    token,
    key=jwks.get_signing_key(kid).key,   # a key this issuer is allowed to use
    algorithms=["RS256"],                # pinned — never trust the header's alg
    issuer="https://idp.example.com/",   # who minted it
    audience="https://api.example.com/", # who it was minted FOR
)                                        # exp / nbf verified by default

# Still not done: a valid signature says nothing about revocation.
if store.is_revoked(claims["jti"]):
    raise Unauthorized("token revoked before expiry")
```

## Quick check

1. Why can a self-contained token be harder to revoke than a server-side session?
   - Answer: There is no server record to delete — it stays valid until it expires — The point of a self-contained token is that no lookup is needed, which also means there is nothing to delete.
2. "Revocation latency" is…
   - Answer: The gap between revoking access and the last valid credential expiring — Access keeps working inside that window, which is why token lifetime is a security parameter.
3. A stolen DPoP-bound token is useless to an attacker because…
   - Answer: They also need the private key it is bound to — Sender-constrained tokens require proof of possession on every request, so holding the token is not enough.

---
Source: https://iam.vjsonline.org/learn/sessions-tokens · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
