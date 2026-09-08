# Hermes Agent vs OpenClaw — IAM comparison

## Authentication

- Hermes: Gateway checks a strict order: per-platform allow-all → DM-pairing list → platform allowlist → global allowlist → global allow-all → deny. DM pairing issues an 8-char code (1h TTL, rate-limited, 5 fails → 1h lockout, file chmod 0600). Dashboard/remote UI: OAuth (Nous Portal), self-hosted OIDC against your own IdP, or basic auth — fails closed if bound non-loopback with no provider; the old --insecure bypass is a deprecated no-op (June 2026 hardening).
- OpenClaw: Gateway auth modes: token, password, or trusted-proxy identity. New senders must approve a pairing code (1h TTL, max 3 pending), or use a strict allowlist; "open" requires an explicit "*" opt-in.

## Authorization model

- Hermes: Allowlist-based; effectively owner-vs-user. No formal role tiers — authority is expressed through who is on which allowlist.
- OpenClaw: Explicit role-based access: operator vs non-operator. Per-group allowlists (groupAllowFrom) and dmScope:"per-channel-peer" isolate context per sender. tools.sessions.visibility defaults to "all" — gateway-wide session reach — and must be narrowed to "agent" or "self" by hand.

## Tool / action permissions

- Hermes: Dangerous-command approval modes: smart (default — an auxiliary LLM scores risk, auto-approving low-risk calls and escalating uncertain ones), manual (always prompt), off. Approval prompts fail closed — deny — after a 300s timeout. User deny rules (approvals.deny, fnmatch globs) are matched before YOLO or off mode is consulted, and a hardline blocklist (rm -rf /, fork bombs, mkfs, dd to block devices, piping untrusted URLs to a root shell) is refused even under --yolo.
- OpenClaw: Three independent permission gates: agent-level tool allow/deny, sandbox-level tool filter, and container network access — all must permit an action. Default "messaging" profile disables automation/runtime/fs groups; tools.elevated bypass is off by default.

## Secrets & credentials

- Hermes: MCP subprocesses receive only safe vars (PATH, HOME, USER, LANG, LC_ALL, TERM, SHELL, TMPDIR, XDG_*); anything matching KEY/TOKEN/SECRET/PASSWORD/CREDENTIAL/PASSWD/AUTH is stripped. Skills declare required_environment_variables / required_credential_files; files mount read-only. Protected paths (~/.ssh, ~/.aws, ~/.kube, .env, /etc/sudoers) are blocked from write_file and patch outright. Errors redact ghp_…, sk-…, bearer tokens.
- OpenClaw: Provider credentials live in a per-agent SQLite store (agents/<id>/agent/openclaw-agent.sqlite), with OAuth tokens and dynamic client secrets in state/openclaw.sqlite, or behind SecretRef providers (env / file / exec / credential store — static credentials only), injected at runtime. State is chmod 700 with openclaw.json at 600, but plaintext still works and agent-readable files stay exposed. Untrusted workspace .env files cannot override OPENCLAW_* or provider credentials.

## Execution isolation

- Hermes: Default backend is local — commands run on the host with no isolation; containers are an opt-in switch. When used, hardened: --cap-drop ALL, --security-opt no-new-privileges, --pids-limit 256, tmpfs /tmp with nosuid (root inside unless docker_run_as_host_user). Backends: local / ssh / docker / singularity / modal / daytona / vercel_sandbox. HERMES_WRITE_SAFE_ROOT can additionally confine writes to a directory prefix (set to /opt/data in the official image). SSRF guard blocks RFC-1918, loopback, link-local, CGNAT (100.64.0.0/10) and cloud-metadata addresses; allow_private_urls defaults false.
- OpenClaw: Sandboxing is off by default — an opt-in switch, like Hermes. When enabled the Docker backend is hardened out of the box: capDrop ALL, no-new-privileges, readOnlyRoot, a non-root sandbox user, and network "none", so even allowed web tools fail until egress is opened. Scope is agent (default) / session / shared; workspace access none (default) / ro / rw. Backends: docker / podman / ssh / OpenShell managed remote sandboxes. Independent of the sandbox, an SSRF policy is strict by default across the browser and web-fetch tools: private and internal destinations are refused unless dangerouslyAllowPrivateNetwork is set, requests are intercepted before any HTTP bytes leave, and the deny list is evaluated ahead of allow rules.

## Agent as principal

- Hermes: Implicit: identity is enforced through the 8 layers (authorization, approval, file-write safety, isolation, credential filtering, scanning, session isolation, sanitization) rather than a named principal object.
- OpenClaw: Explicit: the agent is documented as "a new security principal on your system — a non-human identity that can take actions, touch data, and move across systems."

## Subagent delegation

- Hermes: Sessions cannot access each other's data or state. Cron/storage paths are hardened against traversal; working-dir params are validated against an allowlist. Subprocesses inherit only the filtered env.
- OpenClaw: Delegation requires explicit permission. Children inherit the parent sandbox mode unless overridden (sandbox:"require" fails if the target isn't sandboxed). visibility: self | tree | agent | all bounds which sessions a subagent can read.

## Audit & redaction

- Hermes: Credential redaction in tool errors, supply-chain advisory checks at startup and in `hermes doctor`, SHA-256-verified pre-exec scanning (Tirith), context-file injection scanning.
- OpenClaw: `openclaw security audit` (--deep probes a live gateway, --fix applies safe remediations, --json for CI) reviews inbound access policy, cross-agent session visibility, tool blast radius, exec drift, network exposure, and plugin loading, emitting structured findings keyed by checkId (e.g. gateway.bind_no_auth). Log redaction is on and cannot be disabled; logging.redactPatterns adds custom rules.

## Default posture

- Hermes: Defense-in-depth with smart (LLM-scored) approval on by default; when a container backend is used, command checks defer to the container as the boundary.
- OpenClaw: Personal-assistant first: "one trusted operator boundary per gateway." Multi-tenant hostile isolation is explicitly out of scope — mixed-trust setups should use separate gateways, credentials, and OS users.

---
Source: https://iam.vjsonline.org/compare · Both cells sourced from each project's security documentation.
