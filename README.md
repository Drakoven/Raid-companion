# Raid Companion

A mobile-first Progressive Web App (PWA) companion for Escape from Tarkov — with community features, responsive PC layout, and a backend-powered comment system.

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
- 💬 **Community Comments** — Leave tips and notes on any quest (account required)
- 👤 **User Accounts** — Register, login, role system (Admin / Moderator / Member)
- 📱 **Installable PWA** — Works offline once installed, no app store needed
- 🖥️ **Responsive** — Sidebar layout on PC, bottom nav on mobile

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- PHP 8.3 + MySQL (backend API)
- [Tarkov.dev GraphQL API](https://tarkov.dev)
- [Leaflet.js](https://leafletjs.com) — Interactive map rendering
- PWA (Service Worker, Web Manifest)

## Project Structure

```
├── index.html
├── style.css
├── service-worker.js
├── manifest.json
├── register.php        ← user registration API
├── login.php           ← user login API
├── comments.php        ← comments API (GET / POST / DELETE)
├── config.php          ← DB config (not committed)
├── assets/
│   └── maps/
│       └── interactive/   ← map images for Leaflet
└── js/
    ├── state.js           ← global variables & localStorage
    ├── api.js             ← escapeHTML, cache (TTL 1h), debounce
    ├── nav.js             ← bottom nav, History API (back button)
    ├── auth.js            ← login / register / logout / roles
    ├── comments.js        ← quest comments (load, submit, delete)
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
        ├── labs.js
        ├── lighthouse.js
        └── streets.js
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
- [x] Lighthouse — Extractions, Boss, Goons, Rogues, PMC Spawns, Transit, Quests
- [x] Streets — Extractions, Boss, PMC Spawns, Transit, Quests

## Community Features

- **Read-only public access** — anyone can browse quests, maps, and comments without an account
- **Account required to comment** — register to leave tips on quests
- **Role system** — Admin 👑 / Moderator 🛡️ / Member 👤
- **Comment moderation** — admins and moderators can delete inappropriate comments

## Backend Setup (local)

Requirements: PHP 8+, MySQL (WAMP / XAMPP)

1. Copy project to your web server root (e.g. `C:\wamp64\www\raid_companion\`)
2. Create a MySQL database named `raid_companion`
3. Create tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'membre'
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quest_id VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  contenu TEXT NOT NULL,
  created_at DATETIME NOT NULL
);
```

4. Create `config.php` (not committed):

```php
<?php
$host = "localhost";
$dbname = "raid_companion";
$username = "root";
$password = "your_password";

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
?>
```

## Installation (mobile)

1. Open the app link on your phone
2. Tap **"Add to Home Screen"** (Safari on iOS / Chrome on Android)
3. The app installs like a native app — no store required

## Data Source

All game data is fetched from [tarkov.dev](https://tarkov.dev), a community-maintained
GraphQL API for Escape from Tarkov. Data is cached locally for 1 hour to reduce API calls.
Map marker data is manually curated based on real in-game experience and knowledge.

## Disclaimer

Raid Companion is an unofficial fan-made tool and is not affiliated with Battlestate Games.
