// All factual content lives here so every claim is traceable to a source.
// Sources (fetched June 2026):
//   - https://hermes-agent.nousresearch.com/  (Hermes Agent official site)
//   - https://github.com/nousresearch/hermes-agent
//   - https://openclawagent.net/  (OpenClaw resources hub)
//   - https://github.com/openclaw  (OpenClaw GitHub org)
// The Simulator "traces" below are ILLUSTRATIVE: they dramatize each project's
// real, documented architecture. They are not live runs and not transcripts.

export const AGENTS = {
  hermes: {
    id: 'hermes',
    name: 'Hermes Agent',
    tagline: 'The agent that grows with you',
    symbol: '🪽',
    symbolLabel: 'Winged',
    creator: 'Nous Research',
    debut: 'February 2026',
    license: 'MIT',
    version: 'v0.17.0',
    site: 'https://hermes-agent.nousresearch.com/',
    repo: 'https://github.com/nousresearch/hermes-agent',
    motto: 'One agent, one memory, every surface.',
    blurb:
      'A self-improving autonomous agent that lives on your infrastructure, ' +
      'remembers what it learns across sessions, and gets more capable the longer it runs.',
  },
  openclaw: {
    id: 'openclaw',
    name: 'OpenClaw',
    tagline: 'Your local-first personal AI assistant',
    symbol: '🦞',
    symbolLabel: 'Clawed',
    creator: 'Peter Steinberger',
    debut: 'Late 2025',
    license: 'Open source (GitHub org)',
    version: '200k+ GitHub stars',
    site: 'https://openclawagent.net/',
    repo: 'https://github.com/openclaw',
    motto: 'Gateway → agent → subagents, on your own hardware.',
    blurb:
      'A local-first personal assistant that turns natural-language instructions into ' +
      'real device-level actions, running continuously on hardware you control.',
  },
}

// Side-by-side comparison rows. Each cell is sourced from the official material.
export const COMPARISON = [
  {
    dimension: 'Origin',
    hermes: 'Nous Research, debuted Feb 2026',
    openclaw: 'Peter Steinberger, launched late 2025',
  },
  {
    dimension: 'License',
    hermes: 'MIT (v0.17.0)',
    openclaw: 'Open source via OpenClaw GitHub org',
  },
  {
    dimension: 'Core idea',
    hermes: 'Self-improving agent with persistent memory — "one agent, one memory, every surface"',
    openclaw: 'Local-first assistant that executes real actions on your devices',
  },
  {
    dimension: 'Architecture',
    hermes: 'Single agent + persistent memory; delegates to isolated subagents',
    openclaw: 'Gateway control plane → primary agent → subagents',
  },
  {
    dimension: 'Memory model',
    hermes: 'Persistent across every session — learns projects, preferences, environment',
    openclaw: 'Session + skill state managed by the gateway',
  },
  {
    dimension: 'Skills',
    hermes: 'Self-writes reusable skills (agentskills.io standard); searchable & shareable',
    openclaw: 'ClawHub marketplace — 500+ community skills',
  },
  {
    dimension: 'Proactivity',
    hermes: 'Natural-language scheduling for automation',
    openclaw: 'Heartbeat mechanism for scheduled polling cycles',
  },
  {
    dimension: 'Execution backends',
    hermes: 'Local, Docker, SSH, Singularity, Modal (namespace isolation)',
    openclaw: 'User-controlled hardware; Node.js; browser control',
  },
  {
    dimension: 'Messaging surfaces',
    hermes: 'Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI',
    openclaw: 'WhatsApp, Telegram, Slack, Discord, Lark/Feishu, WeCom + CN apps',
  },
  {
    dimension: 'Models',
    hermes: 'Multi-model reasoning across 300+ models',
    openclaw: 'LLM-agnostic; bring your own model',
  },
  {
    dimension: 'Standout use case',
    hermes: 'Generating RL training trajectories & exporting for fine-tuning',
    openclaw: 'A privacy-preserving personal assistant across your messaging apps',
  },
]

// Feature presence matrix (✓ / partial / —), kept conservative to the sources.
export const FEATURE_MATRIX = [
  { feature: 'Persistent cross-session memory', hermes: 'yes', openclaw: 'partial' },
  { feature: 'Self-authored / self-improving skills', hermes: 'yes', openclaw: 'partial' },
  { feature: 'Community skill marketplace', hermes: 'partial', openclaw: 'yes' },
  { feature: 'Subagent delegation', hermes: 'yes', openclaw: 'yes' },
  { feature: 'Proactive / scheduled execution', hermes: 'yes', openclaw: 'yes' },
  { feature: 'Browser automation & vision', hermes: 'yes', openclaw: 'yes' },
  { feature: 'Multi-model routing (300+)', hermes: 'yes', openclaw: 'partial' },
  { feature: 'Voice / wake-word talk mode', hermes: 'partial', openclaw: 'yes' },
  { feature: 'RL trajectory export for fine-tuning', hermes: 'yes', openclaw: 'no' },
  { feature: 'Local-first / self-hosted', hermes: 'yes', openclaw: 'yes' },
]

