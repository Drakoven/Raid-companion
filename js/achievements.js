let allAchievements = [];
let completedAchievements = JSON.parse(localStorage.getItem("completedAchievements")) || [];

let achievementFilterSide = "all";
let achievementFilterHidden = "all";
let achievementSortBy = "rarity";

async function showAchievements(push = true) {
  currentSection = "achievements";
  if (push) pushHistory("achievements");
  setActiveNav("achievements");
  searchInput.style.display = "block";
  searchInput.value = "";

  content.innerHTML = "<p>Loading achievements...</p>";

  const cached = loadFromCache("cachedAchievements");
  if (cached) {
    allAchievements = cached;
    displayAchievements(allAchievements);
    return;
  }

  const query = `
    {
      achievements {
        id
        name
        description
        hidden
        adjustedPlayersCompletedPercent
        side
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
      content.innerHTML = "<p>Achievements API error.</p>";
      return;
    }

    allAchievements = result.data.achievements;
    saveToCache("cachedAchievements", allAchievements);
    displayAchievements(allAchievements);

  } catch (error) {
    console.error(error);
    content.innerHTML = "<p>Unable to load achievements.</p>";
  }
}

function displayAchievements(achievements, push = true) {
  if (push) pushHistory("achievements");
  setActiveNav("achievements");

  // Filtrage
  let filtered = achievements.filter(a => {
    const sideMatch = achievementFilterSide === "all" || a.side === achievementFilterSide;
    const hiddenMatch =
      achievementFilterHidden === "all" ||
      (achievementFilterHidden === "hidden" && a.hidden) ||
      (achievementFilterHidden === "visible" && !a.hidden);
    return sideMatch && hiddenMatch;
  });

  // Tri
  if (achievementSortBy === "rarity") {
    filtered.sort((a, b) => a.adjustedPlayersCompletedPercent - b.adjustedPlayersCompletedPercent);
  } else if (achievementSortBy === "common") {
    filtered.sort((a, b) => b.adjustedPlayersCompletedPercent - a.adjustedPlayersCompletedPercent);
  } else if (achievementSortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const completedCount = filtered.filter(a => completedAchievements.includes(a.id)).length;
  const totalCount = filtered.length;

  content.innerHTML = `
    <h2>🏆 Achievements
      <span style="font-size:13px; color:var(--muted)">
        (${completedCount}/${totalCount})
      </span>
    </h2>

    <div class="progress-bar" style="margin-bottom:12px">
      <div class="progress-fill" style="width:${totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 0}%"></div>
    </div>

    <div class="achievement-filters">
      <div class="achievement-filter-row">
        <label>Side</label>
        <select onchange="setAchievementFilter('side', this.value)">
          <option value="all" ${achievementFilterSide === "all" ? "selected" : ""}>All</option>
          <option value="PMC" ${achievementFilterSide === "PMC" ? "selected" : ""}>PMC</option>
          <option value="Scav" ${achievementFilterSide === "Scav" ? "selected" : ""}>Scav</option>
        </select>
      </div>

      <div class="achievement-filter-row">
        <label>Type</label>
        <select onchange="setAchievementFilter('hidden', this.value)">
          <option value="all" ${achievementFilterHidden === "all" ? "selected" : ""}>All</option>
          <option value="visible" ${achievementFilterHidden === "visible" ? "selected" : ""}>Visible</option>
          <option value="hidden" ${achievementFilterHidden === "hidden" ? "selected" : ""}>Hidden 🔒</option>
        </select>
      </div>

      <div class="achievement-filter-row">
        <label>Sort</label>
        <select onchange="setAchievementFilter('sort', this.value)">
          <option value="rarity" ${achievementSortBy === "rarity" ? "selected" : ""}>Rarest first</option>
          <option value="common" ${achievementSortBy === "common" ? "selected" : ""}>Most common first</option>
          <option value="name" ${achievementSortBy === "name" ? "selected" : ""}>Name A-Z</option>
        </select>
      </div>
    </div>
  `;

  if (filtered.length === 0) {
    content.innerHTML += "<p>No achievements found.</p>";
    return;
  }

  filtered.forEach(achievement => {
    const isCompleted = completedAchievements.includes(achievement.id);
    const pct = achievement.adjustedPlayersCompletedPercent;
    const rarityLabel = getRarityLabel(pct);

    const card = document.createElement("div");
    card.className = `card ${isCompleted ? "quest-complete" : ""}`;
    card.onclick = () => toggleAchievement(achievement.id);

    card.innerHTML = `
      <div class="achievement-card-row">
        <div class="achievement-check ${isCompleted ? "achievement-check--done" : ""}">
          ${isCompleted ? "✔" : ""}
        </div>
        <div class="achievement-info">
          <h3>
            ${isCompleted ? "✔ " : ""}
            ${escapeHTML(achievement.name)}
            ${achievement.hidden ? '<span class="achievement-hidden-badge">🔒 Hidden</span>' : ""}
          </h3>
          <p>${escapeHTML(achievement.description)}</p>
          <div class="achievement-meta">
            <span class="achievement-side achievement-side--${achievement.side?.toLowerCase()}">${escapeHTML(achievement.side || "Any")}</span>
            <span class="achievement-rarity ${rarityLabel.className}">${rarityLabel.label} · ${pct?.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;

    content.appendChild(card);
  });
}

function getRarityLabel(pct) {
  if (pct <= 1)  return { label: "Ultra Rare", className: "rarity-ultra" };
  if (pct <= 5)  return { label: "Very Rare",  className: "rarity-very-rare" };
  if (pct <= 15) return { label: "Rare",        className: "rarity-rare" };
  if (pct <= 40) return { label: "Uncommon",    className: "rarity-uncommon" };
  return          { label: "Common",             className: "rarity-common" };
}

function toggleAchievement(id) {
  if (completedAchievements.includes(id)) {
    completedAchievements = completedAchievements.filter(a => a !== id);
  } else {
    completedAchievements.push(id);
  }
  localStorage.setItem("completedAchievements", JSON.stringify(completedAchievements));
  displayAchievements(allAchievements, false);
}

function setAchievementFilter(type, value) {
  if (type === "side")   achievementFilterSide = value;
  if (type === "hidden") achievementFilterHidden = value;
  if (type === "sort")   achievementSortBy = value;
  displayAchievements(allAchievements, false);
}
