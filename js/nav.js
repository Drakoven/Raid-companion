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
    storyline: 7,
    favorites: 8,
    bosses:    9
  };

  const buttons = document.querySelectorAll(".bottom-nav button");
  buttons.forEach(btn => btn.classList.remove("nav-active"));

  const index = navMap[section];
  if (index !== undefined && buttons[index]) {
    buttons[index].classList.add("nav-active");
  }
}

function pushHistory(section, data = {}) {
  history.pushState({ section, ...data }, "", `#${section}`);
}

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
    case "storyline": showStoryline(false); break;
    case "bosses":    showBosses(false); break;
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

history.replaceState({ section: "home" }, "", "#home");
