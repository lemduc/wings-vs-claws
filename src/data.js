// ============================================================================
// Wings vs Claws — an IAM-focused comparison of two open-source agents.
// Every claim below is traceable to the projects' own security docs + guides.
//
// Sources (retrieved June 2026):
//   Hermes:   https://hermes-agent.nousresearch.com/docs/user-guide/security
//             https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md
//   OpenClaw: https://docs.openclaw.ai/gateway/security
//             https://docs.openclaw.ai/gateway/sandboxing
//
// Scope: Identity & Access Management ONLY — authN, authZ/RBAC, tool
// permissions, secrets, isolation, delegation, audit, default posture.
// The "access traces" in the simulator dramatize each project's DOCUMENTED
// IAM mechanisms applied to a scenario. They are illustrative, not live runs.
// ============================================================================

export const AGENTS = {
  hermes: {
    id: 'hermes',
    name: 'Hermes Agent',
    file: 'hermes.iam',
    symbol: '🪽',
    creator: 'Nous Research',
    license: 'MIT',
    iamModel: '7-layer defense-in-depth',
    motto: 'Deny by default, contain by design.',
    blurb:
      'Layered, container-centric IAM: the sandbox is the security boundary, ' +
      'secrets are stripped from subprocesses unless explicitly declared, and ' +
      'dangerous actions are gated by human-in-the-loop approval.',
    site: 'https://hermes-agent.nousresearch.com/docs/user-guide/security',
    repo: 'https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md',
  },
  openclaw: {
    id: 'openclaw',
    name: 'OpenClaw',
    file: 'openclaw.iam',
    symbol: '🦞',
    creator: 'Peter Steinberger',
    license: 'Open source',
    iamModel: 'Gateway RBAC + 3 permission gates',
    motto: 'One trusted operator, least privilege, widen on confidence.',
    blurb:
      'Role-based IAM around a single operator boundary: the agent is a ' +
      'non-human principal, gated by three independent permission layers, ' +
      'with secrets behind SecretRef providers injected at runtime.',
    site: 'https://docs.openclaw.ai/gateway/security',
    repo: 'https://docs.openclaw.ai/gateway/sandboxing',
  },
}

// IAM comparison rows — each cell sourced from the official security docs.
export const IAM_DIMENSIONS = [
  {
    id: 'authn',
    dimension: 'Authentication',
    sub: 'Who is allowed to talk to the agent at all',
    hermes:
      'Gateway checks a strict order: per-platform allow-all → DM-pairing list → platform allowlist → global allowlist → global allow-all → deny. DM pairing issues an 8-char code (1h TTL, rate-limited, 5 fails → 1h lockout, file chmod 0600).',
    openclaw:
      'Gateway auth modes: token, password, or trusted-proxy identity. New senders must approve a pairing code (1h TTL, max 3 pending), or use a strict allowlist; "open" requires an explicit "*" opt-in.',
  },
  {
    id: 'authz',
    dimension: 'Authorization model',
    sub: 'How rights are structured once authenticated',
    hermes:
      'Allowlist-based; effectively owner-vs-user. No formal role tiers — authority is expressed through who is on which allowlist.',
    openclaw:
      'Explicit role-based access: operator vs non-operator. Per-group allowlists (groupAllowFrom) and dmScope:"per-channel-peer" isolate context per sender.',
  },
  {
    id: 'tools',
    dimension: 'Tool / action permissions',
    sub: "The principal's blast radius",
    hermes:
      'Dangerous-command approval modes: manual (default, always prompt), smart (LLM risk score → auto allow/deny), off (--yolo). A hardline blocklist (rm -rf /, fork bombs, disk format) is refused even under --yolo.',
    openclaw:
      'Three independent permission gates: agent-level tool allow/deny, sandbox-level tool filter, and container network access — all must permit an action. Default "messaging" profile disables automation/runtime/fs groups; tools.elevated bypass is off by default.',
  },
  {
    id: 'secrets',
    dimension: 'Secrets & credentials',
    sub: 'How API keys and tokens are handled',
    hermes:
      'MCP subprocesses receive only safe vars (PATH, HOME, USER, LANG, TERM, SHELL, TMPDIR, XDG_*); everything with KEY/TOKEN/SECRET/PASSWORD is stripped. Skills declare required_environment_variables / required_credential_files; files mount read-only. Errors redact ghp_…, sk-…, bearer tokens.',
    openclaw:
      'Secrets live in ~/.openclaw/credentials/ or behind SecretRef providers (env / file / exec), injected at runtime — never in config files. Untrusted workspace .env files cannot override OPENCLAW_* or provider credentials.',
  },
  {
    id: 'isolation',
    dimension: 'Execution isolation',
    sub: 'Sandboxing & resource boundaries',
    hermes:
      'Hardened containers: --cap-drop ALL, --security-opt no-new-privileges, --pids-limit 256, tmpfs /tmp with nosuid. Backends: local / ssh / docker / singularity / modal. SSRF guard blocks RFC-1918, loopback, link-local, and cloud-metadata addresses.',
    openclaw:
      'Sandbox scope: agent / session / shared. Workspace access: none / ro / rw. Host target: sandbox (Docker) / gateway (host) / node (remote). Docker network is disabled by default, so even allowed web tools fail until opened.',
  },
  {
    id: 'principal',
    dimension: 'Agent as principal',
    sub: 'Treating the agent as a non-human identity',
    hermes:
      'Implicit: identity is enforced through the 7 layers (authorization, approval, isolation, credential filtering, scanning, session isolation, sanitization) rather than a named principal object.',
    openclaw:
      'Explicit: the agent is documented as "a new security principal on your system — a non-human identity that can take actions, touch data, and move across systems."',
  },
  {
    id: 'delegation',
    dimension: 'Subagent delegation',
    sub: 'How spawned subagents inherit rights',
    hermes:
      'Sessions cannot access each other\'s data or state. Cron/storage paths are hardened against traversal; working-dir params are validated against an allowlist. Subprocesses inherit only the filtered env.',
    openclaw:
      'Delegation requires explicit permission. Children inherit the parent sandbox mode unless overridden (sandbox:"require" fails if the target isn\'t sandboxed). visibility: self | tree | agent | all bounds which sessions a subagent can read.',
  },
  {
    id: 'audit',
    dimension: 'Audit & redaction',
    sub: 'Visibility and forensics',
    hermes:
      'Credential redaction in tool errors, supply-chain advisory checks at startup and in `hermes doctor`, SHA-256-verified pre-exec scanning (Tirith), context-file injection scanning.',
    openclaw:
      '`openclaw security audit` reviews inbound policies, tool blast radius, filesystem perms, network exposure, and skill supply chain. logging.redactSensitive masks secrets in logs and transcripts by default.',
  },
  {
    id: 'posture',
    dimension: 'Default posture',
    sub: 'Where the design optimizes',
    hermes:
      'Defense-in-depth with manual approval on by default; when a container backend is used, command checks defer to the container as the boundary.',
    openclaw:
      'Personal-assistant first: "one trusted operator boundary per gateway." Multi-tenant hostile isolation is explicitly out of scope — mixed-trust setups should use separate gateways, credentials, and OS users.',
  },
]

