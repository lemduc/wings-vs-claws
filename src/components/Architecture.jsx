import { HERMES_LAYERS, OPENCLAW_GATES } from '../data.js'

// CSS-variable references via `style` so the diagrams follow the active theme.
// (SVG presentation attributes don't resolve var(); the style property does.)
const C = {
  hermes: 'var(--hermes)',
  claw: 'var(--claw)',
  green: 'var(--green)',
  red: 'var(--red)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  faint: 'var(--faint)',
  border: 'var(--border)',
  panel: 'var(--panel)',
  bg: 'var(--bg-soft)',
}
const MONO = 'monospace'

// Hermes — cascading "defense in depth": a request must pass through all 7
// stacked layers before reaching the contained core.
function HermesDiagram() {
  const cardW = 188
  const cardH = 30
  const x0 = 14
  const y0 = 50
  const dx = 7
  const dy = 33
  return (
    <svg viewBox="0 0 360 340" width="100%" role="img"
      aria-label="Hermes defense-in-depth: a request passes through seven stacked security layers to a contained core">
      <defs>
        <marker id="h-arw" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" style={{ fill: C.hermes }} />
        </marker>
      </defs>

      {/* incoming request */}
      <rect x="10" y="10" width="120" height="24" rx="12" style={{ fill: C.bg, stroke: C.faint }} />
      <text x="70" y="26" textAnchor="middle" fontSize="11" fontFamily={MONO} style={{ fill: C.muted }}>access request</text>
      <line x1="46" y1="34" x2={x0 + 24} y2={y0 - 3} strokeWidth="1.4" markerEnd="url(#h-arw)" style={{ stroke: C.hermes }} />

      {/* 7 cascading layers (outer -> inner) */}
      {HERMES_LAYERS.map((l, i) => {
        const x = x0 + i * dx
        const y = y0 + i * dy
        return (
          <g key={i}>
            <rect x={x} y={y} width={cardW} height={cardH} rx="6"
              strokeOpacity={0.55 + i * 0.06} style={{ fill: C.panel, stroke: C.hermes }} />
            <circle cx={x + 16} cy={y + cardH / 2} r="10" style={{ fill: C.bg, stroke: C.hermes }} />
            <text x={x + 16} y={y + cardH / 2 + 4} textAnchor="middle" fontSize="11" fontFamily={MONO} fontWeight="700" style={{ fill: C.hermes }}>{i + 1}</text>
            <text x={x + 33} y={y + cardH / 2 + 4} fontSize="11" fontFamily={MONO} style={{ fill: C.text }}>{l.short}</text>
          </g>
        )
      })}

      {/* contained core */}
      <rect x="78" y="298" width="210" height="30" rx="6" style={{ fill: C.bg, stroke: C.green }} />
      <text x="183" y="317" textAnchor="middle" fontSize="11" fontFamily={MONO} style={{ fill: C.green }}>🔒 container = the boundary</text>
    </svg>
  )
}

// OpenClaw — sequential gate chain: every gate must allow, else deny.
function OpenClawDiagram() {
  const gx = 60
  const gw = 232
  const gh = 42
  const y0 = 48
  const step = 56
  return (
    <svg viewBox="0 0 360 340" width="100%" role="img"
      aria-label="OpenClaw gate chain: a request passes sequentially through four permission gates; any gate can deny, only all-pass grants access">
      <defs>
        <marker id="c-arw" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" style={{ fill: C.claw }} />
        </marker>
        <marker id="c-deny" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" style={{ fill: C.red }} />
        </marker>
      </defs>

      {/* incoming request */}
      <rect x="120" y="10" width="120" height="24" rx="12" style={{ fill: C.bg, stroke: C.faint }} />
      <text x="180" y="26" textAnchor="middle" fontSize="11" fontFamily={MONO} style={{ fill: C.muted }}>access request</text>
      <line x1="180" y1="34" x2="180" y2={y0 - 4} strokeWidth="1.4" markerEnd="url(#c-arw)" style={{ stroke: C.claw }} />

      {OPENCLAW_GATES.map((g, i) => {
        const y = y0 + i * step
        const next = y0 + (i + 1) * step
        return (
          <g key={i}>
            <rect x={gx} y={y} width={gw} height={gh} rx="6" style={{ fill: C.panel, stroke: C.claw }} />
            <text x={gx + 12} y={y + 18} fontSize="12" fontFamily={MONO} fontWeight="700" style={{ fill: C.claw }}>{g.gate}</text>
            <text x={gx + 12} y={y + 33} fontSize="10" fontFamily={MONO} style={{ fill: C.muted }}>{g.detail}</text>
            {/* deny branch */}
            <line x1={gx + gw} y1={y + gh / 2} x2={gx + gw + 38} y2={y + gh / 2} strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#c-deny)" style={{ stroke: C.red }} />
            <text x={gx + gw + 16} y={y + gh / 2 - 5} fontSize="9" fontFamily={MONO} style={{ fill: C.red }}>deny</text>
            {/* pass arrow to next gate */}
            {i < OPENCLAW_GATES.length - 1 && (
              <line x1="180" y1={y + gh} x2="180" y2={next - 4} strokeWidth="1.4" markerEnd="url(#c-arw)" style={{ stroke: C.claw }} />
            )}
          </g>
        )
      })}

      {/* granted */}
      <line x1="180" y1={y0 + 4 * step - step + gh} x2="180" y2={y0 + 4 * step - 4} strokeWidth="1.4" markerEnd="url(#c-arw)" style={{ stroke: C.claw }} />
      <rect x="116" y={y0 + 4 * step} width="128" height="28" rx="14" style={{ fill: C.bg, stroke: C.green }} />
      <text x="180" y={y0 + 4 * step + 18} textAnchor="middle" fontSize="11" fontFamily={MONO} style={{ fill: C.green }}>✓ all gates pass</text>
    </svg>
  )
}

export default function Architecture() {
  return (
    <section id="architecture">
      <div className="section-head">
        <div className="eyebrow">the iam model, visualized</div>
        <h2><span className="fn">enforcement</span><span className="pn">.topology</span></h2>
        <p>
          Hermes stacks seven independent defensive layers — a request must survive all of
          them. OpenClaw chains permission gates that each must say "allow." Two different
          shapes of "least privilege."
        </p>
      </div>

      <div className="arch-grid">
        <div className="term">
          <div className="term-bar" style={{ borderBottomColor: 'var(--hermes-dim)' }}>
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="lbl">🪽 Hermes — defense-in-depth</span>
            <span className="fname">7 layers</span>
          </div>
          <div className="term-body">
            <HermesDiagram />
            <div className="legend">
              {HERMES_LAYERS.map((l, i) => (
                <div className="leg" key={i}>
                  <span className="n h">{i + 1}</span>
                  <span className="lt">{l.short}</span>
                  <span className="lf">{l.full}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="term">
          <div className="term-bar" style={{ borderBottomColor: 'var(--claw-dim)' }}>
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="lbl">🦞 OpenClaw — every gate must allow</span>
            <span className="fname">request → grant</span>
          </div>
          <div className="term-body">
            <OpenClawDiagram />
            <div className="legend">
              {OPENCLAW_GATES.map((g, i) => (
                <div className="leg" key={i}>
                  <span className="n c">{i + 1}</span>
                  <span className="lt">{g.gate}</span>
                  <span className="lf">{g.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
