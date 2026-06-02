const API_URL = "https://api.tarkov.dev/graphql";

const content = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

let allTasks = [];
let allItems = [];
let allHideoutStations = [];
let allTraders = [];
let allAmmo = [];

let currentSection = "home";
let hideCompletedItems = false;

let selectedTraderLevel = "all";
let traderViewMode = "sales";
let traderSearchValue = "";
let pendingTraderSearch = "";
let selectedAmmoPen = 0;
let selectedAmmoCaliber = "all";

// Comparaison munitions — max 3 sélectionnées
let ammoComparison = [];

// Pagination items
let itemsPage = 0;
const ITEMS_PER_PAGE = 40;
let currentFilteredItems = [];

// Filtres quests
let questFilterTrader = "all";
let questFilterMap = "all";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
let completedObjectives = JSON.parse(localStorage.getItem("completedObjectives")) || {};
let hideoutItemProgress = JSON.parse(localStorage.getItem("hideoutItemProgress")) || {};

const mapsData = [
  {
    name: "Customs",
    image: "assets/maps/customs.jpg",
    difficulty: "Beginner / Intermediate",
    boss: "Reshala",
    use: "Very popular for early quests.",
    extracts: ["Crossroads", "ZB-1011", "Trailer Park", "RUAF Roadblock"],
    mapgenie: "https://mapgenie.io/tarkov/maps/customs",
    interactive: "assets/maps/interactive/customs.png" 
  },
  {
    name: "Factory",
    image: "assets/maps/facto.jpg",
    difficulty: "Hard",
    boss: "Tagilla",
    use: "Small PvP map, fast and dangerous.",
    extracts: ["Gate 3", "Cellars", "Med Tent Gate"],
    mapgenie: "https://mapgenie.io/tarkov/maps/factory",
    interactive: "assets/maps/interactive/factory.png"
  },
  {
    name: "Woods",
    image: "assets/maps/woods.jpg",
    difficulty: "Intermediate",
    boss: "Shturman",
    use: "Large open map, great for quests and sniping.",
    extracts: ["Outskirts", "UN Roadblock", "ZB-014", "RUAF Gate"],
    mapgenie: "https://mapgenie.io/tarkov/maps/woods",
    interactive: "assets/maps/interactive/woods.png"
  },
  {
    name: "Interchange",
    image: "assets/maps/interchange.jpg",
    difficulty: "Intermediate",
    boss: "Killa",
    use: "Great technical and electronic loot.",
    extracts: ["Emercom Checkpoint", "Railway Exfil", "Power Station"],
    mapgenie: "https://mapgenie.io/tarkov/maps/interchange"
  },
  {
    name: "Reserve",
    image: "assets/maps/reserve.jpg",
    difficulty: "Hard",
    boss: "Glukhar",
    use: "Excellent military loot and raiders.",
    extracts: ["D-2", "Hermetic Door", "Cliff Descent", "Armored Train"],
    mapgenie: "https://mapgenie.io/tarkov/maps/reserve"
  },
  {
    name: "Shoreline",
    image: "assets/maps/shoreline.jpg",
    difficulty: "Intermediate",
    boss: "Sanitar",
    use: "Large quest-oriented map with resort area.",
    extracts: ["Tunnel", "Road to Customs", "Pier Boat", "Path to Lighthouse"],
    mapgenie: "https://mapgenie.io/tarkov/maps/shoreline",
    interactive: "assets/maps/interactive/shoreline.png",
    interactiveVariants: [
      { label: "🗺 Full Map", path: "assets/maps/interactive/shoreline.png", markers: "shorelineMarkers" },
      { label: "🏥 Sanatorium", path: "assets/maps/interactive/shoreline_sanatorium.png", markers: "shorelineSanatoriumMarkers" }
    ]
  },
  {
    name: "Lighthouse",
    image: "assets/maps/lighthouse.jpg",
    difficulty: "Hard",
    boss: "Zryachiy / Rogues",
    use: "Excellent loot with Rogue presence.",
    extracts: ["Southern Road", "Path to Shoreline", "Mountain Pass"],
    mapgenie: "https://mapgenie.io/tarkov/maps/lighthouse"
  },
  {
    name: "Labs",
    image: "assets/maps/labs.jpg",
    difficulty: "Very Hard",
    boss: "Raiders",
    use: "Intense PvP and high-tier loot.",
    extracts: ["Cargo Elevator", "Medical Elevator", "Parking Gate"],
    mapgenie: "https://mapgenie.io/tarkov/maps/the-lab"
  },
  {
    name: "Streets",
    image: "assets/maps/streets.jpg",
    difficulty: "Very Hard",
    boss: "Kaban / Kollontay",
    use: "Very dense map with enormous loot potential.",
    extracts: ["Collapsed Crane", "Courtyard", "Damaged House", "Klimov Street"],
    mapgenie: "https://mapgenie.io/tarkov/maps/streets-of-tarkov"
  },
  {
    name: "Ground Zero",
    image: "assets/maps/groundzero.jpg",
    difficulty: "Beginner",
    boss: "None",
    use: "Introduction map for new players.",
    extracts: ["Emercom Checkpoint", "Police Checkpoint", "Nakatani Basement"],
    mapgenie: "https://mapgenie.io/tarkov/maps/ground-zero"
  }
];

/* =========================
   NAVIGATION ACTIVE
   Met en surbrillance le bouton de la section courante
========================= */

function setActiveNav(section) {
  const navMap = {
    home:      0,
    quests:    1,
    kappa:     1,
    items:     2,
    maps:      3,
    "map-detail": 3,
    hideout:   4,
    traders:   5,
    ammo:      6,
    favorites: 7
  };

  const buttons = document.querySelectorAll(".bottom-nav button");
  buttons.forEach(btn => btn.classList.remove("nav-active"));

  const index = navMap[section];
  if (index !== undefined && buttons[index]) {
    buttons[index].classList.add("nav-active");
  }
}

/* =========================
   HISTORIQUE NAVIGATEUR (History API)
   Le bouton retour mobile navigue entre les sections
========================= */

// Enregistre une entrée dans l'historique à chaque changement de section
function pushHistory(section, data = {}) {
  history.pushState({ section, ...data }, "", `#${section}`);
}

// Écoute le bouton retour natif
window.addEventListener("popstate", event => {
  const state = event.state;
  if (!state) { showHome(); return; }

  switch (state.section) {
    case "home":      showHome(false); break;
    case "quests":    displayQuests(allTasks, false); break;
    case "items":     displayItems(allItems, false); break;
    case "maps":      showMaps(false); break;
    case "hideout":   displayHideoutStations(allHideoutStations, false); break;
    case "traders":   displayTraders(allTraders, false); break;
    case "ammo":      displayAmmo(allAmmo, false); break;
    case "favorites": showFavorites(false); break;
    case "quest-detail":
      const task = allTasks.find(t => t.id === state.id);
      if (task) displayQuestDetails(task, false);
      break;
    case "item-detail":
      const item = allItems.find(i => i.id === state.id);
      if (item) displayItemDetails(item, false);
      break;
    case "map-detail":
      const map = mapsData.find(m => m.name === state.name);
      if (map) openMap(map, false);
      break;
    default: showHome(false);
  }
});

/* =========================
   SÉCURITÉ — ÉCHAPPEMENT HTML
   Empêche les injections XSS depuis les données API
========================= */

function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   CACHE AVEC TTL (1 heure)
   Évite de servir des données périmées après un wipe ou une MAJ API
========================= */

const CACHE_TTL = 60 * 60 * 1000; // 1 heure en millisecondes

function saveToCache(key, data) {
  const entry = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(entry));
}

function loadFromCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);

    // Ancien format sans timestamp — invalide
    if (!entry.timestamp || !entry.data) return null;

    // Données expirées
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/* =========================
   DEBOUNCE
   Evite de re-render le DOM à chaque frappe clavier
========================= */

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* =========================
   QUÊTES
========================= */

async function getQuests(push = true) {
  currentSection = "quests";
  if (push) pushHistory("quests");
  setActiveNav("quests");
  searchInput.style.display = "block";
  searchInput.value = "";
  content.innerHTML = "<p>Loading quests...</p>";

  const cachedTasks = loadFromCache("cachedTasks");

  if (cachedTasks) {
    allTasks = cachedTasks;
    displayQuests(allTasks);
    return;
  }

  const query = `
    {
      tasks {
        id
        name
        kappaRequired
        experience
        minPlayerLevel
        trader { name }
        map { name }
        objectives { description }
        taskRequirements {
          task {
            id
            name
          }
        }
        finishRewards {
          items {
            item {
              name
              iconLink
            }
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Quest API error.</p>";
      return;
    }

    allTasks = result.data.tasks;
    saveToCache("cachedTasks", allTasks);
    displayQuests(allTasks);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load quests.</p>";
  }
}

function displayQuests(tasks, push = true) {
  if (push) pushHistory("quests");
  setActiveNav("quests");

  // Listes uniques pour les filtres
  const traders = ["all", ...new Set(tasks.map(t => t.trader?.name).filter(Boolean))].sort();
  const maps = ["all", ...new Set(tasks.map(t => t.map?.name).filter(Boolean))].sort();

  // Filtrage
  const filtered = tasks.filter(task => {
    const traderMatch = questFilterTrader === "all" || task.trader?.name === questFilterTrader;
    const mapMatch = questFilterMap === "all" || task.map?.name === questFilterMap;
    return traderMatch && mapMatch;
  });

  content.innerHTML = `
    <h2>Quests <span style="font-size:14px; color:var(--muted)">(${filtered.length})</span></h2>

    <div class="quest-filters">
      <div class="quest-filter-row">
        <label>Trader</label>
        <select onchange="setQuestFilter('trader', this.value)">
          ${traders.map(t => `
            <option value="${escapeHTML(t)}" ${questFilterTrader === t ? "selected" : ""}>
              ${t === "all" ? "All" : escapeHTML(t)}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="quest-filter-row">
        <label>Map</label>
        <select onchange="setQuestFilter('map', this.value)">
          ${maps.map(m => `
            <option value="${escapeHTML(m)}" ${questFilterMap === m ? "selected" : ""}>
              ${m === "all" ? "All" : escapeHTML(m)}
            </option>
          `).join("")}
        </select>
      </div>

      ${questFilterTrader !== "all" || questFilterMap !== "all" ? `
        <button class="reset-filter-btn" onclick="resetQuestFilters()">
          ✕ Reset filters
        </button>
      ` : ""}
    </div>
  `;

  if (filtered.length === 0) {
    content.innerHTML += "<p>No quests found for these filters.</p>";
    return;
  }

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    if (isTaskComplete(task.id)) card.classList.add("quest-complete");
    card.onclick = () => displayQuestDetails(task);

    const objProgress = getQuestObjectiveProgress(task);

    card.innerHTML = `
      <h3>
        ${isTaskComplete(task.id) ? "✔ " : ""}
        ${escapeHTML(task.name)}
        ${task.kappaRequired ? '<span class="kappa-badge">🟣 Kappa</span>' : ""}
      </h3>
      <p>
        ${escapeHTML(task.trader?.name) || "Unknown"}
        ${task.map?.name ? `· ${escapeHTML(task.map.name)}` : ""}
        ${task.minPlayerLevel ? `· Lvl. ${task.minPlayerLevel}` : ""}
      </p>
      ${objProgress && !isTaskComplete(task.id) ? `
        <div class="card-obj-progress">
          <div class="card-obj-bar">
            <div class="progress-fill" style="width:${objProgress.pct}%"></div>
          </div>
          <span class="card-obj-label">${objProgress.done}/${objProgress.total}</span>
        </div>
      ` : ""}
    `;

    content.appendChild(card);
  });
}

function setQuestFilter(type, value) {
  if (type === "trader") questFilterTrader = value;
  if (type === "map") questFilterMap = value;
  displayQuests(allTasks);
}

function resetQuestFilters() {
  questFilterTrader = "all";
  questFilterMap = "all";
  displayQuests(allTasks);
}

function displayQuestDetails(task, push = true) {
  if (push) pushHistory("quest-detail", { id: task.id });
  setActiveNav("quests");
  const unlockedTasks = getUnlockedTasks(task.id);

  content.innerHTML = `
    <button class="back-btn" onclick="displayQuests(allTasks)">
      ← Back
    </button>

    <div class="quest-detail">
      <h2>${escapeHTML(task.name)}</h2>

      ${task.kappaRequired ? '<div class="kappa-detail">🟣 Requise pour Kappa</div>' : ""}

      <button
        class="favorite-btn"
        onclick='addFavorite("quest", { id: "${escapeHTML(task.id)}", name: "${escapeHTML(task.name)}" })'
      >
        ${isFavorite(task.id) ? "⭐ Remove from favorites" : "☆ Add to favorites"}
      </button>

      <button
        id="complete-btn-${escapeHTML(task.id)}"
        class="complete-btn"
        onclick='toggleTaskComplete("${escapeHTML(task.id)}")'
      >
        ${isTaskComplete(task.id) ? "✔ Quest completed" : "❌ Mark as completed"}
      </button>

      <div class="detail-box">
        <p><strong>Trader:</strong> ${escapeHTML(task.trader?.name) || "Unknown"}</p>
        <p><strong>Map:</strong> ${escapeHTML(task.map?.name) || "Not specified"}</p>
        <p><strong>Required level:</strong> ${escapeHTML(task.minPlayerLevel) || "None"}</p>
        <p><strong>XP:</strong> ${task.experience || 0}</p>
      </div>

      <div class="detail-box">
        <div class="objectives-header">
          <button class="section-toggle" onclick="toggleSection('objectives-section')" style="flex:1">
            ▼ Objectives
          </button>
          ${task.objectives?.length > 0 ? `
            <span class="obj-progress-label">
              <span id="obj-label-${escapeHTML(task.id)}">
                ${task.objectives.filter((_, i) => isObjectiveComplete(task.id, i)).length}
                / ${task.objectives.length}
              </span>
            </span>
          ` : ""}
        </div>

        ${task.objectives?.length > 0 ? `
          <div class="obj-progress-bar">
            <div
              class="progress-fill"
              id="obj-progress-${escapeHTML(task.id)}"
              style="width: ${Math.round(
                (task.objectives.filter((_, i) => isObjectiveComplete(task.id, i)).length
                / task.objectives.length) * 100
              )}%"
            ></div>
          </div>
        ` : ""}

        <div id="objectives-section">
          ${
            task.objectives?.length > 0
              ? task.objectives.map((obj, i) => {
                  const done = isObjectiveComplete(task.id, i);
                  return `
                    <div
                      class="objective objective-checkable ${done ? "objective-done" : ""}"
                      id="obj-${escapeHTML(task.id)}-${i}"
                      onclick="toggleObjective('${escapeHTML(task.id)}', ${i})"
                    >
                      <span class="obj-checkbox">${done ? "✔" : ""}</span>
                      <span class="obj-text">${escapeHTML(obj.description)}</span>
                    </div>
                  `;
                }).join("")
              : "<p>No objectives found.</p>"
          }
        </div>
      </div>

      <div class="detail-box">
        <button class="section-toggle" onclick="toggleSection('rewards-section')">
          ▼ Rewards
        </button>
        <div id="rewards-section">
          ${
            task.finishRewards?.items?.length > 0
              ? task.finishRewards.items.map(reward => `
                  <div class="reward">
                    ${reward.item.iconLink ? `<img src="${escapeHTML(reward.item.iconLink)}" alt="${escapeHTML(reward.item.name)}" loading="lazy">` : ""}
                    <span>${reward.count} x ${escapeHTML(reward.item.name)}</span>
                  </div>
                `).join("")
              : "<p>No rewards found.</p>"
          }
        </div>
      </div>

      <div class="detail-box">
        <button class="section-toggle" onclick="toggleSection('requirements-section')">
          ▼ Prerequiredite Quests
        </button>
        <div id="requirements-section">
          ${
            task.taskRequirements?.length > 0
              ? task.taskRequirements.map(req => `
                  <div class="objective">${escapeHTML(req.task?.name) || "Unknown quest"}</div>
                `).join("")
              : "<p>No prerequiredite quests required.</p>"
          }
        </div>
      </div>

      <div class="detail-box">
        <button class="section-toggle" onclick="toggleSection('unlocked-section')">
          ▼ Unlocked Quests
        </button>
        <div id="unlocked-section">
          ${
            unlockedTasks.length > 0
              ? unlockedTasks.map(unlocked => `
                  <div class="objective">
                    ${escapeHTML(unlocked.name)}
                    ${unlocked.kappaRequired ? '<span class="kappa-badge">🟣 Kappa</span>' : ""}
                  </div>
                `).join("")
              : "<p>No unlocked quests found.</p>"
          }
        </div>
      </div>
    </div>
  `;
}

