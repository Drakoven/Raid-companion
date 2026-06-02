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

function toggleAmmoComparison(itemId) {
  const existing = ammoComparison.findIndex(a => a.item?.id === itemId);

  if (existing !== -1) {
    ammoComparison.splice(existing, 1);
    return;
  }

  if (ammoComparison.length >= 3) ammoComparison.shift();

  const ammo = allAmmo.find(a => a.item?.id === itemId);
  if (ammo) ammoComparison.push(ammo);
}

function showAmmoComparison() {
  if (ammoComparison.length < 2) return;

  setActiveNav("ammo");

  const cols = ammoComparison.length;

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