// IAM control matrix (✓ first-class · ◐ partial/possible · — not a focus)
export const IAM_MATRIX = [
  { control: 'DM-pairing / allowlist authentication', hermes: 'yes', openclaw: 'yes' },
  { control: 'Role-based access (operator vs user)', hermes: 'partial', openclaw: 'yes' },
  { control: 'Human-in-the-loop command approval', hermes: 'yes', openclaw: 'partial' },
  { control: 'Env-var secret stripping from subprocess', hermes: 'yes', openclaw: 'partial' },
  { control: 'SecretRef / vault runtime injection', hermes: 'partial', openclaw: 'yes' },
  { control: 'Hardened container flags (cap-drop, no-new-privs)', hermes: 'yes', openclaw: 'partial' },
  { control: 'SSRF / egress network protection', hermes: 'yes', openclaw: 'partial' },
  { control: 'Per-subagent visibility scoping', hermes: 'partial', openclaw: 'yes' },
  { control: 'Built-in security-audit command', hermes: 'partial', openclaw: 'yes' },
  { control: 'Cross-session / context isolation', hermes: 'yes', openclaw: 'yes' },
  { control: 'Secret redaction in logs & errors', hermes: 'yes', openclaw: 'yes' },
]

// Hermes 7-layer model (for the architecture diagram). short = label shown
// inside the diagram layer; full = the one-line detail in the legend.
export const HERMES_LAYERS = [
  { short: 'User authorization', full: 'allowlists + DM pairing' },
  { short: 'Command approval', full: 'manual / smart / off' },
  { short: 'Container isolation', full: 'docker / singularity / modal' },
  { short: 'Credential filtering', full: 'strip secrets from subprocess env' },
  { short: 'Context scanning', full: 'prompt-injection detection' },
  { short: 'Session isolation', full: 'no shared state, no traversal' },
  { short: 'Input sanitization', full: 'working-dir allowlist validation' },
]

// OpenClaw gate model (for the architecture diagram). Sequential AND-chain.
export const OPENCLAW_GATES = [
  { gate: 'Gateway', detail: 'authN + operator role' },
  { gate: 'Agent tool policy', detail: 'allow / deny per tool' },
  { gate: 'Sandbox filter', detail: 'independent allowlist + scope' },
  { gate: 'Network', detail: 'egress off by default' },
]

// Simulator: IAM access scenarios. Each trace line dramatizes a real,
// documented control. tag = the IAM layer; line = what happens.
export const SCENARIOS = [
  { id: 'unknown-dm', title: 'An unknown user DMs the agent', icon: '👤' },
  { id: 'github-token', title: 'A task needs a GitHub token', icon: '🔑' },
  { id: 'dangerous-cmd', title: 'The agent tries to run `rm -rf /`', icon: '☠️' },
  { id: 'spawn-subagent', title: 'A subagent is spawned for a subtask', icon: '🌿' },
]

export const TRACES = {
  'unknown-dm': {
    hermes: [
      { tag: 'authz', verb: 'CHECK', line: 'sender not on any allowlist → deny-by-default' },
      { tag: 'pairing', verb: 'ISSUE', line: '8-char code · 32-char unambiguous alphabet · 1h TTL' },
      { tag: 'ratelimit', verb: 'GUARD', line: '1 req / 10min · max 3 pending · 5 fails → 1h lockout' },
      { tag: 'approve', verb: 'AWAIT', line: 'owner runs `hermes pairing approve <platform> <code>`' },
      { tag: 'persist', verb: 'GRANT', line: 'authorized list written, file mode chmod 0600' },
    ],
    openclaw: [
      { tag: 'authn', verb: 'GATE', line: 'gateway auth: token / password / trusted-proxy' },
      { tag: 'pairing', verb: 'ISSUE', line: 'new sender approves pairing code · 1h TTL · max 3 pending' },
      { tag: 'policy', verb: 'MATCH', line: 'else strict allowlist; "open" needs explicit "*" opt-in' },
      { tag: 'scope', verb: 'ISOLATE', line: 'dmScope="per-channel-peer" → context not shared' },
      { tag: 'role', verb: 'ASSIGN', line: 'sender = non-operator → operator-only tools stay denied' },
    ],
  },
  'github-token': {
    hermes: [
      { tag: 'filter', verb: 'STRIP', line: 'subprocess env: only PATH/HOME/USER/LANG/TERM/… survive' },
      { tag: 'declare', verb: 'DECLARE', line: 'skill frontmatter: required_environment_variables: [GITHUB_TOKEN]' },
      { tag: 'inject', verb: 'PASS', line: 'registered passthrough → terminal / execute_code / docker / modal' },
      { tag: 'mount', verb: 'MOUNT', line: 'required_credential_files bind-mounted read-only' },
      { tag: 'redact', verb: 'SCRUB', line: 'errors mask ghp_… / sk-… / bearer → [REDACTED]' },
    ],
    openclaw: [
      { tag: 'store', verb: 'RESOLVE', line: 'SecretRef provider (env / file / exec) or ~/.openclaw/credentials/' },
      { tag: 'block', verb: 'REJECT', line: 'workspace .env cannot override OPENCLAW_* / provider creds' },
      { tag: 'inject', verb: 'INJECT', line: 'value injected at runtime — never written to config files' },
      { tag: 'gate', verb: 'CHECK', line: 'sandbox tool filter must also permit the consuming tool' },
      { tag: 'redact', verb: 'MASK', line: 'logging.redactSensitive hides token in logs + transcripts' },
    ],
  },
  'dangerous-cmd': {
    hermes: [
      { tag: 'approve', verb: 'PROMPT', line: 'mode=manual (default) → human-in-the-loop confirmation' },
      { tag: 'smart', verb: 'SCORE', line: 'mode=smart: aux LLM scores risk → dangerous auto-denied' },
      { tag: 'hardline', verb: 'REFUSE', line: 'rm -rf /, fork bombs, disk-format blocked even under --yolo' },
      { tag: 'boundary', verb: 'DEFER', line: 'on docker/modal, cmd-check defers — container IS the boundary' },
      { tag: 'contain', verb: 'CONFINE', line: '--cap-drop ALL · no-new-privileges · pids-limit · tmpfs nosuid' },
    ],
    openclaw: [
      { tag: 'gate-1', verb: 'CHECK', line: 'agent tool policy: is the shell tool allowed for this agent?' },
      { tag: 'gate-2', verb: 'CHECK', line: 'sandbox filter must independently permit the same tool' },
      { tag: 'gate-3', verb: 'CHECK', line: 'container network off by default → egress blocked' },
      { tag: 'default', verb: 'DENY', line: '"messaging" profile disables group:automation/runtime/fs' },
      { tag: 'elevated', verb: 'BLOCK', line: 'tools.elevated bypass is off unless explicitly allowlisted' },
    ],
  },
  'spawn-subagent': {
    hermes: [
      { tag: 'isolate', verb: 'WALL', line: 'sessions cannot read each other\'s data or state' },
      { tag: 'path', verb: 'HARDEN', line: 'cron / storage paths hardened against traversal' },
      { tag: 'validate', verb: 'CHECK', line: 'working-dir params validated against an allowlist' },
      { tag: 'creds', verb: 'REGATE', line: 'child inherits only filtered env; secrets re-declared per skill' },
    ],
    openclaw: [
      { tag: 'delegate', verb: 'REQUIRE', line: 'delegation requires explicit permission' },
      { tag: 'inherit', verb: 'INHERIT', line: 'child inherits parent sandbox mode unless overridden' },
      { tag: 'require', verb: 'ENFORCE', line: 'sandbox:"require" fails if the target is not sandboxed' },
      { tag: 'visibility', verb: 'SCOPE', line: 'visibility: self | tree | agent | all bounds session access' },
    ],
  },
}

