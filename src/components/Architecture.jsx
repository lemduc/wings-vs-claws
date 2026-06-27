// Two small inline SVG diagrams contrasting the documented architectures.

function HermesDiagram() {
  return (
    <svg viewBox="0 0 320 200" width="100%" role="img" aria-label="Hermes architecture">
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5b8cff" />
        </marker>
      </defs>
      {/* memory core */}
      <circle cx="160" cy="100" r="34" fill="#11203f" stroke="#5b8cff" strokeWidth="1.5" />
      <text x="160" y="96" textAnchor="middle" fill="#cfe0ff" fontSize="11" fontWeight="700">Agent</text>
      <text x="160" y="110" textAnchor="middle" fill="#9aa0b8" fontSize="9">+ memory</text>
      {/* surfaces around it */}
      {[
        ['Slack', 50, 36], ['Telegram', 270, 36], ['CLI', 36, 100],
        ['Email', 284, 100], ['Signal', 50, 164], ['Discord', 270, 164],
      ].map(([label, x, y]) => (
        <g key={label}>
          <line x1={x} y1={y} x2={160} y2={100} stroke="#2c3656" strokeWidth="1" markerEnd="url(#ah)" />
          <rect x={x - 28} y={y - 11} width="56" height="22" rx="6" fill="#161927" stroke="#262a3d" />
          <text x={x} y={y + 4} textAnchor="middle" fill="#9aa0b8" fontSize="9">{label}</text>
        </g>
      ))}
    </svg>
  )
}

function OpenClawDiagram() {
  return (
    <svg viewBox="0 0 320 200" width="100%" role="img" aria-label="OpenClaw architecture">
      <defs>
        <marker id="ac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ff9e45" />
        </marker>
      </defs>
      {/* gateway */}
      <rect x="110" y="18" width="100" height="30" rx="8" fill="#2a1d0e" stroke="#ff9e45" strokeWidth="1.5" />
      <text x="160" y="37" textAnchor="middle" fill="#ffd9b0" fontSize="11" fontWeight="700">Gateway</text>
      {/* primary agent */}
      <rect x="120" y="82" width="80" height="28" rx="8" fill="#161927" stroke="#ff9e45" />
      <text x="160" y="100" textAnchor="middle" fill="#ffd9b0" fontSize="10">Primary agent</text>
      <line x1="160" y1="48" x2="160" y2="82" stroke="#5a4326" strokeWidth="1.4" markerEnd="url(#ac)" />
      {/* subagents */}
      {[60, 160, 260].map((x, i) => (
        <g key={i}>
          <line x1="160" y1="110" x2={x} y2="150" stroke="#5a4326" strokeWidth="1.2" markerEnd="url(#ac)" />
          <rect x={x - 30} y="150" width="60" height="24" rx="6" fill="#161927" stroke="#262a3d" />
          <text x={x} y="165" textAnchor="middle" fill="#9aa0b8" fontSize="9">Subagent</text>
        </g>
      ))}
      {/* heartbeat */}
      <text x="160" y="192" textAnchor="middle" fill="#ff9e45" fontSize="9">♥ heartbeat polling</text>
    </svg>
  )
}

export default function Architecture() {
  return (
    <section id="architecture">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Under the hood</div>
          <h2>Two different shapes</h2>
          <p>Hermes centers one agent around a shared memory; OpenClaw routes through a gateway to spawned subagents.</p>
        </div>
        <div className="arch-grid">
          <div className="arch-card hermes">
            <h4>🪽 Hermes — one agent, one memory, every surface</h4>
            <div className="cap">A single persistent agent reachable from any channel, delegating to isolated subagents when needed.</div>
            <HermesDiagram />
          </div>
          <div className="arch-card openclaw">
            <h4>🦞 OpenClaw — gateway → agent → subagents</h4>
            <div className="cap">A gateway control plane manages sessions and a heartbeat; the primary agent spawns subagents for delegated work.</div>
            <OpenClawDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}
