# Raid Companion

A mobile-first Progressive Web App (PWA) companion for Escape from Tarkov.

## Features

- 📋 **Quests** — 499 quests with trader and map filters, individual objective tracking
- 🟣 **Kappa Progress** — Track your Kappa quest completion
- 🏚 **Hideout** — Station-by-station progress with item counters
- 💰 **Traders** — Sales and barters with level filters
- 🗺 **Maps** — Interactive maps built from scratch with Leaflet.js
  - PMC & Scav spawn points
  - All extractions (PMC, Scav-only, Co-op)
  - Boss spawn zones & patrol areas
  - Goons spawn points
  - Toggle filters by category
- 🔫 **Ammo / Ballistics** — All ammo sorted by penetration, caliber filter, side-by-side comparison (up to 3)
- ⭐ **Favorites** — Save your important quests and items
- 📱 **Installable PWA** — Works offline once installed, no app store needed

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- [Tarkov.dev GraphQL API](https://tarkov.dev)
- [Leaflet.js](https://leafletjs.com) — Interactive map rendering
- Netlify (hosting)
- PWA (Service Worker, Web Manifest)

## Maps

Interactive maps are hand-crafted using real in-game knowledge and Leaflet.js.
Each map includes layered markers with toggle filters:

| Layer | Description |
|---|---|
| 🟢 Extractions | PMC extraction points |
| 🩵 Scav Extractions | Scav-only extraction points |
| 🔵 Co-Op Extractions | Require both PMC + Scav |
| 🔴 Boss | Boss spawn points |
| 🟠 Goons | The Goons squad spawn zones |
| ⚫ PMC Spawns | Player spawn points |

**Maps available:**
- [x] Woods
- [ ] Customs *(coming soon)*
- [ ] Interchange *(coming soon)*
- [ ] Shoreline *(coming soon)*
- [ ] Reserve *(coming soon)*
- [ ] Lighthouse *(coming soon)*
- [ ] Streets *(coming soon)*
- [ ] Factory *(coming soon)*
- [ ] Labs *(coming soon)*
- [ ] Ground Zero *(coming soon)*

## Live App

👉 [https://raid-companion-app.netlify.app](https://raid-companion-app.netlify.app)

## Installation (mobile)

1. Open the link above on your phone
2. Tap **"Add to Home Screen"** (Safari on iOS / Chrome on Android)
3. The app installs like a native app — no store required

## Local Development

No build step required. Just clone and open `index.html` in your browser.

```bash
git clone https://github.com/your-username/raid-companion.git
cd raid-companion
# Open index.html in your browser or use a local server
```

## Data Source

All game data is fetched from [tarkov.dev](https://tarkov.dev), a community-maintained
GraphQL API for Escape from Tarkov. Data is cached locally for 1 hour to reduce API calls.
Map marker data is manually curated based on in-game experience.

## Contributing

Feedback, bug reports, and feature suggestions are welcome!
Feel free to open an issue or a pull request.

## Disclaimer

Raid Companion is an unofficial fan-made tool and is not affiliated with Battlestate Games.