// "Defense in Depth" mini-game. Each threat is blocked by exactly one of the
// 7 Hermes layers (1-based index into HERMES_LAYERS) — mapping follows the
// documented mechanism that stops it.
export const THREATS = [
  { id: 't-stranger', icon: '👤', name: 'Unknown user', desc: 'a stranger DMs the agent and tells it to act', layer: 1 },
  { id: 't-pairspam', icon: '📨', name: 'Pairing brute-force', desc: 'attacker spams pairing-code guesses', layer: 1 },
  { id: 't-rmrf', icon: '☠️', name: 'Destructive command', desc: 'agent is told to run `rm -rf /`', layer: 2 },
  { id: 't-forkbomb', icon: '💣', name: 'Fork bomb', desc: ':(){ :|:& };: aims to exhaust the host', layer: 2 },
  { id: 't-hostread', icon: '📂', name: 'Host file read', desc: 'a tool tries to read /etc/shadow on the host', layer: 3 },
  { id: 't-escape', icon: '🪟', name: 'Sandbox escape', desc: 'process attempts to break out to the host', layer: 3 },
  { id: 't-exfil', icon: '🔑', name: 'Token exfiltration', desc: 'code reads $GITHUB_TOKEN and POSTs it out', layer: 4 },
  { id: 't-leak', icon: '🩹', name: 'Secret in error', desc: 'a tool error would leak `sk-…` in plaintext', layer: 4 },
  { id: 't-inject', icon: '🧬', name: 'Prompt injection', desc: 'hidden instructions buried in AGENTS.md', layer: 5 },
  { id: 't-snoop', icon: '🕵️', name: 'Cross-session snoop', desc: 'one session tries to read another user’s data', layer: 6 },
  { id: 't-traversal', icon: '🧭', name: 'Path traversal', desc: 'workdir set to ../../etc to escape the jail', layer: 7 },
]

export const VERDICT = {
  hermes:
    'Reach for Hermes’ model when the threat you care about is a compromised or ' +
    'over-eager agent process: defense-in-depth, secrets stripped at the subprocess ' +
    'boundary, hardened containers, and human-in-the-loop approval make the blast ' +
    'radius small even if the model misbehaves. Identity is enforced by layers.',
  openclaw:
    'Reach for OpenClaw’s model when you want explicit IAM ergonomics around a ' +
    'single operator: named operator-vs-non-operator roles, three composable ' +
    'permission gates, SecretRef providers, and a built-in `security audit`. It is ' +
    'least-privilege-by-config — just remember multi-tenant hostile isolation is out of scope.',
}

// IAM glossary — concise, sourced definitions of the jargon used on the site.
// rel: 'both' | 'hermes' | 'openclaw' (whose mechanism the term leans on).
export const GLOSSARY = [
  { term: 'Deny-by-default', rel: 'both', def: 'Access is refused unless a rule explicitly allows it. Hermes’ gateway falls through to deny; OpenClaw requires an allowlist or approved pairing.' },
  { term: 'DM pairing code', rel: 'both', def: 'A short, expiring code an unknown sender must get approved before they can drive the agent. Hermes: 8 chars, 1h TTL, rate-limited, lockout after 5 fails.' },
  { term: 'Non-human identity', rel: 'openclaw', def: 'An autonomous agent treated as a security principal that takes actions and touches data. OpenClaw names this explicitly in its model.' },
  { term: 'Blast radius', rel: 'both', def: 'How much damage a compromised or over-eager agent can do. Both projects shrink it with isolation and least privilege.' },
  { term: 'Defense in depth', rel: 'hermes', def: 'Stacking independent controls so one failure isn’t fatal — Hermes’ seven-layer model.' },
  { term: 'SecretRef', rel: 'openclaw', def: 'OpenClaw’s indirection for secrets: values are pulled from env / file / exec providers at runtime, never written into config files.' },
  { term: 'Secret stripping', rel: 'hermes', def: 'Hermes removes anything matching KEY/TOKEN/SECRET/PASSWORD from a subprocess’ env unless a skill explicitly declares it needs it.' },
  { term: 'Hardline blocklist', rel: 'hermes', def: 'Commands Hermes refuses to run even under --yolo: rm -rf /, fork bombs, disk formatting, raw block-device writes.' },
  { term: 'YOLO mode', rel: 'hermes', def: 'Hermes mode that skips approval prompts — but never the hardline blocklist.' },
  { term: 'Elevated mode', rel: 'openclaw', def: 'OpenClaw’s tools.elevated bypasses sandbox isolation. Off by default; requires an explicit allowlist to enable.' },
  { term: 'Operator vs non-operator', rel: 'openclaw', def: 'OpenClaw’s role split: the operator holds privileged control of the gateway; everyone else is gated to a smaller surface.' },
  { term: 'Sandbox scope', rel: 'openclaw', def: 'OpenClaw bounds a sandbox to agent / session / shared, limiting what a single tool run can reach.' },
  { term: 'Container as boundary', rel: 'hermes', def: 'When Hermes runs in docker / modal, the hardened container is the security boundary, so per-command checks defer to it.' },
  { term: 'SSRF guard', rel: 'hermes', def: 'Hermes blocks URL tools from reaching private, loopback, link-local, and cloud-metadata addresses to stop server-side request forgery.' },
  { term: 'Cross-session isolation', rel: 'both', def: 'Sessions can’t read each other’s data or state, so one user or task can’t leak into another.' },
  { term: 'Subagent visibility', rel: 'openclaw', def: 'OpenClaw scopes which sessions a child agent can see: self / tree / agent / all.' },
  { term: 'Heartbeat', rel: 'openclaw', def: 'OpenClaw’s scheduled polling loop that lets the agent act proactively rather than only on request.' },
  { term: 'Least privilege', rel: 'both', def: 'Grant the smallest access that still works, then widen on confidence — OpenClaw’s stated default posture.' },
]

