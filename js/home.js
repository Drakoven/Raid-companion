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

  const inProgressTasks = allTasks
    .filter(t => !completedTasks.includes(t.id))
    .slice(0, 3);

  const hideoutIncomplete = allHideoutStations.filter(station => {
    const p = getHideoutStationProgress(station);
    return p.percent < 100;
  });

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
