# Hermes Agent vs OpenClaw — IAM comparison

## Authentication

- Hermes: Gateway checks a strict order: per-platform allow-all → DM-pairing list → platform allowlist → global allowlist → global allow-all → deny. DM pairing issues an 8-char code (1h TTL, rate-limited, 5 fails → 1h lockout, file chmod 0600).
- OpenClaw: Gateway auth modes: token, password, or trusted-proxy identity. New senders must approve a pairing code (1h TTL, max 3 pending), or use a strict allowlist; "open" requires an explicit "*" opt-in.

## Authorization model

- Hermes: Allowlist-based; effectively owner-vs-user. No formal role tiers — authority is expressed through who is on which allowlist.
- OpenClaw: Explicit role-based access: operator vs non-operator. Per-group allowlists (groupAllowFrom) and dmScope:"per-channel-peer" isolate context per sender.

## Tool / action permissions

- Hermes: Dangerous-command approval modes: manual (default, always prompt), smart (LLM risk score → auto allow/deny), off (--yolo). A hardline blocklist (rm -rf /, fork bombs, disk format) is refused even under --yolo.
- OpenClaw: Three independent permission gates: agent-level tool allow/deny, sandbox-level tool filter, and container network access — all must permit an action. Default "messaging" profile disables automation/runtime/fs groups; tools.elevated bypass is off by default.

## Secrets & credentials

- Hermes: MCP subprocesses receive only safe vars (PATH, HOME, USER, LANG, TERM, SHELL, TMPDIR, XDG_*); everything with KEY/TOKEN/SECRET/PASSWORD is stripped. Skills declare required_environment_variables / required_credential_files; files mount read-only. Errors redact ghp_…, sk-…, bearer tokens.
- OpenClaw: Secrets live in ~/.openclaw/credentials/ or behind SecretRef providers (env / file / exec), injected at runtime — never in config files. Untrusted workspace .env files cannot override OPENCLAW_* or provider credentials.

## Execution isolation

- Hermes: Hardened containers: --cap-drop ALL, --security-opt no-new-privileges, --pids-limit 256, tmpfs /tmp with nosuid. Backends: local / ssh / docker / singularity / modal. SSRF guard blocks RFC-1918, loopback, link-local, and cloud-metadata addresses.
- OpenClaw: Sandbox scope: agent / session / shared. Workspace access: none / ro / rw. Host target: sandbox (Docker) / gateway (host) / node (remote). Docker network is disabled by default, so even allowed web tools fail until opened.

## Agent as principal

- Hermes: Implicit: identity is enforced through the 7 layers (authorization, approval, isolation, credential filtering, scanning, session isolation, sanitization) rather than a named principal object.
- OpenClaw: Explicit: the agent is documented as "a new security principal on your system — a non-human identity that can take actions, touch data, and move across systems."

## Subagent delegation

- Hermes: Sessions cannot access each other's data or state. Cron/storage paths are hardened against traversal; working-dir params are validated against an allowlist. Subprocesses inherit only the filtered env.
- OpenClaw: Delegation requires explicit permission. Children inherit the parent sandbox mode unless overridden (sandbox:"require" fails if the target isn't sandboxed). visibility: self | tree | agent | all bounds which sessions a subagent can read.

## Audit & redaction

- Hermes: Credential redaction in tool errors, supply-chain advisory checks at startup and in `hermes doctor`, SHA-256-verified pre-exec scanning (Tirith), context-file injection scanning.
- OpenClaw: `openclaw security audit` reviews inbound policies, tool blast radius, filesystem perms, network exposure, and skill supply chain. logging.redactSensitive masks secrets in logs and transcripts by default.

## Default posture

- Hermes: Defense-in-depth with manual approval on by default; when a container backend is used, command checks defer to the container as the boundary.
- OpenClaw: Personal-assistant first: "one trusted operator boundary per gateway." Multi-tenant hostile isolation is explicitly out of scope — mixed-trust setups should use separate gateways, credentials, and OS users.

---
Source: https://iam.vjsonline.org/compare · Both cells sourced from each project's security documentation.