// Config playground — toggle settings, watch the IAM posture update. Each
// non-ideal choice carries a risk weight subtracted from a 100-point posture.
export const PLAYGROUND = [
  {
    id: 'auth', label: 'authentication', default: 'allowlist',
    options: [
      { v: 'allowlist', label: 'deny-by-default + allowlist', risk: 0 },
      { v: 'open', label: 'allow-all (open)', risk: 30 },
    ],
    note: 'Open auth lets any sender drive the agent. Gate it with pairing / allowlists (Hermes gateway order, OpenClaw pairing).',
  },
  {
    id: 'approval', label: 'command_approval', default: 'manual',
    options: [
      { v: 'manual', label: 'manual (prompt)', risk: 0 },
      { v: 'smart', label: 'smart (LLM-scored)', risk: 5 },
      { v: 'yolo', label: '--yolo (no prompts)', risk: 25 },
    ],
    note: 'YOLO skips human-in-the-loop. Hermes still enforces a hardline blocklist; OpenClaw leans on its tool gates instead.',
  },
  {
    id: 'backend', label: 'execution_backend', default: 'container',
    options: [
      { v: 'container', label: 'docker / modal', risk: 0 },
      { v: 'local', label: 'local (host)', risk: 20 },
    ],
    note: 'Local execution has no container boundary. Hermes treats the container as the boundary — prefer it for risky tools.',
  },
  {
    id: 'secrets', label: 'secret_handling', default: 'managed',
    options: [
      { v: 'managed', label: 'stripped + SecretRef', risk: 0 },
      { v: 'forwarded', label: 'forwarded into env', risk: 25 },
    ],
    note: 'Forwarding every secret into the subprocess lets code read and exfiltrate it. Strip, then inject only what a skill declares.',
  },
  {
    id: 'network', label: 'network_egress', default: 'off',
    options: [
      { v: 'off', label: 'off by default', risk: 0 },
      { v: 'open', label: 'open egress', risk: 15 },
    ],
    note: 'Open egress enables exfiltration and SSRF. OpenClaw disables container network by default; Hermes adds an SSRF guard.',
  },
  {
    id: 'elevated', label: 'sandbox_bypass', default: 'off',
    options: [
      { v: 'off', label: 'disabled', risk: 0 },
      { v: 'on', label: 'elevated on', risk: 25 },
    ],
    note: 'Elevated mode removes sandbox isolation. OpenClaw keeps tools.elevated off unless explicitly allowlisted.',
  },
  {
    id: 'visibility', label: 'subagent_visibility', default: 'self',
    options: [
      { v: 'self', label: 'self', risk: 0 },
      { v: 'tree', label: 'tree', risk: 5 },
      { v: 'all', label: 'all', risk: 15 },
    ],
    note: 'Broad visibility lets a subagent read unrelated sessions. Scope to self / tree (OpenClaw visibility control).',
  },
]

// The journey of IAM, era by era. Each era solved the previous era's problem
// and created a new kind of identity to govern — ending at AI agents.
// Dates are well-established milestones; Era 5–6 figures are cited in JOURNEY_SOURCES.
export const ERAS = [
  {
    id: 'era0', n: 0, hash: 'acl0de', range: '1960s–1990s', title: 'Walls & lists',
    identity: 'A username on one machine.',
    tech: ['Mainframe accounts', 'Access control lists (ACLs)', 'Passwords'],
    broke: 'No shared identity across systems — every box was its own island.',
  },
  {
    id: 'era1', n: 1, hash: '1dap93', range: '1990s', title: 'Directories',
    identity: 'A row in a central store of record.',
    tech: ['LDAP (1993)', 'Kerberos v5 (1993)', 'Active Directory (2000)'],
    broke: 'Identity stopped at the org boundary — partners and SaaS couldn’t use it.',
  },
  {
    id: 'era2', n: 2, hash: '5am105', range: '2000s', title: 'Federation & SSO',
    identity: 'A signed claim you carry between orgs.',
    tech: ['SAML 2.0 (2005)', 'Web SSO', 'OAuth 1.0 (2007)'],
    broke: 'Apps and APIs needed delegated, machine-to-machine access — not just human logins.',
  },
  {
    id: 'era3', n: 3, hash: '0a2718', range: '2010s', title: 'Delegated / API era',
    identity: 'A scoped, expiring token.',
    tech: ['OAuth 2.0 (2012)', 'OpenID Connect (2014)', 'Cloud IAM — AWS IAM (2011)', 'MFA · IGA · PAM'],
    broke: 'The perimeter dissolved; trust could no longer be based on network location.',
  },
  {
    id: 'era4', n: 4, hash: '21row7', range: 'late 2010s–2021', title: 'Zero Trust & workloads',
    identity: 'A continuously verified workload.',
    tech: ['Zero Trust (Forrester 2010 → NIST SP 800-207, 2020)', 'Google BeyondCorp', 'SPIFFE / SPIRE'],
    broke: 'Machine identities began to outnumber humans — and nobody was governing them.',
  },
  {
    id: 'era5', n: 5, hash: '9h1e44', range: '2023–2025', title: 'Non-human identities explode',
    identity: 'A service principal living on secrets.',
    tech: ['NHI security as a category', 'Secret scanning & rotation', '144:1 NHI-to-human ratio (+44% YoY)'],
    broke: '97% of NHIs are over-permissioned and secrets sprawl. One stolen token reached hundreds of systems (Salesloft–Drift, 2025).',
  },
  {
    id: 'era6', n: 6, hash: 'a6e27f', range: '2025–now', title: 'Agents — you are here',
    identity: 'An autonomous actor acting on your behalf.',
    tech: ['MCP OAuth 2.1 authorization (spec 2025-11)', 'OAuth on-behalf-of-user draft (May 2025)', 'RFC 8707 resource indicators', 'RFC 8693 token exchange', 'NIST AI Agent Standards Initiative (Feb 2026)'],
    broke: 'Agents are non-deterministic, multi-hop delegate to sub-agents, and run continuously — static creds and one-time grants can’t hold. This is the open problem.',
    here: true,
  },
]

