async function showHideout(push = true) {
  currentSection = "hideout";
  if (push) pushHistory("hideout");
  setActiveNav("hideout");
  searchInput.style.display = "none";
  searchInput.value = "";

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
  if (!hideoutItemProgress[itemKey]) hideoutItemProgress[itemKey] = 0;

  hideoutItemProgress[itemKey] += amount;

  if (hideoutItemProgress[itemKey] < 0) hideoutItemProgress[itemKey] = 0;
  if (hideoutItemProgress[itemKey] > max) hideoutItemProgress[itemKey] = max;

  saveHideoutProgress();

  const display = document.getElementById(`qty-${itemKey}`);
  if (display) display.textContent = `${hideoutItemProgress[itemKey]} / ${max}`;
}

function saveHideoutProgress() {
  localStorage.setItem("hideoutItemProgress", JSON.stringify(hideoutItemProgress));
}

function getHideoutItemProgress(itemKey) {
  return hideoutItemProgress[itemKey] || 0;
}
