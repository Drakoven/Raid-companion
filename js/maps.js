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
    mapgenie: "https://mapgenie.io/tarkov/maps/interchange",
    interactive: "assets/maps/interactive/interchange.png"
  },
  {
    name: "Reserve",
    image: "assets/maps/reserve.jpg",
    difficulty: "Hard",
    boss: "Glukhar",
    use: "Excellent military loot and raiders.",
    extracts: ["D-2", "Hermetic Door", "Cliff Descent", "Armored Train"],
    mapgenie: "https://mapgenie.io/tarkov/maps/reserve",
    interactive: "assets/maps/interactive/reserve.png"
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
    mapgenie: "https://mapgenie.io/tarkov/maps/lighthouse",
    interactive: "assets/maps/interactive/lighthouse.png"
  },
  {
    name: "Labs",
    image: "assets/maps/labs.jpg",
    difficulty: "Very Hard",
    boss: "Raiders",
    use: "Intense PvP and high-tier loot.",
    extracts: ["Cargo Elevator", "Medical Elevator", "Parking Gate"],
    mapgenie: "https://mapgenie.io/tarkov/maps/the-lab",
    interactive: "assets/maps/interactive/labs.png"
  },
  {
    name: "Streets",
    image: "assets/maps/streets.jpg",
    difficulty: "Very Hard",
    boss: "Kaban / Kollontay",
    use: "Very dense map with enormous loot potential.",
    extracts: ["Collapsed Crane", "Courtyard", "Damaged House", "Klimov Street"],
    mapgenie: "https://mapgenie.io/tarkov/maps/streets-of-tarkov",
    interactive: "assets/maps/interactive/streets.png"
  },
  {
    name: "Ground Zero",
    image: "assets/maps/groundzero.jpg",
    difficulty: "Beginner",
    boss: "None",
    use: "Introduction map for new players.",
    extracts: ["Emercom Checkpoint", "Police Checkpoint", "Nakatani Basement"],
    mapgenie: "https://mapgenie.io/tarkov/maps/ground-zero",
    interactive: "assets/maps/interactive/groundzero.png"
  }
];

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

  setTimeout(() => initLeafletMap(mapName, imagePath, markerSet), 50);
}

let leafletMap = null;
let mapLayers = {};

function initLeafletMap(mapName, imagePath, markerSet = null) {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  const img = new Image();
  img.src = imagePath;
  img.onload = () => {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const bounds = [[0, 0], [H, W]];

    leafletMap = L.map("leaflet-map", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomSnap: 0.5,
    });

    L.imageOverlay(imagePath, bounds).addTo(leafletMap);
    leafletMap.fitBounds(bounds);

    leafletMap.on('click', function(e) {
      console.log(`lat: ${Math.round(e.latlng.lat)}, lng: ${Math.round(e.latlng.lng)}`);
    });

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
    "Ground Zero": groundZeroMarkers,
    "Reserve": reserveMarkers,
    "Labs": labsMarkers,
    "Interchange": interchangeMarkers,
    "Streets": streetsMarkers,
    "Lighthouse": lighthouseMarkers,
  };

  const allMarkersRef = {
    "shorelineMarkers": shorelineMarkers,
    "shorelineSanatoriumMarkers": shorelineSanatoriumMarkers,
    "woodsMarkers": woodsMarkers,
    "customsMarkers": customsMarkers,
    "factoryMarkers": factoryMarkers,
    "groundZeroMarkers": groundZeroMarkers,
    "reserveMarkers": reserveMarkers,
    "labsMarkers": labsMarkers,
    "interchangeMarkers": interchangeMarkers,
    "streetsMarkers": streetsMarkers,
    "lighthouseMarkers": lighthouseMarkers,
  };

  mapLayers = {};

  const markers = markersKey
    ? (allMarkersRef[markersKey] || [])
    : (markersMap[mapName] || []);

  markers.forEach(m => {
    if (!mapLayers[m.type]) mapLayers[m.type] = [];

    const icon = L.divIcon({
      className: "",
      html: `<div class="map-marker map-marker-${m.type}">${m.icon}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([m.lat, m.lng], { icon });

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