// Rosetta Stone: each agent control re-derives a classic IAM idea.
export const ROSETTA = [
  { agent: 'DM pairing code', classic: 'User enrollment / onboarding', era: 'Era 1', note: 'A new principal proves itself once, then joins the set of allowed identities.' },
  { agent: 'Allowlist (gateway order)', classic: 'Access control list (ACL)', era: 'Era 0', note: 'The oldest control there is — an explicit list of who may act.' },
  { agent: 'Operator vs non-operator', classic: 'Role-based access control (RBAC)', era: 'Era 2–3', note: 'Authority bundled into a role instead of granted per action.' },
  { agent: 'SecretRef / secret stripping', classic: 'Secrets management & vaulting', era: 'Era 3–5', note: 'Inject credentials at runtime, never store them in code — the lesson NHIs keep relearning.' },
  { agent: 'Container as the boundary', classic: 'Workload identity & isolation', era: 'Era 4', note: 'The sandbox, not the network, is the trust boundary — pure Zero Trust.' },
  { agent: 'Dangerous-command approval', classic: 'Step-up auth / privileged access (PAM)', era: 'Era 3', note: 'High-risk actions demand a fresh, explicit human approval.' },
  { agent: 'Sub-agent visibility / delegation', classic: 'Token exchange & on-behalf-of', era: 'Era 6', note: 'A child gets only the narrowed authority the parent explicitly passes down (RFC 8693 / OBO draft).' },
  { agent: 'SSRF guard / egress off', classic: 'Network segmentation & egress control', era: 'Era 1–4', note: 'Classic blast-radius containment, applied to an autonomous process.' },
]

export const JOURNEY_SOURCES = [
  { label: 'Insight Partners — IAM in the age of AI agents', url: 'https://www.insightpartners.com/ideas/iam-ai-agents/' },
  { label: 'Aembit — IAM for Agentic AI', url: 'https://aembit.io/blog/iam-agentic-ai/' },
  { label: 'IETF — OAuth On-Behalf-Of User Authorization for AI Agents (draft)', url: 'https://www.ietf.org/archive/id/draft-oauth-ai-agents-on-behalf-of-user-01.html' },
  { label: 'Model Context Protocol — Authorization spec', url: 'https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization' },
  { label: 'Research: 44% NHI growth, 144:1 ratio (2024→2025)', url: 'https://www.cybersecuritytribe.com/news/research-reveals-44-growth-in-nhis-from-2024-to-2025' },
  { label: 'NIST — Zero Trust Architecture (SP 800-207)', url: 'https://csrc.nist.gov/pubs/sp/800/207/final' },
]

