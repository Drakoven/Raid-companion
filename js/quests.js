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

  const traders = ["all", ...new Set(tasks.map(t => t.trader?.name).filter(Boolean))].sort();
  const maps = ["all", ...new Set(tasks.map(t => t.map?.name).filter(Boolean))].sort();

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

function getUnlockedTasks(taskId) {
  return allTasks.filter(otherTask =>
    otherTask.taskRequirements?.some(req => req.task?.id === taskId)
  );
}

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

function displayQuestsRaw(tasks) {
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
