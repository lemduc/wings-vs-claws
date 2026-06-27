# Wings vs Claws 🪽🦞

An interactive, source-grounded comparison of two open-source autonomous AI agents:

- **🪽 Hermes Agent** — Nous Research's self-improving agent ("one agent, one memory, every surface")
- **🦞 OpenClaw** — Peter Steinberger's local-first personal assistant (gateway → agent → subagents)

> The winged, self-improving researcher's agent versus the clawed, local-first personal assistant.

## What's inside

- **Hero** — side-by-side positioning with sourced metadata (creator, license, version).
- **Interactive task simulator** — pick a task (or type your own) and watch each agent's
  *documented architecture* light up step by step. Traces are **illustrative** dramatizations
  of each project's real design — not live runs.
- **Side-by-side comparison table** — origin, architecture, memory, skills, backends, platforms.
- **Feature matrix** — capability-by-capability (✓ / ◐ / —).
- **Architecture diagrams** — two inline SVGs contrasting the agent topologies.
- **Verdict** — short "which should you pick?" guidance.
- **Cited sources** in the footer.

## Stack

React 18 + Vite, plain CSS. All factual content lives in [`src/data.js`](src/data.js) so every
claim is traceable to a source.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Honesty & attribution

This is an **independent, unofficial** demo. It is not affiliated with Nous Research or the
OpenClaw project. Factual claims are drawn from each project's official site, docs, and GitHub
(retrieved June 2026); the simulator presents illustrative architecture traces, not transcripts.
Agent products evolve quickly — check the official sites for the latest:

- Hermes Agent: <https://hermes-agent.nousresearch.com/> · <https://github.com/nousresearch/hermes-agent>
- OpenClaw: <https://openclawagent.net/> · <https://github.com/openclaw>