// ── Foundations: short, visual lessons on core IAM primitives ──────────────
// Each lesson: concept → diagram (flow) → "how it changes for agents" → quiz.
export const LESSONS = [
  {
    slug: 'authn-vs-authz', icon: '🪪', level: 'Foundation',
    title: 'Authentication vs Authorization',
    tldr: 'Authentication proves who you are. Authorization decides what you may do. Agents add a third question: who are you acting for?',
    sections: [
      { h: 'Two different questions', p: 'Authentication (authN) verifies an identity — a password, API key, certificate, or token. Authorization (authZ) is a separate decision made afterward: is this verified identity allowed to do this specific thing? You authenticate once, then authorize every action.' },
      { h: 'Where each shows up', p: 'AuthN: login, mTLS, an OIDC token, a pairing code. AuthZ: roles, ACLs, OAuth scopes, a policy engine. Confusing the two is a classic source of bugs — a valid token (authN passed) does not mean the action is permitted (authZ).' },
    ],
    flow: [{ label: 'AuthN', sub: 'who are you?' }, { label: 'AuthZ', sub: 'what may you do?' }, { label: 'Decision', sub: 'allow / deny' }],
    agentTwist: 'An agent authenticates as a non-human identity, but it usually acts on behalf of a human. So authorization must weigh both the agent and the delegating user — the "on-behalf-of" problem.',
    related: [{ to: '/learn/access-models', label: 'Access models' }, { to: '/learn/agent-delegation', label: 'Agent delegation' }],
    quiz: [
      { q: 'A system checks your password. Which step is this?', options: ['Authentication', 'Authorization', 'Neither'], answer: 0, explain: 'Verifying an identity = authentication.' },
      { q: '"This token may read but not write." Which step is this?', options: ['Authentication', 'Authorization'], answer: 1, explain: 'Deciding what an identity may do = authorization.' },
      { q: 'For an AI agent, authorization should consider…', options: ['Only the agent', 'Only the user', 'Both the agent and the user it acts for'], answer: 2, explain: 'Agents act on-behalf-of a user; both identities matter.' },
    ],
  },
  {
    slug: 'access-models', icon: '🗂️', level: 'Foundation',
    title: 'Access models: ACL, RBAC, ABAC',
    tldr: 'Three ways to express "who can do what" — lists, roles, and policies — trading simplicity for flexibility.',
    sections: [
      { h: 'ACL — lists', p: 'An access control list attaches permissions directly to a resource: principal X may read, Y may write. Simple and old, but it explodes as identities and resources grow.' },
      { h: 'RBAC — roles', p: 'Role-based access control bundles permissions into roles ("auditor", "operator") and assigns roles to identities. It scales with org structure but suffers "role explosion" when every exception needs a new role.' },
      { h: 'ABAC / PBAC — policies', p: 'Attribute/policy-based access evaluates rules at runtime using attributes (department, resource tag, time, risk). Most flexible, but needs a policy engine and good data.' },
    ],
    flow: [{ label: 'ACL', sub: 'who → resource' }, { label: 'RBAC', sub: 'role bundles' }, { label: 'ABAC', sub: 'policy at runtime' }],
    agentTwist: 'Agents are dynamic and non-deterministic, so standing roles strain. Agentic IAM leans toward attribute/policy decisions made just-in-time — authorize the action now, not a role forever.',
    related: [{ to: '/learn/zero-trust', label: 'Zero Trust' }, { to: '/compare', label: 'See it in the comparison' }],
    quiz: [
      { q: 'Which model bundles permissions into named job functions?', options: ['ACL', 'RBAC', 'ABAC'], answer: 1, explain: 'RBAC = role-based.' },
      { q: 'Which is most suited to runtime, context-aware decisions?', options: ['ACL', 'ABAC / PBAC'], answer: 1, explain: 'Attribute/policy-based access decides at runtime from context.' },
      { q: '"Role explosion" is a downside of…', options: ['ACL', 'RBAC', 'ABAC'], answer: 1, explain: 'RBAC can sprawl into too many narrow roles.' },
    ],
  },
  {
    slug: 'federation-sso', icon: '🤝', level: 'Foundation',
    title: 'Federation & Single Sign-On',
    tldr: 'Federation lets an identity from one place sign in somewhere else. SSO means one login works across many apps.',
    sections: [
      { h: 'The problem it solves', p: 'A directory stops at the org boundary. Federation lets a trusted identity provider (IdP) vouch for you to applications it doesn’t own, so you don’t need a separate account everywhere.' },
      { h: 'SAML & OIDC', p: 'SAML (2005) and OpenID Connect carry signed assertions or tokens about who you are between the IdP and a relying party. The app trusts the IdP’s signature instead of checking a password itself.' },
      { h: 'Single sign-on', p: 'Authenticate once at the IdP and reach many apps without re-entering credentials. Fewer passwords, central control, and one place to revoke access.' },
    ],
    flow: [{ label: 'IdP', sub: 'vouches' }, { label: 'Assertion', sub: 'signed claim' }, { label: 'App', sub: 'trusts IdP' }],
    agentTwist: 'Agents complicate federation: an agent acting for you may need to present both its own identity and a federated claim about you — across services that each trust different identity providers.',
    related: [{ to: '/learn/tokens-oauth', label: 'Tokens, OAuth & OIDC' }, { to: '/journey', label: 'Era 2 of the journey' }],
    quiz: [
      { q: 'Federation primarily lets you…', options: ['Use one identity across orgs/apps', 'Encrypt traffic', 'Store passwords'], answer: 0, explain: 'An IdP vouches for you to apps it doesn’t own.' },
      { q: 'In SSO, you authenticate…', options: ['Once, then reach many apps', 'Separately for every app', 'Never'], answer: 0, explain: 'One login at the IdP unlocks many relying parties.' },
      { q: 'SAML and OIDC carry…', options: ['Raw passwords', 'Signed assertions/tokens about you', 'Nothing'], answer: 1, explain: 'The app trusts the IdP’s signature, not a shared password.' },
    ],
  },
  {
    slug: 'tokens-oauth', icon: '🎟️', level: 'Foundation',
    title: 'Tokens, OAuth 2.0 & OIDC',
    tldr: 'OAuth lets an app act on your behalf without your password, using scoped, expiring tokens. OIDC adds "who you are" on top.',
    sections: [
      { h: 'Delegated access', p: 'OAuth 2.0 is an authorization framework: instead of handing an app your password, you grant it limited access. It receives a scoped access token — never your credentials.' },
      { h: 'Tokens & scopes', p: 'Access tokens are short-lived and scoped (the permission boundary). Refresh tokens renew them. A bearer token is "whoever holds it" — which is exactly why long-lived ones are dangerous.' },
      { h: 'OIDC adds identity', p: 'OpenID Connect layers an ID token on OAuth 2.0 to answer "who is the user?". Rule of thumb: OAuth = authorization, OIDC = authentication.' },
    ],
    flow: [{ label: 'User consents' }, { label: 'Authz server', sub: 'issues token' }, { label: 'App / agent', sub: 'scoped token' }, { label: 'Resource', sub: 'checks scope' }],
    agentTwist: 'Agents are the ultimate "app acting on your behalf" — but classic OAuth never imagined an agent that delegates to sub-agents. New work (the OAuth on-behalf-of-user draft, MCP’s OAuth 2.1 profile, RFC 8693 token exchange) makes tokens carry a delegation chain so you can trace user → agent → sub-agent.',
    related: [{ to: '/learn/agent-delegation', label: 'Agent delegation' }, { to: '/journey', label: 'Where this fits in the journey' }],
    quiz: [
      { q: 'OAuth 2.0 is primarily a framework for…', options: ['Authentication', 'Authorization / delegated access', 'Encryption'], answer: 1, explain: 'OAuth delegates scoped access; OIDC adds authentication.' },
      { q: 'What bounds what an access token can do?', options: ['Its scope', 'Its colour', 'Its length'], answer: 0, explain: 'Scope is the permission boundary.' },
      { q: 'Why are long-lived bearer tokens risky?', options: ['They expire too fast', 'Anyone who holds one can use it', 'They need a password'], answer: 1, explain: 'Bearer = whoever holds it; long life = big blast radius.' },
    ],
  },
  {
    slug: 'mfa', icon: '🔐', level: 'Foundation',
    title: 'MFA & step-up authentication',
    tldr: 'Multi-factor auth requires more than one proof of identity. Step-up adds a fresh check right before a risky action.',
    sections: [
      { h: 'The three factors', p: 'Something you know (password), something you have (a device or passkey), something you are (biometric). MFA combines at least two, so a stolen password alone isn’t enough.' },
      { h: 'Phishing resistance', p: 'Passkeys / FIDO2 bind the credential to the real site, defeating phishing that one-time codes (OTPs) still fall for. Not all factors are equal.' },
      { h: 'Step-up', p: 'Re-verify just before a sensitive action — a transfer, a deletion — rather than trusting the original login forever. Risk-based, in the moment.' },
    ],
    flow: [{ label: 'Know', sub: 'password' }, { label: 'Have', sub: 'passkey' }, { label: 'Are', sub: 'biometric' }],
    agentTwist: 'An agent can’t tap a phone or scan a face. Machine identity leans on cryptographic factors — keys, mTLS, attestation — and "step-up" becomes a human-in-the-loop approval before the agent does something dangerous.',
    related: [{ to: '/learn/zero-trust', label: 'Zero Trust' }, { to: '/topology', label: 'Approval in the topology' }],
    quiz: [
      { q: 'MFA requires…', options: ['Two of the same factor', 'At least two different factors', 'Only a password'], answer: 1, explain: 'Combine ≥2 distinct factor types.' },
      { q: 'Which is most phishing-resistant?', options: ['SMS one-time code', 'Passkey / FIDO2', 'Security question'], answer: 1, explain: 'Passkeys bind to the real site.' },
      { q: 'For agents, "step-up" usually becomes…', options: ['A biometric scan', 'A human-in-the-loop approval', 'A longer password'], answer: 1, explain: 'A fresh human approval before a dangerous action.' },
    ],
  },
  {
    slug: 'zero-trust', icon: '🛡️', level: 'Foundation',
    title: 'Zero Trust & least privilege',
    tldr: 'Never trust, always verify. Drop the network perimeter; make every request prove identity and context, and grant the least privilege that works.',
    sections: [
      { h: 'The shift', p: 'Old model: inside the network = trusted. Zero Trust removes implicit trust — location proves nothing. Google’s BeyondCorp proved it in practice; NIST SP 800-207 (2020) codified it.' },
      { h: 'Three principles', p: 'Verify explicitly (every request, with context), enforce least privilege (smallest access that works), and assume breach (limit blast radius, segment, log).' },
      { h: 'Identity becomes the perimeter', p: 'Workloads and agents have no "inside" to be in. Identity — not the network — becomes the control plane (SPIFFE/SPIRE gave workloads verifiable identity).' },
    ],
    flow: [{ label: 'Request' }, { label: 'Verify', sub: 'identity + context' }, { label: 'Least privilege', sub: 'minimal grant' }, { label: 'Assume breach', sub: 'contain + log' }],
    agentTwist: 'An autonomous agent is the purest Zero Trust subject: no fixed location, always running, and compromisable. Treating the sandbox/container as the boundary and checking every action — as Hermes does — is Zero Trust applied to an agent.',
    related: [{ to: '/learn/nhi', label: 'Non-human identities' }, { to: '/topology', label: 'Enforcement topology' }],
    quiz: [
      { q: 'The Zero Trust motto is…', options: ['Trust but verify', 'Never trust, always verify', 'Trust the network'], answer: 1, explain: 'No implicit trust — verify every request.' },
      { q: 'Which NIST publication codified Zero Trust?', options: ['SP 800-53', 'SP 800-207', 'SP 800-63'], answer: 1, explain: 'SP 800-207 (2020) is the Zero Trust Architecture standard.' },
      { q: 'In Zero Trust, the new perimeter is…', options: ['The firewall', 'Identity', 'The VPN'], answer: 1, explain: 'Identity becomes the control plane.' },
    ],
  },
  {
    slug: 'workload-identity', icon: '📦', level: 'Foundation',
    title: 'Workload identity & SPIFFE',
    tldr: 'Workloads — services, containers, agents — need verifiable identity without baked-in secrets. SPIFFE gives them one.',
    sections: [
      { h: 'The hardcoded-secret problem', p: 'Stuffing an API key into a service is fragile: it leaks, never rotates, and is shared. Workloads need an identity they can prove cryptographically, not a stored password.' },
      { h: 'SPIFFE / SPIRE', p: 'SPIFFE issues short-lived, verifiable IDs (SVIDs) to workloads based on what they are — attested by the platform — instead of a secret they hold. SPIRE is the runtime that hands them out.' },
      { h: 'Why it matters', p: 'It’s Zero Trust for machines: identity the platform attests to, rotated automatically, with no long-lived shared secret to steal.' },
    ],
    flow: [{ label: 'Workload' }, { label: 'Attestation', sub: 'what it is' }, { label: 'SVID', sub: 'short-lived id' }],
    agentTwist: 'An agent is a workload too. Giving agents attested, short-lived identities instead of long-lived API keys is one of the cleanest answers to the agent-credential problem — where SPIFFE-style workload identity meets the agent world.',
    related: [{ to: '/learn/nhi', label: 'Non-human identities' }, { to: '/learn/zero-trust', label: 'Zero Trust' }],
    quiz: [
      { q: 'Workload identity aims to replace…', options: ['Hardcoded, long-lived secrets', 'Encryption', 'Usernames'], answer: 0, explain: 'Provable identity instead of stored secrets.' },
      { q: 'A SPIFFE SVID is…', options: ['A long-lived password', 'A short-lived, verifiable workload ID', 'An API key'], answer: 1, explain: 'Short-lived and cryptographically verifiable.' },
      { q: 'Workload identity is essentially…', options: ['Zero Trust for machines', 'A firewall', 'A VPN'], answer: 0, explain: 'Attested, rotating identity — Zero Trust applied to workloads.' },
    ],
  },
  {
    slug: 'nhi', icon: '🤖', level: 'Foundation',
    title: 'Non-human identities (NHIs)',
    tldr: 'Most identities are not people — they are service accounts, API keys, workloads, and now agents. They outnumber humans 100:1+ and are a top breach vector.',
    sections: [
      { h: 'What counts as an NHI', p: 'Service accounts, API keys, OAuth apps, certificates, workloads, bots — and AI agents. Anything that authenticates and acts without a human at the keyboard.' },
      { h: 'Why they’re risky', p: 'NHIs are routinely over-permissioned (~97%), live on long-lived secrets that rarely rotate, are often unowned and unmonitored, and they spawn more NHIs. Research puts the NHI-to-human ratio around 144:1 (2025), up 44% year over year.' },
      { h: 'A real failure', p: 'The 2025 Salesloft–Drift breach started with stolen OAuth tokens from one integration and reached hundreds of downstream environments — a single NHI with too much standing access.' },
    ],
    flow: [{ label: 'Service acct' }, { label: 'API key' }, { label: 'Workload' }, { label: 'Agent', sub: 'newest, riskiest' }],
    agentTwist: 'Agents are a new, especially dangerous NHI class: unlike a static service account, they reason, act unpredictably, and spawn sub-identities. Yet only ~22% of teams treat agents as first-class, identity-bearing entities.',
    related: [{ to: '/learn/agent-delegation', label: 'Agent delegation' }, { to: '/cases', label: 'Case files' }],
    quiz: [
      { q: 'Which is a non-human identity?', options: ['A service account', 'A CEO', 'A meeting room'], answer: 0, explain: 'Service accounts, keys, workloads, agents = NHIs.' },
      { q: 'Roughly what share of NHIs are over-permissioned?', options: ['About 10%', 'About 50%', 'About 97%'], answer: 2, explain: 'Research found ~97% have excessive privileges.' },
      { q: 'The biggest everyday NHI risk is…', options: ['Long-lived, sprawling secrets', 'Too many passwords', 'Slow logins'], answer: 0, explain: 'Long-lived, unrotated, over-scoped secrets dominate NHI risk.' },
    ],
  },
  {
    slug: 'agent-delegation', icon: '🔗', level: 'Agentic',
    title: 'Delegation & on-behalf-of for agents',
    tldr: 'Agents act for you and hand work to sub-agents. The hard part: carry authority down the chain without over-granting — and keep it auditable.',
    sections: [
      { h: 'On-behalf-of', p: 'An agent rarely acts as itself; it acts for a user. Authorization has to capture both the user’s consent and the agent’s identity. The IETF "OAuth on-behalf-of user for AI agents" draft adds an act claim, a requested_actor consent parameter, and an actor_token to do exactly this.' },
      { h: 'Multi-hop delegation', p: 'When an orchestrator hands a task to a sub-agent, each hop should narrow scope (RFC 8693 token exchange) rather than pass the full token. Otherwise authority — and accountability — leak downstream.' },
      { h: 'Keeping the chain traceable', p: 'If nobody records which agent authorized which sub-agent with what scope, the accountability chain fractures. The delegation chain in the token is what lets you answer "who told this sub-agent it could do that?"' },
    ],
    flow: [{ label: 'User', sub: 'consents' }, { label: 'Agent', sub: 'act = agent' }, { label: 'Sub-agent', sub: 'narrowed scope' }, { label: 'Resource' }],
    agentTwist: 'This is the agentic frontier. Hermes scopes sub-agents via cross-session isolation; OpenClaw uses explicit delegation plus visibility: self / tree / agent / all. Both are early answers to a problem standards are still racing to solve.',
    related: [{ to: '/compare', label: 'How Hermes & OpenClaw handle it' }, { to: '/journey', label: 'Era 6 of the journey' }],
    quiz: [
      { q: 'An agent acting "on-behalf-of" a user means authorization must capture…', options: ['Just the agent', 'The user’s consent and the agent’s identity', 'Only the resource'], answer: 1, explain: 'Both the delegating user and the agent matter.' },
      { q: 'When an orchestrator delegates to a sub-agent, scope should…', options: ['Stay the same', 'Get narrower', 'Get broader'], answer: 1, explain: 'Each hop should narrow authority (RFC 8693).' },
      { q: 'What breaks if delegation is not recorded?', options: ['Token speed', 'The accountability chain', 'Encryption'], answer: 1, explain: 'Untracked delegation fractures accountability.' },
    ],
  },
]

