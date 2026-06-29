// Single source of truth for navigation — drives the sidebar, routing,
// and the ⌘K command palette. Grouped into learning-oriented sections.
export const NAV = [
  {
    title: 'Learn',
    items: [
      { path: '/learn', id: 'start', label: 'Start here', icon: '◆', blurb: 'paths by level' },
      { path: '/foundations', id: 'foundations', label: 'Foundations', icon: '▤', blurb: 'core IAM concepts' },
    ],
  },
  {
    title: 'The story',
    items: [
      { path: '/journey', id: 'journey', label: 'The journey', icon: '↟', blurb: 'pre-AI to agents' },
    ],
  },
  {
    title: 'Case study',
    items: [
      { path: '/', id: 'overview', label: 'Hermes vs OpenClaw', icon: '⌂', blurb: 'two agents, two models' },
      { path: '/compare', id: 'compare', label: 'Compare', icon: '≡', blurb: 'diff + control matrix' },
      { path: '/topology', id: 'topology', label: 'Topology', icon: '◈', blurb: 'enforcement diagrams' },
    ],
  },
  {
    title: 'Practice',
    items: [
      { path: '/trace', id: 'trace', label: 'Access trace', icon: '❯', blurb: 'simulate a decision' },
      { path: '/game', id: 'game', label: 'Defense game', icon: '⛨', blurb: 'block the breach' },
      { path: '/playground', id: 'playground', label: 'Config posture', icon: '⚙', blurb: 'tune & score' },
      { path: '/quiz', id: 'quiz', label: 'Quiz', icon: '✓', blurb: 'test yourself' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { path: '/glossary', id: 'glossary', label: 'Glossary', icon: '¶', blurb: 'IAM terms' },
      { path: '/standards', id: 'standards', label: 'Standards radar', icon: '◎', blurb: 'protocols to watch' },
      { path: '/cases', id: 'cases', label: 'Case files', icon: '⚑', blurb: 'learn from breaches' },
    ],
  },
]

export const PAGES = NAV.flatMap((s) => s.items)
