// Single source of truth for pages — drives routing, the sidebar navigator,
// and the ⌘K command palette.
export const PAGES = [
  { path: '/', id: 'overview', label: 'Overview', icon: '⌂', blurb: 'the two agents + the verdict' },
  { path: '/trace', id: 'trace', label: 'Access trace', icon: '❯', blurb: 'simulate an access decision' },
  { path: '/compare', id: 'compare', label: 'Compare', icon: '≡', blurb: 'diff + control matrix' },
  { path: '/topology', id: 'topology', label: 'Topology', icon: '◈', blurb: 'enforcement diagrams' },
  { path: '/playground', id: 'playground', label: 'Config posture', icon: '⚙', blurb: 'tune settings, score it' },
  { path: '/game', id: 'game', label: 'Defense game', icon: '⛨', blurb: 'block the breach' },
  { path: '/glossary', id: 'glossary', label: 'Glossary', icon: '¶', blurb: 'IAM terms, defined' },
]