// ── Standards radar: the protocols agentic IAM is being built on ────────────
// track: 'enterprise' | 'agentic' | 'both'
export const STANDARDS = [
  { name: 'OAuth 2.0 / 2.1', status: 'established', track: 'both', what: 'Delegated, scoped access via tokens — the backbone agents build on.' },
  { name: 'OpenID Connect', status: 'established', track: 'enterprise', what: 'Identity layer on OAuth — answers "who is the user?".' },
  { name: 'RFC 8693 — Token Exchange', status: 'RFC (2020)', track: 'both', what: 'Swap a token for a narrower one — the basis for scoped sub-agent delegation.' },
  { name: 'RFC 8707 — Resource Indicators', status: 'RFC (2020)', track: 'enterprise', what: 'Bind a token to a specific audience/resource, limiting where it can be replayed.' },
  { name: 'OAuth on-behalf-of user (AI agents)', status: 'IETF draft · 2025', track: 'agentic', what: 'Adds act / requested_actor / actor_token so a token carries the user → agent delegation chain.' },
  { name: 'MCP Authorization', status: 'spec · 2025-11', track: 'agentic', what: 'An OAuth 2.1 profile for the Model Context Protocol — how agent clients get scoped access to tools and servers.' },
  { name: 'SPIFFE / SPIRE', status: 'CNCF', track: 'enterprise', what: 'Verifiable, short-lived workload identity (SVIDs) without stored secrets.' },
  { name: 'NIST AI Agent Standards Initiative', status: 'launched · Feb 2026', track: 'agentic', what: 'Early US-government work toward governing autonomous-agent identity and action.' },
]