// Illustrative step traces for the simulator. Each task has a script per agent.
// steps[].label = short stage name; steps[].detail = what that agent does.
// Grounded in documented architecture, NOT a live run.
export const TASKS = [
  {
    id: 'slack-triage',
    title: 'Triage my unread Slack and draft replies',
    icon: '💬',
  },
  {
    id: 'rl-export',
    title: 'Generate 1,000 tool-calling trajectories for fine-tuning',
    icon: '🧪',
  },
  {
    id: 'morning-brief',
    title: 'Every morning, brief me on calendar + news',
    icon: '🌅',
  },
  {
    id: 'browse-buy',
    title: 'Research a product across the web and summarize',
    icon: '🔎',
  },
]

export const TRACES = {
  'slack-triage': {
    hermes: [
      { label: 'Recall', detail: 'Loads persistent memory: who you Slack with, your tone, past threads.' },
      { label: 'Connect', detail: 'Reads unread via the Slack surface — same agent, same memory.' },
      { label: 'Reason', detail: 'Routes each thread to an appropriate model from 300+ available.' },
      { label: 'Skill', detail: 'Reuses a self-written "reply-in-my-voice" skill from a past session.' },
      { label: 'Draft', detail: 'Returns drafts; remembers your edits to get better next time.' },
    ],
    openclaw: [
      { label: 'Gateway', detail: 'Gateway control plane receives the request, opens a session.' },
      { label: 'Agent', detail: 'Primary agent connects the Slack channel integration.' },
      { label: 'Subagent', detail: 'Spawns a subagent to classify threads by priority.' },
      { label: 'Skill', detail: 'Pulls a reply-drafting skill from the ClawHub marketplace.' },
      { label: 'Execute', detail: 'Drafts locally on your hardware — nothing leaves your control.' },
    ],
  },
  'rl-export': {
    hermes: [
      { label: 'Fan out', detail: 'Spawns thousands of isolated subagent conversations in parallel.' },
      { label: 'Backends', detail: 'Runs across Docker / SSH / Modal with namespace isolation.' },
      { label: 'Checkpoint', detail: 'Automatic checkpointing as trajectories are generated.' },
      { label: 'Export', detail: 'Exports tool-calling trajectories ready for RL fine-tuning.' },
      { label: 'Learn', detail: 'Distills successful runs into new reusable skills.' },
    ],
    openclaw: [
      { label: 'Scope', detail: 'Built as a personal assistant — bulk trajectory export is out of its lane.' },
      { label: 'Workaround', detail: 'You could script subagents, but there is no native export pipeline.' },
      { label: 'Verdict', detail: 'This is where Hermes is purpose-built and OpenClaw is not.' },
    ],
  },
  'morning-brief': {
    hermes: [
      { label: 'Schedule', detail: 'You say "every morning brief me" in natural language — it schedules itself.' },
      { label: 'Recall', detail: 'Knows your calendar, interests, and preferred briefing length from memory.' },
      { label: 'Gather', detail: 'Web search + browsing pull fresh news; calendar surface adds your day.' },
      { label: 'Deliver', detail: 'Sends the brief to whichever surface you chose (Telegram, email, CLI…).' },
    ],
    openclaw: [
      { label: 'Heartbeat', detail: 'The heartbeat mechanism wakes the agent on a scheduled polling cycle.' },
      { label: 'Skills', detail: 'Calendar + news skills (from ClawHub) run as modular routines.' },
      { label: 'Gather', detail: 'Browser control fetches news; local calendar skill reads your day.' },
      { label: 'Deliver', detail: 'Pushes the brief to your messaging app of choice.' },
    ],
  },
  'browse-buy': {
    hermes: [
      { label: 'Plan', detail: 'Picks a reasoning model suited to research from the 300+ pool.' },
      { label: 'Browse', detail: 'Built-in browser automation + vision read product pages.' },
      { label: 'Synthesize', detail: 'Summarizes; saves a "product-research" skill for next time.' },
      { label: 'Remember', detail: 'Stores your preferences so future research is pre-tuned to you.' },
    ],
    openclaw: [
      { label: 'Agent', detail: 'Primary agent takes the task from the gateway.' },
      { label: 'Browse', detail: 'Browser-control skill navigates and scrapes the relevant pages.' },
      { label: 'Subagent', detail: 'Delegates per-source reading to subagents, then merges.' },
      { label: 'Summarize', detail: 'Returns a summary; runs entirely on your own machine.' },
    ],
  },
}

export const VERDICT = {
  hermes:
    'Pick Hermes if you want an agent that compounds — persistent memory, self-written ' +
    'skills, multi-model routing, and a real pipeline for generating RL training data. ' +
    'It is the better fit for builders, researchers, and power users.',
  openclaw:
    'Pick OpenClaw if you want a privacy-first personal assistant that lives on your own ' +
    'hardware and acts across all your messaging apps, with a large community skill ' +
    'marketplace and a proactive heartbeat. It is the better fit for everyday automation.',
}

export const SOURCES = [
  { label: 'Hermes Agent — official site', url: 'https://hermes-agent.nousresearch.com/' },
  { label: 'Hermes Agent — GitHub', url: 'https://github.com/nousresearch/hermes-agent' },
  { label: 'Hermes Agent — docs', url: 'https://hermes-agent.nousresearch.com/docs/' },
  { label: 'OpenClaw — resources hub', url: 'https://openclawagent.net/' },
  { label: 'OpenClaw — GitHub org', url: 'https://github.com/openclaw' },
]
