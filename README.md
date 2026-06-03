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
  - Boss spawn points
  - Goons spawn points
  - Transit points
  - Quest markers with live completion status
  - Toggle filters by category
- 🔫 **Ammo / Ballistics** — All ammo sorted by penetration, caliber filter, side-by-side comparison (up to 3)
- 📖 **Storyline** — Story chapter tracker with ending selection
- ⭐ **Favorites** — Save your important quests and items
- 📱 **Installable PWA** — Works offline once installed, no app store needed

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- [Tarkov.dev GraphQL API](https://tarkov.dev)
- [Leaflet.js](https://leafletjs.com) — Interactive map rendering
- Netlify (hosting)
- PWA (Service Worker, Web Manifest)

## Project Structure

```
├── index.html
├── style.css
├── service-worker.js
├── manifest.json
├── assets/
│   └── maps/
│       └── interactive/   ← map images for Leaflet
└── js/
    ├── state.js           ← global variables & localStorage
    ├── api.js             ← escapeHTML, cache (TTL 1h), debounce
    ├── nav.js             ← bottom nav, History API (back button)
    ├── home.js            ← dashboard
    ├── quests.js          ← quests, kappa, objectives
    ├── items.js           ← items, pagination
    ├── maps.js            ← map list, Leaflet init, marker loading
    ├── hideout.js         ← hideout stations & item progress
    ├── traders.js         ← traders, sales, barters
    ├── ammo.js            ← ammo list, detail, side-by-side comparison
    ├── favorites.js       ← favorites
    ├── storyline.js       ← story chapters & ending selection
    ├── search.js          ← search bar logic
    └── markers/           ← map marker data (one file per map)
        ├── woods.js
        ├── customs.js
        ├── factory.js
        ├── shoreline.js
        ├── groundzero.js
        ├── reserve.js
        ├── interchange.js
        └── labs.js
```

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
| 🟨 Transit Points | BTR / inter-map transit locations |
| 🟣 Quests | Quest objectives with live completion tracking |

**Maps available:**
- [x] Woods — Extractions, Boss, Goons, PMC Spawns, Transit, Quests
- [x] Customs — Extractions, Boss, Goons, PMC Spawns, Quests
- [x] Factory — Extractions, Boss, PMC Spawns, Transit, Quests
- [x] Shoreline — Extractions, Boss, Goons, PMC Spawns, Transit, Quests (Full map + Sanatorium)
- [x] Ground Zero — Extractions, Boss, PMC Spawns, Transit, Quests
- [x] Reserve — Extractions, Boss, PMC Spawns, Transit, Quests
- [x] Interchange — Extractions, Boss, PMC Spawns, Transit, Quests
- [x] Labs — Extractions, PMC Spawns, Transit
- [ ] Lighthouse *(coming soon)*
- [ ] Streets *(coming soon)*

## Adding a New Map

1. Create `js/markers/mapname.js` with your markers array
2. Add `<script src="js/markers/mapname.js"></script>` in `index.html`
3. Register the map in `js/maps.js` inside `mapsData` and `loadMapMarkers`

## Live App

👉 [https://raid-companion-app.netlify.app](https://raid-companion-app.netlify.app)

## Installation (mobile)

1. Open the link above on your phone
2. Tap **"Add to Home Screen"** (Safari on iOS / Chrome on Android)
3. The app installs like a native app — no store required

## Local Development

No build step required. Just clone and open `index.html` in your browser or use the Live Server extension in VS Code.

```bash
git clone https://github.com/your-username/raid-companion.git
cd raid-companion
# Open index.html with Live Server in VS Code
```

## Data Source

All game data is fetched from [tarkov.dev](https://tarkov.dev), a community-maintained
GraphQL API for Escape from Tarkov. Data is cached locally for 1 hour to reduce API calls.
Map marker data is manually curated based on real in-game experience and knowledge.

## Community

Join the francophone Tarkov community: [r/TarkovEntraide](https://www.reddit.com/r/TarkovEntraide)

## Contributing

Feedback, bug reports, and feature suggestions are welcome!
Feel free to open an issue or a pull request.

## Disclaimer

Raid Companion is an unofficial fan-made tool and is not affiliated with Battlestate Games.
