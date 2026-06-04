const handleSearch = debounce(() => {
  const value = searchInput.value.toLowerCase();

  if (currentSection === "quests") {
    const filteredTasks = allTasks.filter(task =>
      task.name.toLowerCase().includes(value)
    );
    const withFilters = filteredTasks.filter(task => {
      const traderMatch = questFilterTrader === "all" || task.trader?.name === questFilterTrader;
      const mapMatch = questFilterMap === "all" || task.map?.name === questFilterMap;
      return traderMatch && mapMatch;
    });
    displayQuestsRaw(withFilters);
  }

  if (currentSection === "items") {
    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.shortName?.toLowerCase().includes(value)
    );
    displayItems(filteredItems, false);
  }

  if (currentSection === "ammo") {
    const filteredAmmo = allAmmo.filter(ammo =>
      ammo.item?.name?.toLowerCase().includes(value) ||
      ammo.item?.shortName?.toLowerCase().includes(value) ||
      ammo.caliber?.toLowerCase().includes(value)
    );
    displayAmmo(filteredAmmo, false);
  }

  if (currentSection === "achievements") {
    const filteredAchievements = allAchievements.filter(a =>
      a.name?.toLowerCase().includes(value) ||
      a.description?.toLowerCase().includes(value)
    );
    displayAchievements(filteredAchievements, false);
  }
}, 250);

searchInput.addEventListener("input", handleSearch);

function toggleSection(id) {
  const section = document.getElementById(id);
  section.style.display = section.style.display === "none" ? "block" : "none";
}
