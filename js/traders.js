async function showTraders(push = true) {
  currentSection = "traders";
  if (push) pushHistory("traders");
  setActiveNav("traders");
  searchInput.style.display = "none";
  searchInput.value = "";

  if (allTraders.length > 0) {
    displayTraders(allTraders, false);
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
    displayTraders(allTraders, false);

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

  const cached = allTraders.find(t => t.id === trader.id && t.cashOffers);
  if (cached) {
    selectedTraderLevel = "all";
    traderViewMode = "sales";
    traderSearchValue = "";
    pendingTraderSearch = "";
    displayTraderOffers(cached);
    return;
  }

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

    allTraders = result.data.traders;
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
