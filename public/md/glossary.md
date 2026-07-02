# IAM Glossary (agentic identity)

- **Deny-by-default** — Access is refused unless a rule explicitly allows it. Hermes’ gateway falls through to deny; OpenClaw requires an allowlist or approved pairing.
- **DM pairing code** — A short, expiring code an unknown sender must get approved before they can drive the agent. Hermes: 8 chars, 1h TTL, rate-limited, lockout after 5 fails.
- **Non-human identity** — An autonomous agent treated as a security principal that takes actions and touches data. OpenClaw names this explicitly in its model.
- **Blast radius** — How much damage a compromised or over-eager agent can do. Both projects shrink it with isolation and least privilege.
- **Defense in depth** — Stacking independent controls so one failure isn’t fatal — Hermes’ seven-layer model.
- **SecretRef** — OpenClaw’s indirection for secrets: values are pulled from env / file / exec providers at runtime, never written into config files.
- **Secret stripping** — Hermes removes anything matching KEY/TOKEN/SECRET/PASSWORD from a subprocess’ env unless a skill explicitly declares it needs it.
- **Hardline blocklist** — Commands Hermes refuses to run even under --yolo: rm -rf /, fork bombs, disk formatting, raw block-device writes.
- **YOLO mode** — Hermes mode that skips approval prompts — but never the hardline blocklist.
- **Elevated mode** — OpenClaw’s tools.elevated bypasses sandbox isolation. Off by default; requires an explicit allowlist to enable.
- **Operator vs non-operator** — OpenClaw’s role split: the operator holds privileged control of the gateway; everyone else is gated to a smaller surface.
- **Sandbox scope** — OpenClaw bounds a sandbox to agent / session / shared, limiting what a single tool run can reach.
- **Container as boundary** — When Hermes runs in docker / modal, the hardened container is the security boundary, so per-command checks defer to it.
- **SSRF guard** — Hermes blocks URL tools from reaching private, loopback, link-local, and cloud-metadata addresses to stop server-side request forgery.
- **Cross-session isolation** — Sessions can’t read each other’s data or state, so one user or task can’t leak into another.
- **Subagent visibility** — OpenClaw scopes which sessions a child agent can see: self / tree / agent / all.
- **Heartbeat** — OpenClaw’s scheduled polling loop that lets the agent act proactively rather than only on request.
- **Least privilege** — Grant the smallest access that still works, then widen on confidence — OpenClaw’s stated default posture.

---
Source: https://iam.vjsonline.org/glossary