export const STANDARDS_SOURCES = [
  { label: 'IETF — OAuth On-Behalf-Of User for AI Agents (draft)', url: 'https://www.ietf.org/archive/id/draft-oauth-ai-agents-on-behalf-of-user-01.html' },
  { label: 'Model Context Protocol — Authorization', url: 'https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization' },
  { label: 'RFC 8693 — OAuth 2.0 Token Exchange', url: 'https://www.rfc-editor.org/rfc/rfc8693' },
  { label: 'SPIFFE — Secure Production Identity Framework', url: 'https://spiffe.io/' },
]

// ── Case files: learn from real (and representative) failures ───────────────
export const CASES = [
  {
    id: 'salesloft-drift', icon: '🔓', title: 'The Salesloft–Drift OAuth-token breach', year: '2025',
    severity: 'real incident',
    what: 'Attackers obtained OAuth tokens from a widely-integrated third-party app and used them to pull data from hundreds of downstream environments — the biggest SaaS breach of the year, with ~10× the blast radius of prior incidents.',
    identity: 'A single non-human identity (an OAuth app token) carrying broad, long-lived, standing scope across many tenants.',
    stopper: 'Short-lived, narrowly-scoped tokens; NHI inventory + monitoring; least privilege per integration; fast token revocation. Any one would have shrunk the blast radius.',
    era: 'Era 5 — NHIs', maps: 'SecretRef / token hygiene',
    source: 'https://permiso.io/non-human-identity-nhi-security-guide',
  },
  {
    id: 'runaway-agent', icon: '🌀', title: 'The agent nobody could stop', year: '2026',
    severity: 'representative pattern',
    what: 'An agent with standing broad credentials begins taking unintended actions. Teams discover they cannot enforce a purpose limit or terminate it cleanly — 63% of orgs report they cannot enforce purpose limits, and 60% cannot kill a misbehaving agent.',
    identity: 'An over-trusted agent identity with no runtime authorization and no kill switch.',
    stopper: 'Just-in-time / runtime authorization, purpose limitation, human-in-the-loop approval for dangerous actions, and an enforced kill switch.',
    era: 'Era 6 — Agents', maps: 'Dangerous-command approval',
    source: 'https://www.gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control',
  },
  {
    id: 'shadow-agents', icon: '👻', title: 'Shadow agents in production', year: '2026',
    severity: 'representative pattern',
    what: 'Business units deploy agents outside security’s visibility. Mean monitoring coverage sits near 52%, so roughly half of production agents run unsecured — unregistered identities, untracked credentials, unmonitored access.',
    identity: 'Uninventoried agent identities operating with credentials no one owns.',
    stopper: 'Agent discovery and inventory; treat every agent as a first-class identity (only ~22% do); centralized issuance instead of ad-hoc service accounts.',
    era: 'Era 6 — Agents', maps: 'Allowlist / gateway authority',
    source: 'https://www.gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control',
  },
  {
    id: 'prompt-injection-exfil', icon: '🧬', title: 'Prompt-injection → data exfiltration', year: '2026',
    severity: 'representative pattern',
    what: 'An agent reads an attacker-poisoned document (a project file, an email) containing hidden instructions, then uses its tools and network access to exfiltrate secrets — turning the agent into a confused deputy.',
    identity: 'A legitimately-authenticated agent tricked into abusing its own authorized access.',
    stopper: 'Context-file scanning, egress off by default, secret stripping from the subprocess, and credential redaction — exactly the layers in the defense-in-depth model.',
    era: 'Era 6 — Agents', maps: 'Context scanning + egress control',
    source: 'https://www.obsidiansecurity.com/blog/ai-agent-protection',
  },
]

// ── Learning paths: ordered routes by level ─────────────────────────────────
export const LEARNING_PATHS = [
  {
    id: 'new-iam', icon: '🌱', title: 'New to IAM', who: 'Start from zero — what identity even means.',
    steps: [
      { to: '/learn/authn-vs-authz', label: 'AuthN vs AuthZ' },
      { to: '/learn/access-models', label: 'Access models' },
      { to: '/learn/tokens-oauth', label: 'Tokens, OAuth & OIDC' },
      { to: '/learn/zero-trust', label: 'Zero Trust' },
      { to: '/journey', label: 'The journey of IAM' },
    ],
  },
  {
    id: 'new-agents', icon: '🤖', title: 'Know IAM, new to agents', who: 'You get identity — see what agents break.',
    steps: [
      { to: '/learn/nhi', label: 'Non-human identities' },
      { to: '/learn/agent-delegation', label: 'Agent delegation' },
      { to: '/journey', label: 'Eras 5–6 of the journey' },
      { to: '/', label: 'Case study: Hermes vs OpenClaw' },
      { to: '/cases', label: 'Case files' },
    ],
  },
  {
    id: 'practitioner', icon: '🛠️', title: 'Practitioner', who: 'Go deep on controls and trade-offs.',
    steps: [
      { to: '/compare', label: 'IAM diff & control matrix' },
      { to: '/topology', label: 'Enforcement topology' },
      { to: '/playground', label: 'Config posture' },
      { to: '/cases', label: 'Case files' },
      { to: '/quiz', label: 'Test yourself' },
    ],
  },
]

export const SOURCES = [
  { label: 'Hermes Agent — Security docs', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/security' },
  { label: 'Hermes Agent — SECURITY.md', url: 'https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md' },
  { label: 'OpenClaw — Gateway Security', url: 'https://docs.openclaw.ai/gateway/security' },
  { label: 'OpenClaw — Sandboxing', url: 'https://docs.openclaw.ai/gateway/sandboxing' },
]