/* =========================
   OBJETS
========================= */

async function showItems(push = true) {
  currentSection = "items";
  if (push) pushHistory("items");
  setActiveNav("items");
  searchInput.style.display = "block";
  searchInput.value = "";
  content.innerHTML = "<p>Loading items...</p>";

  const cachedItems = loadFromCache("cachedItems");

  if (cachedItems) {
    allItems = cachedItems;
    displayItems(allItems);
    return;
  }

  const query = `
    {
      items {
        id
        name
        shortName
        description
        iconLink
        imageLink
        avg24hPrice
        weight
        width
        height
        category { name }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Items API error.</p>";
      return;
    }

    allItems = result.data.items;
    saveToCache("cachedItems", allItems);
    displayItems(allItems);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Error loading items.</p>";
  }
}

function displayItems(items, push = true) {
  if (push) pushHistory("items");
  setActiveNav("items");

  // On garde la liste filtrée en mémoire pour le "Load more"
  currentFilteredItems = items;
  itemsPage = 0;

  content.innerHTML = `
    <h2>Items <span id="items-count" style="font-size:14px; color:var(--muted)"></span></h2>
    <div id="items-list"></div>
    <div id="items-load-more"></div>
  `;

  renderItemsPage();
}

function renderItemsPage() {
  const start = 0;
  const end = (itemsPage + 1) * ITEMS_PER_PAGE;
  const visible = currentFilteredItems.slice(start, end);
  const total = currentFilteredItems.length;

  // Compteur
  const counter = document.getElementById("items-count");
  if (counter) counter.textContent = `(${Math.min(end, total)} / ${total})`;

  // Rendu des cartes
  const list = document.getElementById("items-list");
  if (!list) return;
  list.innerHTML = "";

  visible.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => displayItemDetails(item);

    card.innerHTML = `
      <div class="item-card">
        <img src="${escapeHTML(item.iconLink)}" alt="${escapeHTML(item.name)}" loading="lazy">
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.category?.name) || "Unknown"}</p>
          <p>${item.avg24hPrice ? item.avg24hPrice.toLocaleString("fr-FR") + " ₽" : "Unavailable"}</p>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  // Bouton "Load more"
  const loadMore = document.getElementById("items-load-more");
  if (!loadMore) return;

  if (end < total) {
    loadMore.innerHTML = `
      <button class="load-more-btn" onclick="loadMoreItems()">
        Load more (${total - end} remaining)
      </button>
    `;
  } else {
    loadMore.innerHTML = `
      <p style="text-align:center; color:var(--muted); padding: 16px 0;">
        All items displayed (${total})
      </p>
    `;
  }
}

