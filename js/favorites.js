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
