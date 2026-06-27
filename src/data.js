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

export const SOURCES = [
  { label: 'Hermes Agent — Security docs', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/security' },
  { label: 'Hermes Agent — SECURITY.md', url: 'https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md' },
  { label: 'OpenClaw — Gateway Security', url: 'https://docs.openclaw.ai/gateway/security' },
  { label: 'OpenClaw — Sandboxing', url: 'https://docs.openclaw.ai/gateway/sandboxing' },
]
