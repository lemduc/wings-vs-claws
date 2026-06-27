import { AGENTS } from '../data.js'

function AgentCard({ id }) {
  const a = AGENTS[id]
  return (
    <div className={`agentcard term ${id}`}>
      <div className={`term-bar ${id}`}>
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="fname">{a.file}</span>
      </div>
      <div className="term-body">
        <h3>{a.symbol} {a.name}</h3>
        <div className="model">IAM model: <b>{a.iamModel}</b></div>
        <p className="motto">{a.motto}</p>
        <p className="blurb">{a.blurb}</p>
        <div className="kv">
          <span>{a.creator}</span>
          <span>{a.license}</span>
        </div>
        <div className="links">
          <a href={a.site} target="_blank" rel="noreferrer">security docs ↗</a>
          <a href={a.repo} target="_blank" rel="noreferrer">source ↗</a>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <header className="hero">
      <div className="eyebrow">$ ./compare --topic=iam hermes openclaw</div>
      <h1>
        <span className="w">Hermes Agent</span> <span className="vs">vs</span> <span className="c">OpenClaw</span>
        <br />two agents, two IAM philosophies
      </h1>
      <p className="sub">
        Both run as autonomous, tool-wielding processes on your infrastructure — which makes
        them <span className="tok-orange">non-human identities</span> with real blast radius.
        This is a source-grounded look at how each one handles{' '}
        <span className="tok-blue">authentication, authorization, secrets, isolation, and delegation</span>.
        Code-level, IAM-only.
      </p>
      <div className="split">
        <AgentCard id="hermes" />
        <AgentCard id="openclaw" />
      </div>
    </header>
  )
}