function loadMoreItems() {
  itemsPage++;
  renderItemsPage();
  // Scroll doux vers les nouvelles cartes
  const list = document.getElementById("items-list");
  if (list) {
    const lastCard = list.lastElementChild;
    if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function displayItemDetails(item, push = true) {
  if (push) pushHistory("item-detail", { id: item.id });
  setActiveNav("items");
  content.innerHTML = `
    <button class="back-btn" onclick="displayItems(allItems)">
      ← Back
    </button>

    <div class="quest-detail">
      <h2>${escapeHTML(item.name)}</h2>

      <button
        class="favorite-btn"
        onclick='addFavorite("item", { id: "${escapeHTML(item.id)}", name: "${escapeHTML(item.name)}" })'
      >
        ${isFavorite(item.id) ? "⭐ Remove from favorites" : "☆ Add to favorites"}
      </button>

      <div class="detail-box item-detail-header">
        <img src="${escapeHTML(item.imageLink || item.iconLink)}" alt="${escapeHTML(item.name)}" loading="lazy">
        <div>
          <p><strong>Short name:</strong> ${escapeHTML(item.shortName) || "N/A"}</p>
          <p><strong>Category:</strong> ${escapeHTML(item.category?.name) || "Unknown"}</p>
          <p><strong>Average price:</strong> ${item.avg24hPrice || 0}₽</p>
        </div>
      </div>

      <div class="detail-box">
        <h3>Information</h3>
        <p><strong>Weight:</strong> ${item.weight || 0} kg</p>
        <p><strong>Size:</strong> ${item.width || "?"} x ${item.height || "?"}</p>
      </div>

      <div class="detail-box">
        <h3>Description</h3>
        <p>${escapeHTML(item.description) || "No description"}</p>
      </div>
    </div>
  `;
}

/* =========================
   MAPS
========================= */

function showMaps(push = true) {
  currentSection = "maps";
  if (push) pushHistory("maps");
  setActiveNav("maps");
  searchInput.style.display = "none";
  searchInput.value = "";

  content.innerHTML = "<h2>Maps</h2>";

  mapsData.forEach(map => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openMap(map);

    card.innerHTML = `
      <div class="map-preview">
        <img src="${escapeHTML(map.image)}" alt="${escapeHTML(map.name)}" loading="lazy">
      </div>
      <h3>${escapeHTML(map.name)}</h3>
      <p><strong>Difficulty:</strong> ${escapeHTML(map.difficulty)}</p>
      <p><strong>Boss:</strong> ${escapeHTML(map.boss)}</p>
    `;

    content.appendChild(card);
  });
}

function openMap(map, push = true) {
  currentSection = "map-detail";
  if (push) pushHistory("map-detail", { name: map.name });
  setActiveNav("maps");
  searchInput.style.display = "none";

  content.innerHTML = `
    <button class="back-btn" onclick="showMaps()">
      ← Back
    </button>

    <div class="quest-detail">
      <h2>${escapeHTML(map.name)}</h2>

${map.interactiveVariants ? `
  <div style="display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap">
    ${map.interactiveVariants.map(v => `
      <button class="mapgenie-btn" style="flex:1"
        onclick="openInteractiveMap('${escapeHTML(map.name)}', '${v.path}', '${v.markers}')">
        ${v.label}
      </button>
    `).join("")}
  </div>
` : map.interactive ? `
  <button class="mapgenie-btn" onclick="openInteractiveMap('${escapeHTML(map.name)}', '${escapeHTML(map.interactive)}')">
    🗺 Interactive Map
  </button>
` : map.mapgenie ? `
  <a href="${escapeHTML(map.mapgenie)}"
    target="_blank"
    rel="noopener noreferrer"
    class="mapgenie-btn"
  >
    🗺 View interactive map on Mapgenie
  </a>
` : ""}

      ${map.image ? `
        <div class="map-image-container" onclick="toggleMapZoom(this)">
          <img
            src="${escapeHTML(map.image)}"
            alt="Preview ${escapeHTML(map.name)}"
            loading="lazy"
            class="map-full-img"
          >
          <span class="map-zoom-hint">🔍 Tap to zoom</span>
        </div>
      ` : ""}

      <div class="detail-box">
        <p><strong>Difficulty:</strong> ${escapeHTML(map.difficulty)}</p>
        <p><strong>Boss:</strong> ${escapeHTML(map.boss)}</p>
        <p><strong>Notes:</strong> ${escapeHTML(map.use)}</p>
      </div>

      <div class="detail-box">
        <h3>Main Extracts</h3>
        ${map.extracts.map(extract => `
          <div class="objective">${escapeHTML(extract)}</div>
        `).join("")}
      </div>
    </div>
  `;
}

function openInteractiveMap(mapName, imagePath, markerSet = null) {
  currentSection = "map-detail";
  setActiveNav("maps");
  searchInput.style.display = "none";

  // Conteneur de la map
  content.innerHTML = `
    <button class="back-btn" onclick="openMap(mapsData.find(m => m.name === '${escapeHTML(mapName)}'), false)">
      ← Back
    </button>
    <h2>${escapeHTML(mapName)} — Interactive Map</h2>

    <div class="filter-bar" id="mapFilterBar">
      <button class="map-filter-btn active" data-layer="extractions" onclick="toggleMapLayer('extractions', this)">🟢 Extractions</button>
      <button class="map-filter-btn active" data-layer="boss" onclick="toggleMapLayer('boss', this)">🔴 Boss</button>
      <button class="map-filter-btn active" data-layer="quests" onclick="toggleMapLayer('quests', this)">🟣 Quests</button>
      <button class="map-filter-btn active" data-layer="loot" onclick="toggleMapLayer('loot', this)">🟡 Loot</button>
      <button class="map-filter-btn active" data-layer="goons" onclick="toggleMapLayer('goons', this)">🟠 Goons</button>
      <button class="map-filter-btn active" data-layer="spawn" onclick="toggleMapLayer('spawn', this)">⚫ Spawn</button>
      <button class="map-filter-btn active" data-layer="extractions_scav" onclick="toggleMapLayer('extractions_scav', this)"> 🟢 Scav Extractions</button>
      <button class="map-filter-btn active" data-layer="extractions_coop" onclick="toggleMapLayer('extractions_coop', this)"> 🔵 Co-Op Extractions</button>
      <button class="map-filter-btn active" data-layer="transit" onclick="toggleMapLayer('transit', this)"> 🟨 Transit Points</button>
    </div>

    <div id="leaflet-map" style="width:100%; height:70vh; border-radius:12px; overflow:hidden; margin-top:8px;"></div>
  `;

  // Initialise Leaflet après que le DOM est prêt
  setTimeout(() => initLeafletMap(mapName, imagePath, markerSet), 50);
}

// Stockage global de la map Leaflet et de ses layers
let leafletMap = null;
let mapLayers = {};

function initLeafletMap(mapName, imagePath, markerSet = null) {
  // Nettoie une ancienne instance si elle existe
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  const img = new Image();
  img.src = imagePath;
  img.onload = () => {
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    // Bounds de l'image en coordonnées "pixel"
    const bounds = [[0, 0], [H, W]];

    leafletMap = L.map("leaflet-map", {
      crs: L.CRS.Simple,       // Pas de projection géographique, juste des pixels
      minZoom: -2,
      maxZoom: 2,
      zoomSnap: 0.5,
    });

    // L'image comme fond de carte
    L.imageOverlay(imagePath, bounds).addTo(leafletMap);
    leafletMap.fitBounds(bounds);

    // MODE ÉDITION — affiche les coordonnées au clic
    leafletMap.on('click', function(e) {
    console.log(`lat: ${Math.round(e.latlng.lat)}, lng: ${Math.round(e.latlng.lng)}`);
    });

    // Charge les marqueurs de cette map
    loadMapMarkers(mapName, markerSet);
  };
}

function loadMapMarkers(mapName, markersKey = null) {
  const markersMap = {
    "Woods": woodsMarkers,
    "Customs": customsMarkers,
    "Factory": factoryMarkers,
    "Shoreline": shorelineMarkers,
    "ShorelineSanatorium": shorelineSanatoriumMarkers,
  };

  const allMarkersRef = {
    "shorelineMarkers": shorelineMarkers,
    "shorelineSanatoriumMarkers": shorelineSanatoriumMarkers,
    "woodsMarkers": woodsMarkers,
    "customsMarkers": customsMarkers,
    "factoryMarkers": factoryMarkers,
  }

  mapLayers = {}; // Réinitialise les layers

  const markers = markersKey
    ? (allMarkersRef[markersKey] || [])
    : (markersMap[mapName] || []);

  markers.forEach(m => {
    if (!mapLayers[m.type]) mapLayers[m.type] = [];

    // Icône colorée selon le type
    const icon = L.divIcon({
      className: "",
      html: `<div class="map-marker map-marker-${m.type}">${m.icon}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([m.lat, m.lng], { icon });

    // Popup avec infos — liaison automatique avec les quêtes si questId
    let popupContent = `<b>${m.name}</b>`;
    if (m.info) popupContent += `<br>${m.info}`;
    if (m.questId) {
      const quest = allTasks.find(t => t.id === m.questId);
      if (quest) {
        const done = completedTasks.includes(quest.id);
        popupContent += `<br><span style="color:${done ? '#27ae60' : '#a569bd'}">${done ? "✔" : "🟣"} ${quest.name}</span>`;
      }
    }

    marker.bindPopup(popupContent);
    marker.addTo(leafletMap);
    mapLayers[m.type].push(marker);
  });
}

function toggleMapLayer(type, btn) {
  btn.classList.toggle("active");
  const layers = mapLayers[type] || [];
  layers.forEach(marker => {
    if (leafletMap.hasLayer(marker)) {
      leafletMap.removeLayer(marker);
    } else {
      leafletMap.addLayer(marker);
    }
  });
}

/* =========================
   DONNÉES MARQUEURS — WOODS
   lat/lng = coordonnées en pixels sur l'image
   (à affiner en cliquant sur la map)
========================= */

const woodsMarkers = [
  // EXTRACTIONS
  { type: "extractions", icon: "E", name: "Outskirts",     info: "Main west extraction", lat: 75, lng: 174},
  { type: "extractions", icon: "E", name: "UN Roadblock",  info: "North extraction",     lat: 121,  lng: 742 },
  { type: "extractions", icon: "E", name: "ZB-014",        info: "Requires key ZB-014",  lat: 265, lng: 110 },
  { type: "extractions", icon: "E", name: "RUAF Gate",     info: "South extraction",     lat: 38, lng: 484 },
  { type: "extractions", icon: "E", name: "ZB-016",        info: "When green flares are present, extraction is available", lat: 293, lng: 647 },
  { type: "extractions", icon: "E", name: "Northern UN Roadblock",        info: "Always Open",  lat: 351, lng: 752 },
  { type: "extractions", icon: "E", name: "Vridge V EX",       info: "The black SUV must be present for extraction / 5,000 Roubles each (influenced by Scav Karma)", lat: 631, lng: 708 },
  { type: "extractions", icon: "E", name: "Power Line Passage",       info: "Requirements: Green Flare Extract - Make sure to be in the Flare firing area. After firing the flare keep running until the timer appears - it  will take a bit of running before you see it", lat: 343, lng: 83 },

  // EXTRACTION SCAV
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Scav House", lat: 151, lng: 130 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Dead man's Place", lat: 143, lng: 281 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "The Boat", lat: 166, lng: 284 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Scav Bunker", lat: 758, lng: 248 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Scav Bridge", lat: 848, lng: 333 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Mountain Stash", lat: 441, lng: 528 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Eastern Stash", lat: 329, lng: 729 },
  { type: "extractions_scav", icon: "ES", name: "Scav Extraction", info: "Old Railway Depot", lat: 212, lng: 736 },

  // EXTRACTIONS CO-OP
  { type: "extractions_coop", icon: "EC", name: "Factory Gate", info: "Requirements: Scav + PMC ", lat: 71, lng: 629 },
  { type: "extractions_coop", icon: "EC", name: "Friendship Bridge", info: "Requirements: Scav + PMC ", lat: 842, lng: 327 },

  // BOSS
  { type: "boss", icon: "S", name: "Shturman", info: "Boss —  patrols sawmill area", lat: 335, lng: 370 },
  { type: "boss", icon: "S", name: "Shturman", info: "Boss — patrols sawmill area", lat: 249, lng: 313 },
  { type: "boss", icon: "S", name: "Shturman", info: "Boss — patrols sawmill area", lat: 393, lng: 351 },

  // Goons
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 634, lng: 217 },
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 762, lng: 253 },
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 780, lng: 310 },
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 759, lng: 446 },

  // PMC spawn
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 758, lng: 157 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 683, lng: 166 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 590, lng: 137 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 509, lng: 248 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 354, lng: 145 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 290, lng: 122 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 179, lng: 110 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 135, lng: 59 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 128, lng: 115 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 93, lng: 76 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 93, lng: 157 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 108, lng: 229 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 187, lng: 249 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 726, lng: 357 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 668, lng: 347 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 411, lng: 299 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 668, lng: 437 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 718, lng: 566 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 569, lng: 574 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 640, lng: 671 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 517, lng: 793 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 436, lng: 560 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 391, lng: 612 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 401, lng: 727 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 338, lng: 707 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 309, lng: 730 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 292, lng: 733 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 165, lng: 737 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 152, lng: 627 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 256, lng: 732 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 112, lng: 745 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 84, lng: 584 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 65, lng: 456 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit", info: "Transit To Lighthouse", lat: 79, lng: 79 },
  { type: "transit", icon: "T", name: "Transit", info: "Transit To Reserve", lat: 73, lng: 239 },
  { type: "transit", icon: "T", name: "Transit", info: "Transit To Customs", lat: 39, lng: 489 },
  { type: "transit", icon: "T", name: "Transit", info: "Transit To Factory", lat: 77, lng: 628 },

  // Quests
  { type: "quests", icon: "Q", name: "Introduction", info: "Jeager's Message - Underneath the wooden lookout post.", lat: 299, lng: 560 , questId: "5d2495a886f77425cd51e403"},
  { type: "quests", icon: "Q", name: "Thrifty Stash - ZB-014", info: "Stash an Iskra lunch box & 0.6L water bottle in the broken crate beside the wooden crate in the ZB-014 bunker", lat: 261, lng: 114 , questId: "5d25b6be86f77444001e1b89"},
  { type: "quests", icon: "Q", name: "Thrifty Stash - ZB-016", info: "Stash an Iskra lunch box & 0.6L water bottle in the broken crate beside the wooden crate in the ZB-016 bunker", lat: 291, lng: 651 , questId: "5d25b6be86f77444001e1b89"},
  { type: "quests", icon: "Q", name: "Steady Signal - Weather Station 1", info: "Mark First Weather Station", lat: 715, lng: 143 , questId: "6578ec473dbd035d04531a8d"},
  { type: "quests", icon: "Q", name: "Steady Signal - Weather Station 2", info: "Mark Second Weather Station", lat: 488, lng: 528 , questId: "6578ec473dbd035d04531a8d"},
  { type: "quests", icon: "Q", name: "Steady Signal - Weather Station 3", info: "Mark Third Weather Station", lat: 658, lng: 458 , questId: "6578ec473dbd035d04531a8d"},
  { type: "quests", icon: "Q", name: "Steady Signal - Weather Station 4", info: "Mark Fourth Weather Station", lat: 96, lng: 238 , questId: "6578ec473dbd035d04531a8d"},
  { type: "quests", icon: "Q", name: "Steady Signal - Weather Station 5", info: "Mark Fifth Weather Station", lat: 142, lng: 699 , questId: "6578ec473dbd035d04531a8d"},
  { type: "quests", icon: "Q", name: "Supply Plan", info: "Underneath bed in cabin #3", lat: 357, lng: 400 , questId: "596a0e1686f7741ddf17dbee"},
  { type: "quests", icon: "Q", name: "Search Mission", info: "USEC Temporary Camp", lat: 600, lng: 210 , questId: "5fd9fad9c1ce6b1a3b486d00"},
  { type: "quests", icon: "Q", name: "Search Mission", info: "Prapor's Convoy", lat: 692, lng: 270 , questId: "5fd9fad9c1ce6b1a3b486d00"},
  { type: "quests", icon: "Q", name: "Gratitude", info: "Beside the barrels on the wooden jetty", lat: 241, lng: 382 , questId: "5ae449b386f77446d8741719"},
  { type: "quests", icon: "Q", name: "A Helping Hand", info: "Location: It can be found in 1 of 2 locations in the northwest building of the train depot. The depot can only be accessed via the BTR Driver's taxi service    First spawn under the table next to the bed. Second spawn on the desk in the back office", lat: 221, lng: 791 , questId: "6752f6d83038f7df520c83e8"},
  { type: "quests", icon: "Q", name: "Health Care Privacity - Part 3", info: "Look for the blood on the right sliding door of the crashed car.", lat: 163, lng: 457 , questId: "5a68665c86f774255929b4c7"},
  { type: "quests", icon: "Q", name: "Hunting Trip", info: "Eliminate Shturman with a headshot from over 75 meters away while using an M700 Sniper rifle with the Burris FullField TAC30 1-4x24 30mm riflescope.", lat: 329, lng: 373 , questId: "5d25e4ca86f77409dd5cdf2c"},
  { type: "quests", icon: "Q", name: "The Blood Of War - Part 3", info: "Requirements: MS2000 Marker. Oil Barrels #1", lat: 363, lng: 168 , questId: "5c10f94386f774227172c572"},
  { type: "quests", icon: "Q", name: "The Blood Of War - Part 3", info: "Requirements: MS2000 Marker. Oil Barrels #2", lat: 291, lng: 606 , questId: "5c10f94386f774227172c572"},
  { type: "quests", icon: "Q", name: "The Blood Of War - Part 3", info: "Requirements: MS2000 Marker. Oil Barrels #3", lat: 440, lng: 533 , questId: "5c10f94386f774227172c572"},
  { type: "quests", icon: "Q", name: "The Huntsman Path - Woods Keeper", info: "Locate, Kill Shturman and extract with the key", lat: 321, lng: 362 , questId: "5d25e2ee86f77443e35162ea"},
];

/* =========================
   DONNÉES MARQUEURS — CUSTOMS
   lat/lng = coordonnées en pixels sur l'image
   (à affiner en cliquant sur la map)
========================= */

const customsMarkers = [
  // EXTRACTIONS
  { type: "extractions", icon: "E", name: "ZB10-11", info: "Main extraction, always open", lat: 527, lng: 56 },
  { type: "extractions", icon: "E", name: "Old Gas Station", info: "When green flares are present, extraction is available.", lat: 581, lng: 382 },
  { type: "extractions", icon: "E", name: "ZB10-13", info: "Activate Lever in Warehouse 4. Factory Exit Key to unlock ZB10-13 Gate (Factory)", lat: 645, lng: 644 },
  { type: "extractions", icon: "E", name: "Railroad Passage Extract", info: "Flare gun with Green cartridge", lat: 679, lng: 525 },
  { type: "extractions", icon: "E", name: "Trailer Park", info: "Main extraction, always open", lat: 629, lng: 1033 },
  { type: "extractions", icon: "E", name: "Crossroads", info: "Main extraction, always open", lat: 492, lng: 1044 },
  { type: "extractions", icon: "E", name: "Smuggler's Boat", info: "Campfire must be lit for extraction. Requires Note with code word Voron", lat: 260, lng: 736 },
  { type: "extractions", icon: "E", name: "Dorm V-EX", info: "The black SUV must be present for extraction. 5000 Rubles per player. Max 4 players.", lat: 172, lng: 518 },
  { type: "extractions", icon: "E", name: "Smuggler's Bunker", info: "Need (Note with Codeword Voron)", lat: 511, lng: 122 },

  // EXTRACTIONS CO-OP
  { type: "extractions_coop", icon: "EC", name: "Boiler Room Extract", info: "Requirements: Scav + PMC ", lat: 455, lng: 497 },

  // EXTRACTIONS SCAV
  { type: "extractions_scav", icon: "ES", name: "Factory Far Corner", info: "Always available", lat: 560, lng: 38 },
  { type: "extractions_scav", icon: "ES", name: "Old Gas Station Gate", info: "Always available", lat: 596, lng: 390 },
  { type: "extractions_scav", icon: "ES", name: "Warehouse 4", info: "Always available", lat: 419, lng: 356 },
  { type: "extractions_scav", icon: "ES", name: "Factory Shacks", info: "Always available", lat: 379, lng: 491 },
  { type: "extractions_scav", icon: "ES", name: "Warehouse 17", info: "Always available", lat: 464, lng: 653 },
  { type: "extractions_scav", icon: "ES", name: "Railroad To Tarkov", info: "Always available", lat: 615, lng: 873 },
  { type: "extractions_scav", icon: "ES", name: "Trailer Park Workers' Shake", info: "Always available", lat: 630, lng: 957 },
  { type: "extractions_scav", icon: "ES", name: "Railroad To Port", info: "Always available", lat: 343, lng: 850 },
  { type: "extractions_scav", icon: "ES", name: "Sniper RoadBlock", info: "Always available", lat: 263, lng: 691 },
  { type: "extractions_scav", icon: "ES", name: "Old Roadgate", info: "Always available", lat: 174, lng: 510 },
  { type: "extractions_scav", icon: "ES", name: "Railroad To Military Base", info: "Always available", lat: 165, lng: 201 },
  { type: "extractions_scav", icon: "ES", name: "Passage Between Rocks", info: "Always available", lat: 188, lng: 151 },
  { type: "extractions_scav", icon: "ES", name: "Military Base CP", info: "Always available", lat: 264, lng: 45 },
  { type: "extractions_scav", icon: "ES", name: "Scav Checkpoint", info: "Always available", lat: 418, lng: 37 },
  { type: "extractions_scav", icon: "ES", name: "Administration Gate", info: "Always available", lat: 444, lng: 20 },

  // BOSS
  { type: "boss", icon: "S", name: "Reshala", info: "Boss —  patrols sawmill area", lat: 240, lng: 495 },
  { type: "boss", icon: "S", name: "Reshala", info: "Boss —  patrols sawmill area", lat: 363, lng: 293 },
  { type: "boss", icon: "S", name: "Reshala", info: "Boss —  patrols sawmill area", lat: 534, lng: 493 },

  // Goons
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 511, lng: 501 },
  { type: "goons", icon: "G", name: "The Goons", info: "Spawn aléatoire - zone nord", lat: 515, lng: 630 },

  // PMC spawn
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 225, lng: 325 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 183, lng: 284 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 217, lng: 167 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 252, lng: 103 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 344, lng: 147 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 351, lng: 32 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 495, lng: 72 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 509, lng: 117 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 460, lng: 191 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 504, lng: 213 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 480, lng: 222 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 626, lng: 1037 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 478, lng: 1028 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 400, lng: 924 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 283, lng: 709 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 532, lng: 191 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 491, lng: 316 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 461, lng: 378 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 597, lng: 406 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 522, lng: 638 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 521, lng: 698 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 616, lng: 841 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 527, lng: 858 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 513, lng: 891 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 528, lng: 914 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 617, lng: 921 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 480, lng: 946 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 439, lng: 868 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 355, lng: 838 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 535, lng: 977 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 515, lng: 322 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 447, lng: 120 },

  // Quests
  { type: "quests", icon: "Q", name: "BP Depot", info: "Fuel Tank #1", lat: 375, lng: 264 , questId: "59c124d686f774189b3c843f"},
  { type: "quests", icon: "Q", name: "BP Depot", info: "Fuel Tank #2", lat: 407, lng: 601 , questId: "59c124d686f774189b3c843f"},
  { type: "quests", icon: "Q", name: "BP Depot", info: "Fuel Tank #3", lat: 585, lng: 361 , questId: "59c124d686f774189b3c843f"},
  { type: "quests", icon: "Q", name: "BP Depot", info: "Fuel Tank #4", lat: 558, lng: 1046 , questId: "59c124d686f774189b3c843f"},
  { type: "quests", icon: "Q", name: "Work Smarter", info: "Optional to get the hint but you have to find it randomly somewhere on the map 100% spawn but not necessary. Green Smoke and searchlight has to be on to use the extract", lat: 511, lng: 222 , questId: "675c1cf4a757ddd00404f0a3"},
  { type: "quests", icon: "Q", name: "Background Check", info: "Inside the truck. Requires the Machinery Key to unlock the truck door", lat: 399, lng: 598 , questId: "5936da9e86f7742d65037edf"},
  { type: "quests", icon: "Q", name: "Rite Of Passage", info: "Eliminate 10 Scavs at the old gas station on Customs", lat: 570, lng: 366 , questId: "675c1ec7a46173572a0bf20a"},
  { type: "quests", icon: "Q", name: "Rite Of Passage", info: "Eliminate 10 Scavs at the new gas station on Customs", lat: 353, lng: 293 , questId: "675c1ec7a46173572a0bf20a"},
  { type: "quests", icon: "Q", name: "Belka and Strelka", info: "Survive and extract from Customs through Railroad Passage", lat: 672, lng: 519 , questId: "675c3507a06634b5110e3c18"},
  { type: "quests", icon: "Q", name: "Operation Aquarius - Part 1", info: "(Dorm Room 206 key required)", lat: 80, lng: 316 , questId: "59689fbd86f7740d137ebfc4"},
  { type: "quests", icon: "Q", name: "The Extortionist", info: "You'll find the Unknown Key on the body in the bushes. / 443 327. Inside the Unknown Cabin - requires the Unknown Key to unlock.", lat: 507, lng: 675 , questId: "596b43fb86f77457ca186186"},
  { type: "quests", icon: "Q", name: "Golden Swag", info: "Find the Golden Zibbo lighter (303 key required)", lat: 94, lng: 485 , questId: "5979eee086f774311955e614"},
  { type: "quests", icon: "Q", name: "Golden Swag", info: "Stash the Golden Zibbo lighter in the bunkhouse in the trailer parking lot on Customs (Requires the Trailer Park Cabin Key.)", lat: 603, lng: 901 , questId: "5979eee086f774311955e614"},
  { type: "quests", icon: "Q", name: "Pharmacist", info: "Dorm Room 114 Key is in a jacket in the trunk of the blue car.", lat: 395, lng: 111 , questId: "5969f9e986f7741dde183a50"},
  { type: "quests", icon: "Q", name: "Pharmacist", info: "Location: Dorm Room 114 - on top of the safe.", lat: 34, lng: 372 , questId: "5969f9e986f7741dde183a50"},
  { type: "quests", icon: "Q", name: "Chemical - Part 1", info: "Find Secure Case For Documents 0013. Location is randomized, inside the train car", lat: 534, lng: 201 , questId: "5979f9ba86f7740f6c3fe9f2"},
  { type: "quests", icon: "Q", name: "Chemical - Part 2", info: "Find Sealed letter with a TG logo and Sliderkey Secure Flash Drive. (Dorm room 220 key required)", lat: 42, lng: 547 , questId: "5979f9ba86f7740f6c3fe9f2"},
  { type: "quests", icon: "Q", name: "Tigr Safari", info: "Mark the vehicle with an MS2000 Marker #1", lat: 392, lng: 686 , questId: "5a27b7a786f774579c3eb376"},
  { type: "quests", icon: "Q", name: "Tigr Safari", info: "Mark the vehicle with an MS2000 Marker #2", lat: 403, lng: 187 , questId: "5a27b7a786f774579c3eb376"},
  { type: "quests", icon: "Q", name: "Tigr Safari", info: "Mark the vehicle with an MS2000 Marker #3", lat: 417, lng: 119 , questId: "5a27b7a786f774579c3eb376"},
  { type: "quests", icon: "Q", name: "Chemical - Part 4", info: "Locate the transport with the chemicals on Customs and mark the vehicle with an MS2000 Marker", lat: 469, lng: 213 , questId: "597a0f5686f774273b74f676"},
  { type: "quests", icon: "Q", name: "Out of Curiosity", info: "Locate the transport with the chemicals on Customs and mark the vehicle with an MS2000 Marker", lat: 466, lng: 213 , questId: "597a160786f77477531d39d2"},
  { type: "quests", icon: "Q", name: "Big Customer", info: "Locate the transport with the chemicals on Customs and mark the vehicle with an MS2000 Marker", lat: 473, lng: 212 , questId: "597a171586f77405ba6887d3"},
  { type: "quests", icon: "Q", name: "Passion for Ergonomics", info: "Locate and obtain the customized tool set at the garage complex on Customs", lat: 573, lng: 1027 , questId: "675c1570526ff496850895d9"},
  { type: "quests", icon: "Q", name: "Farming - Part 3", info: "Inside the Customs Office behind the printer next to the metal shelves (or next to the desk)(Tarcone Director's office key required)", lat: 494, lng: 911 , questId: "5ac3462b86f7741d6118b983"},
  { type: "quests", icon: "Q", name: "Shaking Up the Teller", info: "Under the bed in Dorm Room 203 (Dorm room 203 key required)", lat: 93, lng: 566 , questId: "5967725e86f774601a446662"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the first special TerraGroup cargo with an MS2000 Marker on Customs", lat: 530, lng: 896 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the second special TerraGroup cargo with an MS2000 Marker on Customs", lat: 443, lng: 587 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the third special TerraGroup cargo with an MS2000 Marker on Customs", lat: 458, lng: 637 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the fourth special TerraGroup cargo with an MS2000 Marker on Customs", lat: 460, lng: 601 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the fifth special TerraGroup cargo with an MS2000 Marker on Customs", lat: 466, lng: 554 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the sixth special TerraGroup cargo with an MS2000 Marker on Customs", lat: 451, lng: 640 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Abandoned Cargo", info: "Locate and mark the seventh special TerraGroup cargo with an MS2000 Marker on Customs", lat: 436, lng: 642 , questId: "675c03d1f7da9792a405549a"},
  { type: "quests", icon: "Q", name: "Shipment Tracking", info: "Locate and obtain the TerraGroup shipment lists on Customs. Hand over the found information", lat: 856, lng: 608 , questId: "675c047fa46173572a0bd878"},
  { type: "quests", icon: "Q", name: "Closer to the People", info: "Locate and obtain the delivery crew's shipment notes on Customs. Hand over the found information", lat: 444, lng: 611 , questId: "675c04f4db8807b75d0f38e8"},
  { type: "quests", icon: "Q", name: "Break the Deal", info: "Stash a DVL-10 sniper rifle, Stash a DVL-10 magazine, Stash an ELCAN SpecterDR scope, Stash a pack of any 7.62x51 ammo at the specified spot on customs.", lat: 410, lng: 446 , questId: "675c085d59b0575973005f52"},
  { type: "quests", icon: "Q", name: "Private Club", info: "Locate and obtain Skier's wallet on Customs", lat: 781, lng: 655 , questId: "675c3582f6ddc329a90f9c6d"},
];

/* =========================
   DONNÉES MARQUEURS — FACTORY
   lat/lng = coordonnées en pixels sur l'image
   (à affiner en cliquant sur la map)
========================= */

const factoryMarkers = [
  // EXTRACTIONS
  { type: "extractions", icon: "E", name: "Med Tent Gates", info: "Factory Key Required", lat: 377, lng: 381 },
  { type: "extractions", icon: "E", name: "Cellars", info: "Factory Key Required", lat: 282, lng: 235 },
  { type: "extractions", icon: "E", name: "Gate 3", info: "Always open", lat: 545, lng: 117 },
  { type: "extractions", icon: "E", name: "Gate 0", info: "Always open", lat: 277, lng: 136 },
  { type: "extractions", icon: "E", name: "Courtyard Gate", info: "Always open", lat: 467, lng: 118 },
  { type: "extractions", icon: "E", name: "Smuggler's Passage Extraction", info: "Code Required", lat: 223, lng: 326 },

  // SCAV EXTRACTIONS
  { type: "extractions_scav", icon: "ES", name: "Camera Bunker Door", info: "Always open", lat: 82, lng: 168 },
  { type: "extractions_scav", icon: "ES", name: "Gate 3", info: "Always open", lat: 540, lng: 117 },
  { type: "extractions_scav", icon: "ES", name: "Smuggler's Passage Extraction", info: "Code Required", lat: 223, lng: 330 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Customs", info: "Open 1 min after game start", lat: 459, lng: 376 },
  { type: "transit", icon: "T", name: "Transit To Lab", info: "Open 1 min after game start. Lab Carte Required", lat: 54, lng: 352 },
  { type: "transit", icon: "T", name: "Transit To Woods", info: "Open 1 min after game start", lat: 473, lng: 126 },

  // BOSS
  { type: "boss", icon: "S", name: "Tagilla", info: "Boss — patrols factory area", lat: 546, lng: 145 },
  { type: "boss", icon: "S", name: "Tagilla", info: "Boss — patrols factory area", lat: 519, lng: 217 },
  { type: "boss", icon: "S", name: "Tagilla", info: "Boss — patrols factory area", lat: 405, lng: 137 },
  { type: "boss", icon: "S", name: "Tagilla", info: "Boss — patrols factory area", lat: 426, lng: 207 },
  { type: "boss", icon: "S", name: "Tagilla", info: "Boss — patrols factory area", lat: 425, lng: 306 },

  // SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 65, lng: 169 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 112, lng: 300 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 161, lng: 258 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 243, lng: 247 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 320, lng: 153 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 306, lng: 133 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 368, lng: 114 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 447, lng: 132 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 494, lng: 178 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 451, lng: 159 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 483, lng: 212 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 543, lng: 206 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 569, lng: 276 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 507, lng: 285 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 572, lng: 285 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 516, lng: 347 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 377, lng: 356 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 397, lng: 332 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 396, lng: 289 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 354, lng: 242 },

  // Quests
  { type: "quests", icon: "Q", name: "Claustrophobia", info: "Eliminate any 5 targets in the old cellars while using a shotgun on Factory", lat: 99, lng: 313 , questId: "669fa3979b0ce3feae01a130"},
  { type: "quests", icon: "Q", name: "Postman Pat - Part 1", info: "Obtain the letter on the messenger's body on Factory and extract", lat: 371, lng: 211 , questId: "59675ea386f77414b32bded2"},
  { type: "quests", icon: "Q", name: "Possessor", info: "Grab the logbook from the helicopter cockpit up in the rafters.", lat: 808, lng: 266 , questId: "669fa399033a3ce9870338a8"},
  { type: "quests", icon: "Q", name: "Chemical - Part 3", info: "Obtain the chemical-filled syringe hidden in Factory. Can spawn anywhere in the room (e.g. in the filing cabinet)", lat: 805, lng: 174 , questId: "597a0e5786f77426d66c0636"},
  { type: "quests", icon: "Q", name: "Farming - Part 1", info: "Fix the first control board with a Toolset on Factory", lat: 565, lng: 276 , questId: "5ac345dc86f774288030817f"},
  { type: "quests", icon: "Q", name: "Farming - Part 1", info: "Fix the second control board with a Toolset on Factory", lat: 549, lng: 371 , questId: "5ac345dc86f774288030817f"},
  { type: "quests", icon: "Q", name: "Scout", info: "Locate the first Factory extraction", lat: 255, lng: 324 , questId: "5ac3477486f7741d651d6885"},
  { type: "quests", icon: "Q", name: "Scout", info: "Locate the second Factory extraction", lat: 314, lng: 136 , questId: "5ac3477486f7741d651d6885"},
  { type: "quests", icon: "Q", name: "Scout", info: "Locate the third Factory extraction", lat: 542, lng: 124 , questId: "5ac3477486f7741d651d6885"},
  { type: "quests", icon: "Q", name: "Scout", info: "Locate the fourth Factory extraction", lat: 376, lng: 359 , questId: "5ac3477486f7741d651d6885"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the first forklift on Factory", lat: 555, lng: 209 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the second forklift on Factory", lat: 573, lng: 350 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the third forklift on Factory", lat: 559, lng: 365 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the fourth forklift on Factory", lat: 344, lng: 132 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the fifth forklift on Factory", lat: 465, lng: 312 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the sixth forklift on Factory", lat: 464, lng: 328 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the seventh forklift on Factory", lat: 442, lng: 193 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the eighth forklift on Factory", lat: 380, lng: 186 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the ninth forklift on Factory", lat: 446, lng: 326 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the tenth forklift on Factory", lat: 534, lng: 309 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the eleventh forklift on Factory", lat: 457, lng: 293 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Forklift Certified", info: "Locate the twelfth forklift on Factory", lat: 545, lng: 129 , questId: "669fa394e0c9f9fafa082897"},
  { type: "quests", icon: "Q", name: "Exit Here", info: "Survive and extract from Factory through the main exit", lat: 461, lng: 118 , questId: "669fa395c4c5c04798002497"},
  { type: "quests", icon: "Q", name: "Black Swan", info: "Locate and mark the first heat exchanger with an MS2000 Marker on Factory", lat: 76, lng: 182 , questId: "669fa395c4c5c04798002497"},
  { type: "quests", icon: "Q", name: "Black Swan", info: "Locate and mark the second heat exchanger with an MS2000 Marker on Factory", lat: 190, lng: 271 , questId: "669fa395c4c5c04798002497"},
  { type: "quests", icon: "Q", name: "Black Swan", info: "Locate and mark the third heat exchanger with an MS2000 Marker on Factory", lat: 222, lng: 339 , questId: "669fa395c4c5c04798002497"},
  { type: "quests", icon: "Q", name: "The Walls Have Eyes", info: "Install a WI-FI Camera in the first crane's cockpit on Factory", lat: 545, lng: 193 , questId: "669fa39c64ea11e84c0642a6"},
  { type: "quests", icon: "Q", name: "The Walls Have Eyes", info: "Install a WI-FI Camera in the second crane's cockpit on Factory", lat: 404, lng: 334 , questId: "669fa39c64ea11e84c0642a6"},
  { type: "quests", icon: "Q", name: "The Walls Have Eyes", info: "Install a WI-FI Camera in the third crane's cockpit on Factory", lat: 380, lng: 121 , questId: "669fa39c64ea11e84c0642a6"},
  { type: "quests", icon: "Q", name: "All is Revealed", info: "Take a sample of the chemicals from the damaged tank container on Factory and hand over the collected sample", lat: 405, lng: 220 , questId: "669fa39ee749756c920d02c8"},
  { type: "quests", icon: "Q", name: "Capacity Check", info: "Fix the first reactor mixer with a Toolset on Factory", lat: 458, lng: 245 , questId: "669fa3a1c26f13bd04030f37"},
  { type: "quests", icon: "Q", name: "Capacity Check", info: "Fix the second reactor mixer with a Toolset on Factory", lat: 432, lng: 245 , questId: "669fa3a1c26f13bd04030f37"},
  { type: "quests", icon: "Q", name: "Capacity Check", info: "Fix the third reactor mixer with a Toolset on Factory", lat: 405, lng: 245 , questId: "669fa3a1c26f13bd04030f37"},
  { type: "quests", icon: "Q", name: "Dragnet", info: "Locate and obtain the chemical container at the TerraGroup warehouse on Factory. Hand over the chemical container", lat: 68, lng: 156 , questId: "669fa3a08b4a64b332041ff7"},
  { type: "quests", icon: "Q", name: "Health Care Privacity - Part 6", info: "Locate the dead worker and take their blood sample on Factory. Hand over the blood sample", lat: 371, lng: 376 , questId: "669fa3a3ad7f1eac2607ed48"
  }
];

/* =========================
   DONNÉES MARQUEURS — SHORELINE
   lat/lng = coordonnées en pixels sur l'image
   (à affiner en cliquant sur la map)
========================= */

const shorelineMarkers = [
// EXTRACTIONS
{ type: "extractions", icon: "E", name: "Tunel", info: "Always open", lat: 335, lng: 210 },
{ type: "extractions", icon: "E", name: "Path To Lighthouse", info: "Always open", lat: 805, lng: 194 },
{ type: "extractions", icon: "E", name: "Climber's Trail", info: "Red Rebel, Paracord and no chest Armor required", lat: 904, lng: 694 },
{ type: "extractions", icon: "E", name: "Road To North V-EX", info: "The black SUV must be present for extraction. Max 4 Player", lat: 911, lng: 986 },
{ type: "extractions", icon: "E", name: "Mountain Bunker", info: "Code Required", lat: 917, lng: 850 },
{ type: "extractions", icon: "E", name: "Pier Boat", info: "Green flare = open", lat: 117, lng: 808 },
{ type: "extractions", icon: "E", name: "Railway Bridge", info: "Always open", lat: 334, lng: 1384 },
{ type: "extractions", icon: "E", name: "Road To Customs", info: "Always open", lat: 593, lng: 1238 },

// SCAV EXTRACTIONS
{ type: "extractions_scav", icon: "ES", name: "Ruined Road", info: "Always open", lat: 316, lng: 225 },
{ type: "extractions_scav", icon: "ES", name: "Lighthouse", info: "Always open", lat: 121, lng: 909 },
{ type: "extractions_scav", icon: "ES", name: "Road To Customs", info: "Always open", lat: 585, lng: 1238 },
{ type: "extractions_scav", icon: "ES", name: "Mountain Bunker", info: "Code Required", lat: 917, lng: 855 },

// EXTRACTION CO-OP
{ type: "extractions_coop", icon: "EC", name: "Smuggler's Path", info: "Always open", lat: 795, lng: 1103 },

// TRANSIT
{ type: "transit", icon: "T", name: "Transit To Lighthouse", info: "Always open", lat: 798, lng: 202 },
{ type: "transit", icon: "T", name: "Transit To Terminal", info: "Always open", lat: 282, lng: 1331 },
{ type: "transit", icon: "T", name: "Transit To Icebreaker", info: "Always open", lat: 133, lng: 776 },

// BOSS
{ type: "boss", icon: "S", name: "Sanitar", info: "Boss — patrols resort area", lat: 515, lng: 435 },
{ type: "boss", icon: "S", name: "Sanitar", info: "Boss — patrols resort area", lat: 665, lng: 688 },
{ type: "boss", icon: "S", name: "Sanitar", info: "Boss — patrols resort area", lat: 718, lng: 736 },
{ type: "boss", icon: "S", name: "Sanitar", info: "Boss — patrols resort area", lat: 660, lng: 786 },
{ type: "boss", icon: "S", name: "Sanitar", info: "Boss — patrols resort area", lat: 178, lng: 787 },

// GOONS
{ type: "goons", icon: "G", name: "Goons", info: "Patrol the resort area", lat: 378, lng: 939 },

// SPAWN
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 317, lng: 251 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 376, lng: 197 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 433, lng: 147 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 460, lng: 191 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 477, lng: 154 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 510, lng: 155 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 540, lng: 165 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 522, lng: 191 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 500, lng: 250 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 451, lng: 291 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 437, lng: 304 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 488, lng: 331 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 632, lng: 165 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 711, lng: 265 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 818, lng: 238 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 832, lng: 304 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 824, lng: 341 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 833, lng: 526 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 616, lng: 1130 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 558, lng: 1188 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 581, lng: 1264 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 496, lng: 1102 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 449, lng: 1014 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 459, lng: 1300 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 307, lng: 1227 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 209, lng: 1163 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 186, lng: 1099 },
{ type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 315, lng: 1064 },

// Quests
{ type: "quests", icon: "Q", name: "Fishing Gear", info: "locate the boat and stash the SV-98 and Leatherman Multitool", lat: 210, lng: 677 , questId: "5a27b75b86f7742e97191958"},
{ type: "quests", icon: "Q", name: "Scrap Metal", info: "Mark the first T-90 tank with an MS2000 marker", lat: 825, lng: 655 , questId: "5a27b7d686f77460d847e6a6"},
{ type: "quests", icon: "Q", name: "Scrap Metal", info: "Mark the second T-90 tank with an MS2000 marker", lat: 450, lng: 210 , questId: "5a27b7d686f77460d847e6a6"},
{ type: "quests", icon: "Q", name: "Scrap Metal", info: "Mark the third T-90 tank with an MS2000 marker", lat: 436, lng: 821 , questId: "5a27b7d686f77460d847e6a6"},
{ type: "quests", icon: "Q", name: "Eagle eye", info: "Locate the first UAV and extract with SAS disk", lat: 700, lng: 989 , questId: "5a27b80086f774429a5d7e20"},
{ type: "quests", icon: "Q", name: "Eagle eye", info: "Locate the second UAV and extract with SAS disk", lat: 732, lng: 454 , questId: "5a27b80086f774429a5d7e20"},
{ type: "quests", icon: "Q", name: "Humanitarian Supplies", info: "Locate and mark the first truck with an MS2000 Marker", lat: 732, lng: 720 , questId: "5a27b87686f77460de0252a8"},
{ type: "quests", icon: "Q", name: "Humanitarian Supplies", info: "Locate and mark the second truck with an MS2000 Marker", lat: 196, lng: 1033 , questId: "5a27b87686f77460de0252a8"},
{ type: "quests", icon: "Q", name: "Signal - Part 1", info: "Locate the first signal source on shorline", lat: 377, lng: 913 , questId: "5ac3467986f7741d6224abc2"},
{ type: "quests", icon: "Q", name: "Signal - Part 1", info: "Locate the second signal source on shorline", lat: 667, lng: 918 , questId: "5ac3467986f7741d6224abc2"},
{ type: "quests", icon: "Q", name: "The cult - Part 1", info: "Locate the missing informant on Shoreline. Survive and extract from the location", lat: 634, lng: 286 , questId: "5a27b9de86f77464e5044585"},
{ type: "quests", icon: "Q", name: "Spa Tour - Part 2", info: "Mark the helicopter with an MS2000 marker", lat: 638, lng: 734 , questId: "5a03173786f77451cb427172"},
{ type: "quests", icon: "Q", name: "Spa Tour - Part 2", info: "Mark the safe road with an MS2000 marker", lat: 633, lng: 754 , questId: "5a03173786f77451cb427172"},
{ type: "quests", icon: "Q", name: "Spa Tour - Part 5", info: "Obtain the key to the closed premises of the sanatorium and hover the key to peackeeper", lat: 845, lng: 652 , questId: "5a0449d586f77474e66227b7"},
{ type: "quests", icon: "Q", name: "Wet Job - Part 2", info: "Locate the fishermen's dwelling and mark the fishing table with an MS2000 marker", lat: 228, lng: 318 , questId: "5a27bbf886f774333a418eeb"},
{ type: "quests", icon: "Q", name: "Wet Job - Part 3", info: "Locate Artyom's car. survive and extract from the location", lat: 304, lng: 467 , questId: "5a27bc1586f7741f6d40fa2f"},
{ type: "quests", icon: "Q", name: "Signal - Part 3", info: "Place the first Signal Jammer on the specified place", lat: 373, lng: 912 , questId: "5ac346cf86f7741d63233a02"},
{ type: "quests", icon: "Q", name: "Signal - Part 3", info: "Place the second Signal Jammer on the specified place", lat: 664, lng: 718 , questId: "5ac346cf86f7741d63233a02"},
{ type: "quests", icon: "Q", name: "Signal - Part 3", info: "Place the third Signal Jammer on the specified place", lat: 518, lng: 1115 , questId: "5ac346cf86f7741d63233a02"},
{ type: "quests", icon: "Q", name: "Nothing Fishy About This", info: "Locate Ragman's SUV. survive and extract from the location", lat: 733, lng: 336 , questId: "65802b627b44fa5e14638899"},
{ type: "quests", icon: "Q", name: "Courtesy Visit", info: "Locate the chairman's house,All three houses must be found in a single raid. If you leave the raid and have only found some of the houses, the quest will reset. You must extract in the same raid in which you found all the houses", lat: 631, lng: 187 , questId: "5d25e48186f77443e625e386"},
{ type: "quests", icon: "Q", name: "Courtesy Visit", info: "Locate the fisherman's house,All three houses must be found in a single raid. If you leave the raid and have only found some of the houses, the quest will reset. You must extract in the same raid in which you found all the houses", lat: 699, lng: 207 , questId: "5d25e48186f77443e625e386"},
{ type: "quests", icon: "Q", name: "Courtesy Visit", info: "Locate the priest's house,All three houses must be found in a single raid. If you leave the raid and have only found some of the houses, the quest will reset. You must extract in the same raid in which you found all the houses", lat: 632, lng: 286 , questId: "5d25e48186f77443e625e386"},
{ type: "quests", icon: "Q", name: "Health Care Privacy", info: "Locate The first ambulance and mark it with an MS2000 marker", lat: 336, lng: 221 , questId: "5a68661a86f774500f48afb0"},
{ type: "quests", icon: "Q", name: "Health Care Privacy", info: "Locate the second ambulance and mark it with an MS2000 marker", lat: 339, lng: 307 , questId: "5a68661a86f774500f48afb0"},
{ type: "quests", icon: "Q", name: "Health Care Privacy", info: "Locate the third ambulance and mark it with an MS2000 marker", lat: 667, lng: 743 , questId: "5a68661a86f774500f48afb0"},
{ type: "quests", icon: "Q", name: "Natural Exchange", info: "Stash the first metal fuel tank at the smugglers' base", lat: 742, lng: 1038 , questId: "6740a02a69a58fceba0ff399"},
{ type: "quests", icon: "Q", name: "Natural Exchange", info: "Stash the second metal fuel tank at the smugglers' base", lat: 785, lng: 1048 , questId: "6740a02a69a58fceba0ff399"},
{ type: "quests", icon: "Q", name: "Forge a Friendship'", info: "Locate and obtain prapor's cargo. Hand over the found cargo", lat: 192, lng: 785 , questId: "6740a15566e6a521aa051b15"},
{ type: "quests", icon: "Q", name: "Anesthesia", info: "Mark the first trading post with an MS2000 marker", lat: 664, lng: 747 , questId: "5eda19f0edce541157209cee"},
{ type: "quests", icon: "Q", name: "Anesthesia", info: "Mark the second trading post with an MS2000 marker", lat: 512, lng: 446 , questId: "5eda19f0edce541157209cee"},
{ type: "quests", icon: "Q", name: "Anesthesia", info: "Mark the third trading post with an MS2000 marker", lat: 183, lng: 779 , questId: "5eda19f0edce541157209cee"},
{ type: "quests", icon: "Q", name: "Colleagues - Part 1", info: "Locate the group that was sent to the cottages on Shoreline (All three corpses must be found in a single raid. If you leave the raid and have only found some of the corpses, the quest will reset. You must extract in the same raid in which you found all the corpses.)", lat: 542, lng: 447 , questId: "5edab736cc183c769d778bc2"},
{ type: "quests", icon: "Q", name: "Colleagues - Part 1", info: "Locate the group that was sent to the pier on Shoreline (All three corpses must be found in a single raid. If you leave the raid and have only found some of the corpses, the quest will reset. You must extract in the same raid in which you found all the corpses.)", lat: 188, lng: 779 , questId: "5edab736cc183c769d778bc2"},
{ type: "quests", icon: "Q", name: "Colleagues - Part 1", info: "Locate the group that was sent to the Health Resort on Shoreline (All three corpses must be found in a single raid. If you leave the raid and have only found some of the corpses, the quest will reset. You must extract in the same raid in which you found all the corpses.)", lat: 645 , lng: 736 , questId: "5edab736cc183c769d778bc2"},
{ type: "quests", icon: "Q", name: "Colleagues - Part 2", info: "Sanitar's ophtalmoscope cottage back door key required", lat: 504, lng: 446 , questId: "5edaba7c0c502106f869bc02"},
{ type: "quests", icon: "Q", name: "Colleagues - Part 2", info: "Sanitar's surgency kit", lat: 194, lng: 783 , questId: "5edaba7c0c502106f869bc02"},
{ type: "quests", icon: "Q", name: "Rigged Game", info: "Mark the medical container by cottages with an MS2000 Marker on Shoreline", lat: 513, lng: 448 , questId: "5edabd13218d181e29451442"},
{ type: "quests", icon: "Q", name: "Rigged Game", info: "container at the river pier with an MS2000 Marker on Shoreline", lat: 179, lng: 782 , questId: "5edabd13218d181e29451442"},
{ type: "quests", icon: "Q", name: "Rigged Game", info: "container at the Health Resort with an MS2000 Marker on Shoreline", lat: 667, lng: 740 , questId: "5edabd13218d181e29451442"},
{ type: "quests", icon: "Q", name: "No Swiping", info: "Locate the smuggler's base and eliminate any 10 enemies in the base area", lat: 769, lng: 1076 , questId: "658027799634223183395339"},
];

const shorelineSanatoriumMarkers = [
  // Quests
  { type: "quests", icon: "Q", name: "Spa Tour - Part 4", info: "219 west or 220 west key required", lat: 203, lng: 1045 , questId: "5a03296886f774569778596a"},
  { type: "quests", icon: "Q", name: "Spa Tour - Part 4", info: "219 west or 220 west key required", lat: 202, lng: 306 , questId: "5a03296886f774569778596a"},
  { type: "quests", icon: "Q", name: "Cargo X - Part 1", info: "Obtain the data in the computer room in the east wing of the Health Resort on Shoreline", lat: 97, lng: 801 , questId: "5a27bb1e86f7741f27621b7e"},
  { type: "quests", icon: "Q", name: "Cargo X - Part 2", info: "Found on top of the blue barrels", lat: 542, lng: 1045 , questId: "5a27bb3d86f77411ea361a21"},
  { type: "quests", icon: "Q", name: "Cargo X - Part 3", info: "Locate the TerraGroup cargo hidden inside the Health Resort on Shoreline. Survive and extract", lat: 773, lng: 230 , questId: "5a27bb5986f7741dfb660900"},
  { type: "quests", icon: "Q", name: "wet job - Part 4", info: "On the desk", lat: 659, lng: 1069 , questId: "5a27bc3686f7741c73584026"},
  { type: "quests", icon: "Q", name: "wet job - Part 5", info: "328 east key required", lat: 41, lng: 1119 , questId: "5a27bc6986f7741c7358402b"},
  { type: "quests", icon: "Q", name: "Thirsty - Echo", info: "Locate any information about Thirsty on Shoreline. Obtain the information in Thirsty's hideout. Hand over the found information", lat: 773, lng: 439 , questId: "665eeca45d86b6c8aa03c79d"},
  { type: "quests", icon: "Q", name: "Health Care Privacy - Part 2", info: "306 west key required", lat: 80, lng: 515 , questId: "5a68663e86f774501078f78a"},
  { type: "quests", icon: "Q", name: "Chemistry Closet", info: "Blue Tape key required", lat: 398, lng: 962 , questId: "5f04886a3937dc337a6b8238"},
  { type: "quests", icon: "Q", name: "Nostalgia", info: "303 west key required", lat: 92, lng: 549 , questId: "5d25e4ad86f77443e625e387"},
];

/* =========================
   HIDEOUT
========================= */

async function showHideout(push = true) {
  currentSection = "hideout";
  if (push) pushHistory("hideout");
  setActiveNav("hideout");
  searchInput.style.display = "none";
  searchInput.value = "";

  // Si déjà chargé en mémoire, on réutilise
  if (allHideoutStations.length > 0) {
    displayHideoutStations(allHideoutStations);
    return;
  }

  content.innerHTML = "<p>Loading hideout...</p>";

  const query = `
    {
      hideoutStations {
        id
        name
        levels {
          level
          itemRequirements {
            item {
              id
              name
              iconLink
            }
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Hideout API error.</p>";
      return;
    }

    allHideoutStations = result.data.hideoutStations;
    displayHideoutStations(allHideoutStations);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load hideout.</p>";
  }
}

function getHideoutStationProgress(station) {
  let total = 0;
  let completed = 0;

  station.levels.forEach(level => {
    level.itemRequirements?.forEach(req => {
      const itemKey = `${station.id}-${level.level}-${req.item.id}`;
      const currentAmount = getHideoutItemProgress(itemKey);
      const requiredAmount = req.count;

      total += requiredAmount;
      completed += Math.min(currentAmount, requiredAmount);
    });
  });

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percent };
}

function displayHideoutStations(stations, push = true) {
  if (push) pushHistory("hideout");
  setActiveNav("hideout");
  content.innerHTML = "<h2>Hideout</h2>";

  stations.forEach(station => {
    const progress = getHideoutStationProgress(station);

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => displayHideoutDetails(station);

    card.innerHTML = `
      <h3>${escapeHTML(station.name)}</h3>
      <p>${station.levels.length} levels</p>
      <p>${progress.completed} / ${progress.total} required</p>
      <div class="progress-bar mini-progress">
        <div class="progress-fill" style="width: ${progress.percent}%;"></div>
      </div>
      <p>${progress.percent}%</p>
    `;

    content.appendChild(card);
  });
}

function displayHideoutDetails(station) {
  content.innerHTML = `
    <button class="back-btn" onclick="displayHideoutStations(allHideoutStations)">
      ← Back
    </button>

    <div class="quest-detail">
      <h2>${escapeHTML(station.name)}</h2>

      <button
        class="favorite-btn"
        onclick='hideCompletedItems = !hideCompletedItems; displayHideoutDetails(allHideoutStations.find(s => s.id === "${escapeHTML(station.id)}"))'
      >
        ${hideCompletedItems ? "👁 Show all items" : "🎯 Show missing items only"}
      </button>

      ${
        station.levels.map(level => `
          <div class="detail-box">
            <h3>Level ${level.level}</h3>

            ${
              level.itemRequirements?.length > 0
                ? level.itemRequirements
                    .filter(req => {
                      const itemKey = `${station.id}-${level.level}-${req.item.id}`;
                      const currentAmount = getHideoutItemProgress(itemKey);
                      return !hideCompletedItems || currentAmount < req.count;
                    })
                    .map(req => {
                      const itemKey = `${station.id}-${level.level}-${req.item.id}`;
                      const currentAmount = getHideoutItemProgress(itemKey);
                      const maxAmount = req.count;

                      return `
                        <div class="reward hideout-requirement">
                          ${req.item.iconLink ? `<img src="${escapeHTML(req.item.iconLink)}" alt="${escapeHTML(req.item.name)}" loading="lazy">` : ""}

                          <div class="hideout-progress">
                            <span class="hideout-item-name">${escapeHTML(req.item.name)}</span>

                            <div class="hideout-controls">
                              ${
                                maxAmount > 100
                                  ? `
                                    <button class="qty-btn small-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", -10000, "${escapeHTML(station.id)}", ${maxAmount})'>-10k</button>
                                    <button class="qty-btn small-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", -1000, "${escapeHTML(station.id)}", ${maxAmount})'>-1k</button>
                                  `
                                  : `
                                    <button class="qty-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", -1, "${escapeHTML(station.id)}", ${maxAmount})'>-</button>
                                  `
                              }

                              <span class="qty-display" id="qty-${itemKey}">${currentAmount} / ${maxAmount}</span>

                              ${
                                maxAmount > 100
                                  ? `
                                    <button class="qty-btn small-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", 1000, "${escapeHTML(station.id)}", ${maxAmount})'>+1k</button>
                                    <button class="qty-btn small-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", 10000, "${escapeHTML(station.id)}", ${maxAmount})'>+10k</button>
                                  `
                                  : `
                                    <button class="qty-btn" onclick='event.stopPropagation(); changeHideoutItem("${itemKey}", 1, "${escapeHTML(station.id)}", ${maxAmount})'>+</button>
                                  `
                              }
                            </div>
                          </div>
                        </div>
                      `;
                    }).join("")
                : "<p>No items required.</p>"
            }
          </div>
        `).join("")
      }
    </div>
  `;
}

function changeHideoutItem(itemKey, amount, stationId, max) {
  if (!hideoutItemProgress[itemKey]) {
    hideoutItemProgress[itemKey] = 0;
  }

  hideoutItemProgress[itemKey] += amount;

  if (hideoutItemProgress[itemKey] < 0) hideoutItemProgress[itemKey] = 0;
  if (hideoutItemProgress[itemKey] > max) hideoutItemProgress[itemKey] = max;

  saveHideoutProgress();

  // Mise à jour ciblée — on ne reconstruit pas toute la vue
  const display = document.getElementById(`qty-${itemKey}`);
  if (display) {
    display.textContent = `${hideoutItemProgress[itemKey]} / ${max}`;
  }
}

function saveHideoutProgress() {
  localStorage.setItem("hideoutItemProgress", JSON.stringify(hideoutItemProgress));
}

function getHideoutItemProgress(itemKey) {
  return hideoutItemProgress[itemKey] || 0;
}

/* =========================
   MARCHANDS
   Request filtrée : on ne charge que le trader demandé
========================= */

async function showTraders(push = true) {
  currentSection = "traders";
  if (push) pushHistory("traders");
  setActiveNav("traders");
  searchInput.style.display = "none";
  searchInput.value = "";

  // Si les traders sont déjà en mémoire, pas besoin de recharger
  if (allTraders.length > 0) {
    displayTraders(allTraders);
    return;
  }

  content.innerHTML = "<p>Loading traders...</p>";

  const query = `
    {
      traders {
        id
        name
        imageLink
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Traders API error.</p>";
      return;
    }

    allTraders = result.data.traders;
    displayTraders(allTraders);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load traders.</p>";
  }
}

function displayTraders(traders, push = true) {
  if (push) pushHistory("traders");
  setActiveNav("traders");
  content.innerHTML = "<h2>Traders</h2>";

  traders.forEach(trader => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => displayTraderDetails(trader);

    card.innerHTML = `
      <div class="item-card">
        ${trader.imageLink ? `<img src="${escapeHTML(trader.imageLink)}" alt="${escapeHTML(trader.name)}" loading="lazy">` : ""}
        <div>
          <h3>${escapeHTML(trader.name)}</h3>
          <p>View items and barters</p>
        </div>
      </div>
    `;

    content.appendChild(card);
  });
}

async function displayTraderDetails(trader) {
  content.innerHTML = `
    <button class="back-btn" onclick="displayTraders(allTraders)">
      ← Back
    </button>
    <p>Loading offers from ${escapeHTML(trader.name)}...</p>
  `;

  // Si ce trader a déjà ses offres chargées, on réutilise directement
  const cached = allTraders.find(t => t.id === trader.id && t.cashOffers);
  if (cached) {
    selectedTraderLevel = "all";
    traderViewMode = "sales";
    traderSearchValue = "";
    pendingTraderSearch = "";
    displayTraderOffers(cached);
    return;
  }

  // On charge tous les traders avec leurs offres complètes,
  // puis on filtre côté client sur l'ID voulu.
  // Le résultat est mis en cache dans allTraders pour éviter
  // de refaire cet appel si l'utilisateur revient sur la liste.
  const query = `
    {
      traders {
        id
        name
        cashOffers {
          item {
            id
            name
            iconLink
          }
          price
          currency
          minTraderLevel
        }
        barters {
          level
          requiredItems {
            count
            item {
              id
              name
              iconLink
            }
          }
          rewardItems {
            count
            item {
              id
              name
              iconLink
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Trader offers API error.</p>";
      return;
    }

    // On met en cache tous les traders avec leurs offres
    allTraders = result.data.traders;

    // On isole le trader demandé
    const fullTrader = allTraders.find(t => t.id === trader.id);

    if (!fullTrader) {
      content.innerHTML = "<p>Trader not found.</p>";
      return;
    }

    selectedTraderLevel = "all";
    traderViewMode = "sales";
    traderSearchValue = "";
    pendingTraderSearch = "";

    displayTraderOffers(fullTrader);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load offers.</p>";
  }
}

function displayTraderOffers(trader) {
  const search = traderSearchValue.toLowerCase();

  const filteredOffers = trader.cashOffers
    .filter(offer =>
      selectedTraderLevel === "all" ||
      offer.minTraderLevel === selectedTraderLevel
    )
    .filter(offer =>
      offer.item?.name?.toLowerCase().includes(search)
    );

  const filteredBarters = trader.barters
    .filter(barter =>
      selectedTraderLevel === "all" ||
      barter.level === selectedTraderLevel
    )
    .filter(barter => {
      const rewardMatch = barter.rewardItems?.some(r => r.item?.name?.toLowerCase().includes(search));
      const requiredMatch = barter.requiredItems?.some(r => r.item?.name?.toLowerCase().includes(search));
      return rewardMatch || requiredMatch;
    });

  content.innerHTML = `
    <button class="back-btn" onclick="displayTraders(allTraders)">
      ← Back
    </button>

    <div class="quest-detail">
      <h2>${escapeHTML(trader.name)}</h2>

      <div class="trader-search-box">
        <input
          type="text"
          class="trader-search"
          placeholder="Search trader items..."
          value="${escapeHTML(pendingTraderSearch)}"
          oninput='pendingTraderSearch = this.value'
        />
        <button onclick='applyTraderSearch("${escapeHTML(trader.id)}")'>
          🔍 Search
        </button>
      </div>

      <div class="trader-tabs">
        <button onclick='setTraderViewMode("sales", "${escapeHTML(trader.id)}")'>🛒 Sales</button>
        <button onclick='setTraderViewMode("barters", "${escapeHTML(trader.id)}")'>🔁 Barters</button>
      </div>

      <div class="trader-filters">
        <button onclick='setTraderLevelFilter("all", "${escapeHTML(trader.id)}")'>All</button>
        <button onclick='setTraderLevelFilter(1, "${escapeHTML(trader.id)}")'>LL1</button>
        <button onclick='setTraderLevelFilter(2, "${escapeHTML(trader.id)}")'>LL2</button>
        <button onclick='setTraderLevelFilter(3, "${escapeHTML(trader.id)}")'>LL3</button>
        <button onclick='setTraderLevelFilter(4, "${escapeHTML(trader.id)}")'>LL4</button>
      </div>

      ${
        traderViewMode === "sales"
          ? `
            <div class="detail-box">
              <h3>Items for sale</h3>
              ${
                filteredOffers?.length > 0
                  ? filteredOffers.slice(0, 100).map(offer => `
                      <div class="reward">
                        ${offer.item?.iconLink ? `<img src="${escapeHTML(offer.item.iconLink)}" alt="${escapeHTML(offer.item.name)}" loading="lazy">` : ""}
                        <span>
                          ${escapeHTML(offer.item?.name) || "Unknown item"}
                          <br>
                          ${offer.price || 0} ${escapeHTML(offer.currency) || ""}
                          ${offer.minTraderLevel ? ` - LL${offer.minTraderLevel}` : ""}
                        </span>
                      </div>
                    `).join("")
                  : "<p>No items found.</p>"
              }
            </div>
          `
          : ""
      }

      ${
        traderViewMode === "barters"
          ? `
            <div class="detail-box">
              <h3>Barters</h3>
              ${
                filteredBarters?.length > 0
                  ? filteredBarters.slice(0, 100).map(barter => `
                      <div class="barter-card">
                        <div class="barter-reward">
                          <strong>Receives:</strong>
                          ${
                            barter.rewardItems?.map(reward => `
                              <div class="reward">
                                ${reward.item?.iconLink ? `<img src="${escapeHTML(reward.item.iconLink)}" alt="${escapeHTML(reward.item.name)}" loading="lazy">` : ""}
                                <span>${reward.count} x ${escapeHTML(reward.item?.name) || "Unknown item"}</span>
                              </div>
                            `).join("")
                          }
                        </div>
                        <div class="barter-required">
                          <strong>Gives:</strong>
                          ${
                            barter.requiredItems?.map(required => `
                              <div class="reward">
                                ${required.item?.iconLink ? `<img src="${escapeHTML(required.item.iconLink)}" alt="${escapeHTML(required.item.name)}" loading="lazy">` : ""}
                                <span>${required.count} x ${escapeHTML(required.item?.name) || "Unknown item"}</span>
                              </div>
                            `).join("")
                          }
                        </div>
                        <p>LL${barter.level || "?"}</p>
                      </div>
                    `).join("")
                  : "<p>No barters found.</p>"
              }
            </div>
          `
          : ""
      }
    </div>
  `;
}

function setTraderViewMode(mode, traderId) {
  traderViewMode = mode;
  const trader = allTraders.find(t => t.id === traderId);
  if (trader) displayTraderOffers(trader);
}

function setTraderLevelFilter(level, traderId) {
  selectedTraderLevel = level;
  const trader = allTraders.find(t => t.id === traderId);
  if (trader) displayTraderOffers(trader);
}

function applyTraderSearch(traderId) {
  traderSearchValue = pendingTraderSearch;
  const trader = allTraders.find(t => t.id === traderId);
  if (trader) displayTraderOffers(trader);
}

/* =========================
   RECHERCHE ET OUTILS
========================= */

// Debounce appliqué : attend 250ms après la dernière frappe avant de filtrer
const handleSearch = debounce(() => {
  const value = searchInput.value.toLowerCase();

  if (currentSection === "quests") {
    const filteredTasks = allTasks.filter(task =>
      task.name.toLowerCase().includes(value)
    );
    // On applique la recherche texte par-dessus les filtres actifs
    const withFilters = filteredTasks.filter(task => {
      const traderMatch = questFilterTrader === "all" || task.trader?.name === questFilterTrader;
      const mapMatch = questFilterMap === "all" || task.map?.name === questFilterMap;
      return traderMatch && mapMatch;
    });
    // On affiche sans repousser l'historique ni réinitialiser les filtres
    displayQuestsRaw(withFilters);
  }

  if (currentSection === "items") {
    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.shortName?.toLowerCase().includes(value)
    );
    displayItems(filteredItems, false);
  }

  if (currentSection === "ammo") {
    const filteredAmmo = allAmmo.filter(ammo =>
      ammo.item?.name?.toLowerCase().includes(value) ||
      ammo.item?.shortName?.toLowerCase().includes(value) ||
      ammo.caliber?.toLowerCase().includes(value)
    );
    displayAmmo(filteredAmmo, false);
  }
}, 250);

// Version interne de displayQuests sans reconstruire les filtres
// utilisée uniquement par la recherche texte
function displayQuestsRaw(tasks) {
  // On vide uniquement les cartes, pas les filtres
  const existing = document.querySelectorAll("#content .card");
  existing.forEach(c => c.remove());

  const noResult = document.querySelector("#content .no-result");
  if (noResult) noResult.remove();

  if (tasks.length === 0) {
    const p = document.createElement("p");
    p.className = "no-result";
    p.textContent = "No quests found.";
    content.appendChild(p);
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    if (isTaskComplete(task.id)) card.classList.add("quest-complete");
    card.onclick = () => displayQuestDetails(task);

    card.innerHTML = `
      <h3>
        ${isTaskComplete(task.id) ? "✔ " : ""}
        ${escapeHTML(task.name)}
        ${task.kappaRequired ? '<span class="kappa-badge">🟣 Kappa</span>' : ""}
      </h3>
      <p>
        ${escapeHTML(task.trader?.name) || "Unknown"}
        ${task.map?.name ? `· ${escapeHTML(task.map.name)}` : ""}
        ${task.minPlayerLevel ? `· Lvl. ${task.minPlayerLevel}` : ""}
      </p>
    `;

    content.appendChild(card);
  });
}

searchInput.addEventListener("input", handleSearch);

function getUnlockedTasks(taskId) {
  return allTasks.filter(otherTask =>
    otherTask.taskRequirements?.some(req => req.task?.id === taskId)
  );
}

function toggleSection(id) {
  const section = document.getElementById(id);
  section.style.display = section.style.display === "none" ? "block" : "none";
}

/* =========================
   FAVORIS
========================= */

function addFavorite(type, data) {
  const exists = favorites.find(fav => fav.id === data.id);

  if (exists) {
    favorites = favorites.filter(fav => fav.id !== data.id);
  } else {
    favorites.push({ type, ...data });
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(id) {
  return favorites.some(fav => fav.id === id);
}

function showFavorites(push = true) {
  currentSection = "favorites";
  if (push) pushHistory("favorites");
  setActiveNav("favorites");
  searchInput.style.display = "none";
  searchInput.value = "";

  const cachedTasks = loadFromCache("cachedTasks");
  const cachedItems = loadFromCache("cachedItems");

  if (cachedTasks) allTasks = cachedTasks;
  if (cachedItems) allItems = cachedItems;

  content.innerHTML = "<h2>Favorites</h2>";

  if (favorites.length === 0) {
    content.innerHTML += "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach(fav => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openFavorite(fav);

    card.innerHTML = `
      <h3>${escapeHTML(fav.name)}</h3>
      <p>${escapeHTML(fav.type)}</p>
    `;

    content.appendChild(card);
  });
}

function openFavorite(fav) {
  if (fav.type === "quest") {
    const task = allTasks.find(task => task.id === fav.id);
    task ? displayQuestDetails(task) : alert("Charge d'abord les quests.");
  }

  if (fav.type === "item") {
    const item = allItems.find(item => item.id === fav.id);
    item ? displayItemDetails(item) : alert("Charge d'abord les items.");
  }
}

/* =========================
   PROGRESSION KAPPA
========================= */

function toggleTaskComplete(taskId) {
  if (completedTasks.includes(taskId)) {
    completedTasks = completedTasks.filter(id => id !== taskId);
  } else {
    completedTasks.push(taskId);
  }
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  updateQuestCompletionUI(taskId);
}

function isTaskComplete(taskId) {
  return completedTasks.includes(taskId);
}

/* =========================
   OBJECTIFS INDIVIDUELS
========================= */

function getObjectiveKey(taskId, objIndex) {
  return `${taskId}__obj${objIndex}`;
}

function isObjectiveComplete(taskId, objIndex) {
  return !!completedObjectives[getObjectiveKey(taskId, objIndex)];
}

function toggleObjective(taskId, objIndex) {
  const key = getObjectiveKey(taskId, objIndex);
  completedObjectives[key] = !completedObjectives[key];
  localStorage.setItem("completedObjectives", JSON.stringify(completedObjectives));

  // Auto-complétion : si tous les objectifs sont cochés → quest terminée
  const task = allTasks.find(t => t.id === taskId);
  if (task?.objectives?.length > 0) {
    const allDone = task.objectives.every((_, i) => isObjectiveComplete(taskId, i));
    if (allDone && !completedTasks.includes(taskId)) {
      completedTasks.push(taskId);
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    } else if (!allDone && completedTasks.includes(taskId)) {
      completedTasks = completedTasks.filter(id => id !== taskId);
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
  }

  // Mise à jour ciblée — on ne reconstruit pas toute la page
  updateObjectiveUI(taskId, objIndex);
  updateQuestCompletionUI(taskId);
}

function updateObjectiveUI(taskId, objIndex) {
  const key = getObjectiveKey(taskId, objIndex);
  const done = !!completedObjectives[key];
  const el = document.getElementById(`obj-${taskId}-${objIndex}`);
  if (!el) return;

  el.classList.toggle("objective-done", done);
  const checkbox = el.querySelector(".obj-checkbox");
  if (checkbox) checkbox.textContent = done ? "✔" : "";

  // Met à jour la barre de progression des objectifs
  const task = allTasks.find(t => t.id === taskId);
  if (task?.objectives?.length > 0) {
    const doneCount = task.objectives.filter((_, i) => isObjectiveComplete(taskId, i)).length;
    const total = task.objectives.length;
    const pct = Math.round((doneCount / total) * 100);

    const bar = document.getElementById(`obj-progress-${taskId}`);
    if (bar) bar.style.width = `${pct}%`;

    const label = document.getElementById(`obj-label-${taskId}`);
    if (label) label.textContent = `${doneCount} / ${total}`;
  }
}

function updateQuestCompletionUI(taskId) {
  const btn = document.getElementById(`complete-btn-${taskId}`);
  if (!btn) return;
  const done = completedTasks.includes(taskId);
  btn.textContent = done ? "✔ Quest completed" : "❌ Mark as completed";
  btn.style.background = done ? "var(--success)" : "";
}

function getQuestObjectiveProgress(task) {
  if (!task.objectives?.length) return null;
  const done = task.objectives.filter((_, i) => isObjectiveComplete(task.id, i)).length;
  return { done, total: task.objectives.length, pct: Math.round((done / task.objectives.length) * 100) };
}

function getKappaProgress() {
  const kappaTasks = allTasks.filter(task => task.kappaRequired);
  const completedKappaTasks = kappaTasks.filter(task => completedTasks.includes(task.id));

  return {
    completed: completedKappaTasks.length,
    total: kappaTasks.length,
    percent: kappaTasks.length > 0
      ? Math.round((completedKappaTasks.length / kappaTasks.length) * 100)
      : 0
  };
}

function showKappaTasks() {
  currentSection = "kappa";
  setActiveNav("quests");
  pushHistory("quests");
  searchInput.style.display = "none";

  const kappaTasks = allTasks.filter(task => task.kappaRequired);
  const total = kappaTasks.length;
  const done = kappaTasks.filter(t => completedTasks.includes(t.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Non terminées en premier, terminées en bas
  const sortedTasks = [
    ...kappaTasks.filter(task => !completedTasks.includes(task.id)),
    ...kappaTasks.filter(task => completedTasks.includes(task.id))
  ];

  content.innerHTML = `
    <button class="back-btn" onclick="displayQuests(allTasks)">← Back</button>
    <h2>🟣 Kappa Quests</h2>
    <div class="detail-box" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-weight:700;color:var(--accent)">${done} / ${total} quests</span>
        <span style="font-weight:700;color:var(--accent)">${pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;

  sortedTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    if (completedTasks.includes(task.id)) card.classList.add("quest-complete");
    card.onclick = () => displayQuestDetails(task);

    const objProgress = getQuestObjectiveProgress(task);

    card.innerHTML = `
      <h3>
        ${completedTasks.includes(task.id) ? "✔ " : ""}
        ${escapeHTML(task.name)}
      </h3>
      <p>
        ${escapeHTML(task.trader?.name) || "Unknown"}
        ${task.map?.name ? `· ${escapeHTML(task.map.name)}` : ""}
      </p>
      ${objProgress && !completedTasks.includes(task.id) ? `
        <div class="card-obj-progress">
          <div class="card-obj-bar">
            <div class="progress-fill" style="width:${objProgress.pct}%"></div>
          </div>
          <span class="card-obj-label">${objProgress.done}/${objProgress.total}</span>
        </div>
      ` : ""}
    `;

    content.appendChild(card);
  });
}

/* =========================
   ACCUEIL — DASHBOARD
========================= */

function showHome(push = true) {
  currentSection = "home";
  if (push) pushHistory("home");
  setActiveNav("home");
  searchInput.style.display = "none";
  searchInput.value = "";

  const cachedTasks = loadFromCache("cachedTasks");
  if (cachedTasks) allTasks = cachedTasks;

  const cachedItems = loadFromCache("cachedItems");
  if (cachedItems) allItems = cachedItems;

  const kappa = getKappaProgress();

  // Quests en cours (non terminées, avec données disponibles)
  const inProgressTasks = allTasks
    .filter(t => !completedTasks.includes(t.id))
    .slice(0, 3);

  // Hideout — stations non complètes
  const hideoutIncomplete = allHideoutStations.filter(station => {
    const p = getHideoutStationProgress(station);
    return p.percent < 100;
  });

  // Recent Favorites
  const recentFavorites = favorites.slice(-3).reverse();

  content.innerHTML = `
    <div class="dashboard">

      <!-- HERO BANNER -->
      <div class="dashboard-hero">
        <div class="dashboard-hero-text">
          <h1>Raid Companion</h1>
          <p>Companion App • Escape From Tarkov</p>
        </div>
      </div>

      <!-- KAPPA -->
      <div class="dashboard-card kappa-card" onclick="showKappaTasks()">
        <div class="dashboard-card-header">
          <span class="dashboard-card-icon">🟣</span>
          <span class="dashboard-card-title">Kappa Progress</span>
          <span class="dashboard-card-chevron">›</span>
        </div>
        <div class="progress-bar" style="margin: 10px 0 6px">
          <div class="progress-fill" style="width: ${kappa.percent}%"></div>
        </div>
        <div class="kappa-stats-row">
          <span>${kappa.completed} / ${kappa.total} quests</span>
          <span class="kappa-pct">${kappa.percent}%</span>
        </div>
      </div>

      <!-- QUÊTES EN COURS -->
      <div class="dashboard-section">
        <div class="dashboard-section-header">
          <span>📋 Quests to do</span>
          <button class="dashboard-see-all" onclick="getQuests()">See all →</button>
        </div>
        ${allTasks.length === 0 ? `
          <div class="dashboard-empty" onclick="getQuests()">
            <p>Load quests to see your progress</p>
          </div>
        ` : inProgressTasks.length === 0 ? `
          <div class="dashboard-empty">
            <p>🎉 All quests completed!</p>
          </div>
        ` : inProgressTasks.map(task => `
          <div class="dashboard-task-card" onclick="getQuests()">
            <div class="dashboard-task-info">
              <span class="dashboard-task-name">${escapeHTML(task.name)}</span>
              <span class="dashboard-task-meta">
                ${escapeHTML(task.trader?.name || "?")}
                ${task.map?.name ? `· ${escapeHTML(task.map.name)}` : ""}
              </span>
            </div>
            ${task.kappaRequired ? '<span class="kappa-badge">🟣</span>' : ""}
          </div>
        `).join("")}
      </div>

      <!-- HIDEOUT -->
      <div class="dashboard-section">
        <div class="dashboard-section-header">
          <span>🏚 Hideout</span>
          <button class="dashboard-see-all" onclick="showHideout()">See all →</button>
        </div>
        ${allHideoutStations.length === 0 ? `
          <div class="dashboard-empty" onclick="showHideout()">
            <p>Load hideout to see your progress</p>
          </div>
        ` : `
          <div class="dashboard-hideout-grid">
            ${hideoutIncomplete.slice(0, 4).map(station => {
              const p = getHideoutStationProgress(station);
              return `
                <div class="dashboard-hideout-cell" onclick="showHideout()">
                  <span class="dashboard-hideout-name">${escapeHTML(station.name)}</span>
                  <div class="progress-bar mini-progress">
                    <div class="progress-fill" style="width:${p.percent}%"></div>
                  </div>
                  <span class="dashboard-hideout-pct">${p.percent}%</span>
                </div>
              `;
            }).join("")}
          </div>
          ${hideoutIncomplete.length > 4 ? `
            <p class="dashboard-more" onclick="showHideout()">
              + ${hideoutIncomplete.length - 4} stations to complete
            </p>
          ` : hideoutIncomplete.length === 0 ? `
            <p class="dashboard-empty-text">🎉 Hideout complete !</p>
          ` : ""}
        `}
      </div>

      <!-- FAVORIS -->
      ${recentFavorites.length > 0 ? `
        <div class="dashboard-section">
          <div class="dashboard-section-header">
            <span>⭐ Recent Favorites</span>
            <button class="dashboard-see-all" onclick="showFavorites()">See all →</button>
          </div>
          ${recentFavorites.map(fav => `
            <div class="dashboard-task-card" onclick="openFavorite(${JSON.stringify(fav).replace(/"/g, '&quot;')})">
              <div class="dashboard-task-info">
                <span class="dashboard-task-name">${escapeHTML(fav.name)}</span>
                <span class="dashboard-task-meta">${escapeHTML(fav.type)}</span>
              </div>
              <span style="color:var(--accent)">⭐</span>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- ACCÈS RAPIDE -->
      <div class="dashboard-section">
        <div class="dashboard-section-header">
          <span>⚡ Quick Access</span>
        </div>
        <div class="dashboard-quick-grid">
          <button class="dashboard-quick-btn" onclick="showMaps()">🗺<span>Maps</span></button>
          <button class="dashboard-quick-btn" onclick="showAmmo()">🔫<span>Ammo</span></button>
          <button class="dashboard-quick-btn" onclick="showTraders()">💰<span>Traders</span></button>
          <button class="dashboard-quick-btn" onclick="showItems()">🎒<span>Items</span></button>
        </div>
      </div>

    </div>
  `;
}

/* =========================
   AMMO
   Cache ajouté (comme les quests et items)
========================= */

async function showAmmo(push = true) {
  currentSection = "ammo";
  if (push) pushHistory("ammo");
  setActiveNav("ammo");
  searchInput.style.display = "block";
  searchInput.value = "";

  content.innerHTML = "<p>Loading ammo...</p>";

  const cachedAmmo = loadFromCache("cachedAmmo");

  if (cachedAmmo) {
    allAmmo = cachedAmmo;
    displayAmmo(allAmmo);
    return;
  }

  const query = `
    {
      ammo {
        item {
          id
          name
          shortName
          iconLink
        }
        caliber
        damage
        penetrationPower
        armorDamage
        fragmentationChance
        ricochetChance
        heavyBleedModifier
        lightBleedModifier
        accuracyModifier
        recoilModifier
        initialSpeed
        tracer
        tracerColor
        ammoType
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      content.innerHTML = "<p>Ammo API error.</p>";
      return;
    }

    allAmmo = result.data.ammo;
    saveToCache("cachedAmmo", allAmmo);
    displayAmmo(allAmmo);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load ammo.</p>";
  }
}

function getArmorClassInfo(pen) {
  if (pen >= 50) return { label: "Very effective class 5/6", className: "armor-red" };
  if (pen >= 40) return { label: "Effective class 4/5", className: "armor-orange" };
  if (pen >= 30) return { label: "Decent class 3/4", className: "armor-yellow" };
  return { label: "Low penetration", className: "armor-green" };
}

function displayAmmo(ammoList, push = true) {
  if (push) pushHistory("ammo");
  setActiveNav("ammo");
  content.innerHTML = "<h2>Ammo / Ballistics</h2>";

  const calibers = [...new Set(allAmmo.map(a => a.caliber).filter(Boolean))].sort();

  const filtered = ammoList
    .filter(ammo => ammo.penetrationPower >= selectedAmmoPen)
    .filter(ammo => selectedAmmoCaliber === "all" || ammo.caliber === selectedAmmoCaliber)
    .sort((a, b) => b.penetrationPower - a.penetrationPower);

  content.innerHTML += `
    <div class="ammo-top-bar">
      <div class="ammo-caliber-filter">
        <select onchange="setAmmoCaliberFilter(this.value)">
          <option value="all">All calibers</option>
          ${calibers.map(caliber => `
            <option value="${escapeHTML(caliber)}" ${selectedAmmoCaliber === caliber ? "selected" : ""}>
              ${escapeHTML(caliber)}
            </option>
          `).join("")}
        </select>
      </div>

      ${ammoComparison.length > 0 ? `
        <button class="compare-trigger-btn" onclick="showAmmoComparison()">
          ⚖ Compare (${ammoComparison.length})
        </button>
      ` : ""}
    </div>

    ${ammoComparison.length > 0 ? `
      <div class="ammo-compare-bar">
        ${ammoComparison.map(a => `
          <div class="ammo-compare-chip">
            <span>${escapeHTML(a.item?.shortName || a.item?.name || "?")}</span>
            <button onclick="toggleAmmoComparison('${escapeHTML(a.item?.id)}'); displayAmmo(allAmmo, false)">✕</button>
          </div>
        `).join("")}
        ${ammoComparison.length >= 2 ? `
          <button class="compare-go-btn" onclick="showAmmoComparison()">View →</button>
        ` : ""}
      </div>
    ` : ""}
  `;

  filtered.forEach(ammo => {
    const armorInfo = getArmorClassInfo(ammo.penetrationPower || 0);
    const isSelected = ammoComparison.some(a => a.item?.id === ammo.item?.id);

    const card = document.createElement("div");
    card.className = `card ${isSelected ? "ammo-selected" : ""}`;
    card.onclick = () => displayAmmoDetail(ammo);

    card.innerHTML = `
      <div class="item-card">
        ${ammo.item?.iconLink ? `<img src="${escapeHTML(ammo.item.iconLink)}" alt="${escapeHTML(ammo.item.name)}" loading="lazy">` : ""}
        <div style="flex:1">
          <h3>${escapeHTML(ammo.item?.name) || "Unknown ammo"}</h3>
          <p><strong>Pen:</strong> ${ammo.penetrationPower || 0} &nbsp;·&nbsp; <strong>Damage:</strong> ${ammo.damage || 0}</p>
          <p><span class="${armorInfo.className}">${armorInfo.label}</span></p>
        </div>
        <button
          class="ammo-compare-btn ${isSelected ? "ammo-compare-btn--active" : ""}"
          onclick="event.stopPropagation(); toggleAmmoComparison('${escapeHTML(ammo.item?.id)}'); displayAmmo(allAmmo, false)"
          title="${isSelected ? "Remove from comparison" : "Add to comparison"}"
        >
          ${isSelected ? "✔" : "⚖"}
        </button>
      </div>
    `;

    content.appendChild(card);
  });
}

/* =========================
   DÉTAIL MUNITION
========================= */

function displayAmmoDetail(ammo) {
  pushHistory("ammo");
  setActiveNav("ammo");

  const armorInfo = getArmorClassInfo(ammo.penetrationPower || 0);

  const statBar = (value, max, colorClass) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return `
      <div class="stat-bar-wrap">
        <div class="stat-bar-bg">
          <div class="stat-bar-fill ${colorClass}" style="width:${pct}%"></div>
        </div>
        <span class="stat-bar-value">${value}</span>
      </div>
    `;
  };

  const fmt = (val, suffix = "") =>
    val !== undefined && val !== null ? `${val}${suffix}` : "N/A";

  const fmtPct = val =>
    val !== undefined && val !== null ? `${Math.round(val * 100)}%` : "N/A";

  const fmtMod = val => {
    if (val === undefined || val === null) return "N/A";
    const pct = Math.round(val * 100);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  };

  content.innerHTML = `
    <button class="back-btn" onclick="displayAmmo(allAmmo, false)">← Back</button>

    <div class="quest-detail">
      <div class="ammo-detail-header">
        ${ammo.item?.iconLink ? `<img src="${escapeHTML(ammo.item.iconLink)}" alt="${escapeHTML(ammo.item.name)}" loading="lazy" class="ammo-detail-icon">` : ""}
        <div>
          <h2 style="margin:0 0 4px">${escapeHTML(ammo.item?.name) || "Unknown ammo"}</h2>
          <p style="margin:0; color:var(--muted)">${escapeHTML(ammo.caliber) || "Unknown caliber"}</p>
          ${ammo.tracer ? `<span class="kappa-badge" style="background:#8b6914">🔦 Traceur ${escapeHTML(ammo.tracerColor || "")}</span>` : ""}
          ${ammo.ammoType ? `<span class="kappa-badge" style="background:var(--surface-3); color:var(--muted)">${escapeHTML(ammo.ammoType)}</span>` : ""}
        </div>
      </div>

      <div class="detail-box">
        <h3>Main Stats</h3>

        <div class="stat-row">
          <span class="stat-label">Damage</span>
          ${statBar(ammo.damage || 0, 200, "bar-damage")}
        </div>
        <div class="stat-row">
          <span class="stat-label">Penetration</span>
          ${statBar(ammo.penetrationPower || 0, 70, "bar-pen")}
        </div>
        <div class="stat-row">
          <span class="stat-label">Armor damage</span>
          ${statBar(ammo.armorDamage || 0, 100, "bar-armor")}
        </div>

        <p class="ammo-armor-class">
          Armor class: <span class="${armorInfo.className}">${armorInfo.label}</span>
        </p>
      </div>

      <div class="detail-box">
        <h3>Secondary Stats</h3>
        <div class="ammo-stats-grid">
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Fragmentation</span>
            <span class="ammo-stat-value">${fmtPct(ammo.fragmentationChance)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Ricochet</span>
            <span class="ammo-stat-value">${fmtPct(ammo.ricochetChance)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Heavy bleed</span>
            <span class="ammo-stat-value">${fmtPct(ammo.heavyBleedModifier)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Light bleed</span>
            <span class="ammo-stat-value">${fmtPct(ammo.lightBleedModifier)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Accuracy</span>
            <span class="ammo-stat-value">${fmtMod(ammo.accuracyModifier)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Recoil</span>
            <span class="ammo-stat-value">${fmtMod(ammo.recoilModifier)}</span>
          </div>
          <div class="ammo-stat-cell">
            <span class="ammo-stat-label">Initial speed</span>
            <span class="ammo-stat-value">${fmt(ammo.initialSpeed, " m/s")}</span>
          </div>
        </div>
      </div>

      <button
        class="compare-add-btn ${ammoComparison.some(a => a.item?.id === ammo.item?.id) ? "compare-add-btn--active" : ""}"
        onclick="toggleAmmoComparison('${escapeHTML(ammo.item?.id)}'); this.textContent = ammoComparison.some(a => a.item?.id === '${escapeHTML(ammo.item?.id)}') ? '✔ In comparison' : '⚖ Add to comparison'; this.classList.toggle('compare-add-btn--active')"
      >
        ${ammoComparison.some(a => a.item?.id === ammo.item?.id) ? "✔ In comparison" : "⚖ Add to comparison"}
      </button>

      ${ammoComparison.length >= 2 ? `
        <button class="compare-trigger-btn" onclick="showAmmoComparison()">
          ⚖ View comparison (${ammoComparison.length})
        </button>
      ` : ""}
    </div>
  `;
}

/* =========================
   COMPARAISON MUNITIONS
========================= */

function toggleAmmoComparison(itemId) {
  const existing = ammoComparison.findIndex(a => a.item?.id === itemId);

  if (existing !== -1) {
    ammoComparison.splice(existing, 1);
    return;
  }

  if (ammoComparison.length >= 3) {
    ammoComparison.shift(); // on retire la plus ancienne si on dépasse 3
  }

  const ammo = allAmmo.find(a => a.item?.id === itemId);
  if (ammo) ammoComparison.push(ammo);
}

function showAmmoComparison() {
  if (ammoComparison.length < 2) return;

  setActiveNav("ammo");

  const cols = ammoComparison.length; // 2 ou 3

  const stats = [
    { key: "damage",              label: "Damage",           max: 200, bar: "bar-damage", higherBetter: true },
    { key: "penetrationPower",    label: "Penetration",      max: 70,  bar: "bar-pen",    higherBetter: true },
    { key: "armorDamage",         label: "Armor damage",    max: 100, bar: "bar-armor",  higherBetter: true },
    { key: "fragmentationChance", label: "Fragmentation",    pct: true,  higherBetter: true },
    { key: "heavyBleedModifier",  label: "Heavy bleed",     pct: true,  higherBetter: true },
    { key: "initialSpeed",        label: "Speed (m/s)",    max: 1000,  higherBetter: true },
    { key: "accuracyModifier",    label: "Accuracy",        mod: true,  higherBetter: false },
    { key: "recoilModifier",      label: "Recoil",            mod: true,  higherBetter: false },
  ];

  const formatVal = (ammo, stat) => {
    const val = ammo[stat.key];
    if (val === undefined || val === null) return "—";
    if (stat.pct) return `${Math.round(val * 100)}%`;
    if (stat.mod) {
      const pct = Math.round(val * 100);
      return pct > 0 ? `+${pct}%` : `${pct}%`;
    }
    return String(val);
  };

  const bestVal = (stat) => {
    const vals = ammoComparison
      .map(a => a[stat.key])
      .filter(v => v !== undefined && v !== null);
    if (vals.length === 0) return null;
    return stat.higherBetter ? Math.max(...vals) : Math.min(...vals);
  };

  // En-tête — label vide + une cellule par munition
  const headerCells = `
    <div class="compare-label-cell"></div>
    ${ammoComparison.map(ammo => `
      <div class="compare-ammo-header">
        ${ammo.item?.iconLink
          ? `<img src="${escapeHTML(ammo.item.iconLink)}" alt="${escapeHTML(ammo.item.name)}" loading="lazy">`
          : ""}
        <span>${escapeHTML(ammo.item?.shortName || ammo.item?.name || "?")}</span>
        <small>${escapeHTML(ammo.caliber || "")}</small>
      </div>
    `).join("")}
  `;

  // Lignes de stats
  const statRows = stats.map((stat, i) => {
    const best = bestVal(stat);
    const isEven = i % 2 === 0;

    const labelCell = `<div class="compare-label-cell ${isEven ? "compare-row-even" : ""}">${stat.label}</div>`;

    const valueCells = ammoComparison.map(ammo => {
      const val = ammo[stat.key];
      const isBest = best !== null && val !== undefined && val !== null && val === best;
      const display = formatVal(ammo, stat);

      let barHtml = "";
      if (stat.bar && val !== undefined && val !== null) {
        const pct = Math.min(100, Math.round((val / stat.max) * 100));
        barHtml = `<div class="compare-mini-bar"><div class="stat-bar-fill ${stat.bar}" style="width:${pct}%"></div></div>`;
      }

      return `
        <div class="compare-value-cell ${isBest ? "compare-best" : ""} ${isEven ? "compare-row-even" : ""}">
          ${barHtml}
          <span>${display}</span>
        </div>
      `;
    }).join("");

    return labelCell + valueCells;
  }).join("");

  content.innerHTML = `
    <button class="back-btn" onclick="displayAmmo(allAmmo, false)">← Back</button>

    <h2>⚖ Comparison</h2>

    <div class="compare-table cols-${cols}">
      ${headerCells}
      ${statRows}
    </div>

    <button
      class="reset-filter-btn"
      style="margin-top: 4px"
      onclick="ammoComparison = []; displayAmmo(allAmmo, false)"
    >
      ✕ Clear comparison
    </button>
  `;
}

function setAmmoPenFilter(value) {
  selectedAmmoPen = value;
  displayAmmo(allAmmo);
}

function setAmmoCaliberFilter(caliber) {
  selectedAmmoCaliber = caliber;
  displayAmmo(allAmmo);
}

/* =========================
   SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(error => console.error("SW error :", error));
}

/* =========================
   DÉMARRAGE
========================= */

// Remplace l'état initial vide par un état "home" pour que popstate fonctionne
history.replaceState({ section: "home" }, "", "#home");
showHome(false);