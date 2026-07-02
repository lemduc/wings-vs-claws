# The journey of IAM — seven eras

## Era 0: Walls & lists (1960s–1990s)

- Identity meant: A username on one machine.
- Stack: Mainframe accounts, Access control lists (ACLs), Passwords
- What broke: No shared identity across systems — every box was its own island.

## Era 1: Directories (1990s)

- Identity meant: A row in a central store of record.
- Stack: LDAP (1993), Kerberos v5 (1993), Active Directory (2000)
- What broke: Identity stopped at the org boundary — partners and SaaS couldn’t use it.

## Era 2: Federation & SSO (2000s)

- Identity meant: A signed claim you carry between orgs.
- Stack: SAML 2.0 (2005), Web SSO, OAuth 1.0 (2007)
- What broke: Apps and APIs needed delegated, machine-to-machine access — not just human logins.

## Era 3: Delegated / API era (2010s)

- Identity meant: A scoped, expiring token.
- Stack: OAuth 2.0 (2012), OpenID Connect (2014), Cloud IAM — AWS IAM (2011), MFA · IGA · PAM
- What broke: The perimeter dissolved; trust could no longer be based on network location.

## Era 4: Zero Trust & workloads (late 2010s–2021)

- Identity meant: A continuously verified workload.
- Stack: Zero Trust (Forrester 2010 → NIST SP 800-207, 2020), Google BeyondCorp, SPIFFE / SPIRE
- What broke: Machine identities began to outnumber humans — and nobody was governing them.

## Era 5: Non-human identities explode (2023–2025)

- Identity meant: A service principal living on secrets.
- Stack: NHI security as a category, Secret scanning & rotation, 144:1 NHI-to-human ratio (+44% YoY)
- What broke: 97% of NHIs are over-permissioned and secrets sprawl. One stolen token reached hundreds of systems (Salesloft–Drift, 2025).

## Era 6: Agents — you are here (2025–now)

- Identity meant: An autonomous actor acting on your behalf.
- Stack: MCP OAuth 2.1 authorization (spec 2025-11), OAuth on-behalf-of-user draft (May 2025), RFC 8707 resource indicators, RFC 8693 token exchange, NIST AI Agent Standards Initiative (Feb 2026)
- Open problem: Agents are non-deterministic, multi-hop delegate to sub-agents, and run continuously — static creds and one-time grants can’t hold. This is the open problem.

---
Source: https://iam.vjsonline.org/journey
