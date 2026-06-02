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
  const end = (itemsPage + 1) * ITEMS_PER_PAGE;
  const visible = currentFilteredItems.slice(0, end);
  const total = currentFilteredItems.length;

  const counter = document.getElementById("items-count");
  if (counter) counter.textContent = `(${Math.min(end, total)} / ${total})`;

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
