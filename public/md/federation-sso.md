# Federation & Single Sign-On

> Federation lets an identity from one place sign in somewhere else. SSO means one login works across many apps.

## The problem it solves

A directory stops at the org boundary. Federation lets a trusted identity provider (IdP) vouch for you to applications it doesn’t own, so you don’t need a separate account everywhere.

## SAML & OIDC

SAML (2005) and OpenID Connect carry signed assertions or tokens about who you are between the IdP and a relying party. The app trusts the IdP’s signature instead of checking a password itself.

## Single sign-on

Authenticate once at the IdP and reach many apps without re-entering credentials. Fewer passwords, central control, and one place to revoke access.

## How it changes for AI agents

Agents complicate federation: an agent acting for you may need to present both its own identity and a federated claim about you — across services that each trust different identity providers.

## Quick check

1. Federation primarily lets you…
   - Answer: Use one identity across orgs/apps — An IdP vouches for you to apps it doesn’t own.
2. In SSO, you authenticate…
   - Answer: Once, then reach many apps — One login at the IdP unlocks many relying parties.
3. SAML and OIDC carry…
   - Answer: Signed assertions/tokens about you — The app trusts the IdP’s signature, not a shared password.

---
Source: https://iam.vjsonline.org/learn/federation-sso · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
