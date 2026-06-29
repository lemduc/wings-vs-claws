// Generates public/feed.xml (RSS 2.0) from the release notes in src/changelog.js.
// Runs on `npm run build` via the prebuild script.
import { writeFileSync } from 'node:fs'
import { SITE } from '../src/seo.js'
import { CHANGES } from '../src/changelog.js'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const items = CHANGES.map((r) => {
  const body = r.items.map((i) => `&lt;li&gt;${esc(i)}&lt;/li&gt;`).join('')
  return `    <item>
      <title>v${r.version} — ${esc(r.title)}</title>
      <link>${SITE.baseUrl}/changelog</link>
      <guid isPermaLink="false">wvc-v${r.version}</guid>
      <pubDate>${new Date(r.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>&lt;ul&gt;${body}&lt;/ul&gt;</description>
    </item>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE.name} — changelog</title>
    <link>${SITE.baseUrl}/changelog</link>
    <description>${esc(SITE.defaultDescription)}</description>
${items}
  </channel>
</rss>
`

writeFileSync(new URL('../public/feed.xml', import.meta.url), xml)
console.log(`feed.xml: ${CHANGES.length} entries`)
