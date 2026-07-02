# Tokens, OAuth 2.0 & OIDC

> OAuth lets an app act on your behalf without your password, using scoped, expiring tokens. OIDC adds "who you are" on top.

## Delegated access

OAuth 2.0 is an authorization framework: instead of handing an app your password, you grant it limited access. It receives a scoped access token — never your credentials.

## Tokens & scopes

Access tokens are short-lived and scoped (the permission boundary). Refresh tokens renew them. A bearer token is "whoever holds it" — which is exactly why long-lived ones are dangerous.

## OIDC adds identity

OpenID Connect layers an ID token on OAuth 2.0 to answer "who is the user?". Rule of thumb: OAuth = authorization, OIDC = authentication.

## How it changes for AI agents

Agents are the ultimate "app acting on your behalf" — but classic OAuth never imagined an agent that delegates to sub-agents. New work (the OAuth on-behalf-of-user draft, MCP’s OAuth 2.1 profile, RFC 8693 token exchange) makes tokens carry a delegation chain so you can trace user → agent → sub-agent.

## In practice

```
POST /oauth/token
  grant_type=authorization_code
  code=AUTH_CODE
  redirect_uri=https://app.example/callback
  code_verifier=PKCE_VERIFIER      # public clients: no secret

→ 200 OK
{
  "access_token": "eyJhbGciOi...",
  "token_type":   "Bearer",
  "expires_in":   3600,
  "scope":        "calendar:read",   # the permission boundary
  "id_token":     "eyJ..."           # only with OIDC
}
```

## Quick check

1. OAuth 2.0 is primarily a framework for…
   - Answer: Authorization / delegated access — OAuth delegates scoped access; OIDC adds authentication.
2. What bounds what an access token can do?
   - Answer: Its scope — Scope is the permission boundary.
3. Why are long-lived bearer tokens risky?
   - Answer: Anyone who holds one can use it — Bearer = whoever holds it; long life = big blast radius.

---
Source: https://iam.vjsonline.org/learn/tokens-oauth · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
