const bossesData = [
  {
    id: "reshala",
    name: "Reshala",
    nickname: "The Dealmaker",
    image: "assets/reshala.jpg",
    maps: ["Customs"],
    spawnRate: "~42%",
    guards: 4,
    difficulty: "Medium",
    description: "Reshala is a former customs official turned crime lord. He patrols the dorms and gas stations on Customs with 4 armed guards.",
    loot: [
      "Golden TT pistol (unique)",
      "Reshala's Golden TT",
      "Kedr submachine gun",
      "High-tier ammunition",
      "Weapon mods"
    ],
    tips: [
      "He doesn't have armor — one good headshot is enough",
      "His guards are more dangerous than he is",
      "Eliminate guards first before engaging Reshala",
      "Common spawns: gas station, dorms 2nd and 3rd floor, new gas station"
    ]
  },
  {
    id: "tagilla",
    name: "Tagilla",
    nickname: "The Foreman",
    image: "assets/tagilla.jpg",
    maps: ["Factory", "Interchange"],
    spawnRate: "~53%",
    guards: 0,
    difficulty: "Hard",
    description: "Tagilla is a former factory worker who uses a sledgehammer and full face protection. He roams Factory alone and charges players on sight.",
    loot: [
      "Tagilla's welding mask (unique)",
      "UBEY face shield",
      "Tagilla's hammer",
      "High-tier armor",
      "Weapon mods"
    ],
    tips: [
      "Always wears a face shield — aim for the sides of the head or the body",
      "He charges you on sight — be ready to back off",
      "Use a shotgun at close range for maximum efficiency",
      "He can one-shot with the hammer — keep your distance",
      "Flashbangs can disorient him temporarily"
    ]
  },
  {
    id: "shturman",
    name: "Shturman",
    nickname: "The Woodsman",
    image: "assets/shturman.jpg",
    maps: ["Woods"],
    spawnRate: "~36%",
    guards: 2,
    difficulty: "Hard",
    description: "Shturman is a skilled sniper who patrols the sawmill area on Woods with 2 guards. He is extremely accurate at long range.",
    loot: [
      "Shturman's key (access to sawmill stash)",
      "SVDS or SV-98 sniper rifle",
      "High-tier ammunition",
      "Weapon mods",
      "Valuable items"
    ],
    tips: [
      "He snipers from a distance — never stand still in the open",
      "Approach via the forest to avoid being spotted",
      "His guards are also armed with sniper rifles",
      "Kill him from max distance with a sniper rifle",
      "His stash key contains high-value loot"
    ]
  },
  {
    id: "killa",
    name: "Killa",
    nickname: "The Maniac",
    image: "assets/killa.jpg",
    maps: ["Interchange"],
    spawnRate: "~42%",
    guards: 0,
    difficulty: "Very Hard",
    description: "Killa is a heavily armored solo boss who patrols the mall on Interchange and Streets. He uses an LMG and has top-tier armor.",
    loot: [
      "Killa's helmet (unique)",
      "Killa's chest rig (unique)",
      "LMG or high-tier weapon",
      "Class 5-6 armor",
      "High-tier weapon mods"
    ],
    tips: [
      "He has class 6 armor — use high penetration ammo (pen 50+)",
      "His helmet is almost impenetrable — aim for the face",
      "He uses a mounted shield — don't shoot from the front",
      "Strafe constantly to avoid his LMG bursts",
      "Grenades are very effective against him"
    ]
  },
  {
    id: "glukhar",
    name: "Glukhar",
    nickname: "The Warlord",
    image: "assets/glukhar.jpg",
    maps: ["Reserve"],
    spawnRate: "~43%",
    guards: 6,
    difficulty: "Very Hard",
    description: "Glukhar is a former military commander who patrols the military base on Reserve with 6 elite guards. He is one of the most dangerous bosses.",
    loot: [
      "High-tier military weapons",
      "Class 5-6 armor",
      "High-tier weapon mods",
      "Valuable military items",
      "High-tier ammunition"
    ],
    tips: [
      "He and his guards all have high-tier armor — use pen 50+ ammo",
      "Never engage all 7 at once — isolate them",
      "Use the buildings and terrain for cover",
      "His guards are extremely aggressive and accurate",
      "Grenades and explosives are very effective"
    ]
  },
  {
    id: "sanitar",
    name: "Sanitar",
    nickname: "The Doctor",
    image: "assets/sanitar.jpg",
    maps: ["Shoreline"],
    spawnRate: "~42%",
    guards: 2,
    difficulty: "Hard",
    description: "Sanitar is a former doctor who patrols the health resort on Shoreline. He heals himself and his guards during combat.",
    loot: [
      "Sanitar's bag (unique)",
      "Medical items",
      "High-tier weapon",
      "Class 4-5 armor",
      "Valuable medical supplies"
    ],
    tips: [
      "He heals himself — use rapid fire to prevent healing",
      "His guards are also medics and will heal each other",
      "He often uses chemical grenades — have antidotes ready",
      "Common spawns: resort east and west wings, cottages",
      "He is faster than most bosses — don't try to run"
    ]
  },
  {
    id: "zryachiy",
    name: "Zryachiy",
    nickname: "The Lighthouse Keeper",
    image: "assets/zryachiy.jpg",
    maps: ["Lighthouse"],
    spawnRate: "~40%",
    guards: 4,
    difficulty: "Hard",
    description: "Zryachiy is a blind sniper who guards the lighthouse island with 4 Rogues. Reaching him requires crossing a minefield.",
    loot: [
      "Zryachiy's balaclava (unique)",
      "Zryachiy's eyewear (unique)",
      "High-tier sniper rifle",
      "High-tier ammunition",
      "Weapon mods"
    ],
    tips: [
      "The island is surrounded by a minefield — use the map to navigate",
      "His guards (Rogues) will shoot any PMC on sight",
      "Approach from the water to avoid the minefield",
      "He is blind but his guards are not — be careful",
      "A suppressed sniper rifle is recommended"
    ]
  },
  {
    id: "kaban",
    name: "Kaban",
    nickname: "The Crime Boss",
    image: "assets/kaban.jpg",
    maps: ["Streets of Tarkov"],
    spawnRate: "~35%",
    guards: 6,
    difficulty: "Very Hard",
    description: "Kaban is a crime boss who controls the streets of Tarkov with 6 elite guards. He stays in a fortified position and is extremely dangerous.",
    loot: [
      "Kaban's key (access to his stash)",
      "High-tier weapons",
      "Class 5-6 armor",
      "Valuable items",
      "High-tier weapon mods"
    ],
    tips: [
      "He rarely moves — his guards patrol around him",
      "Use high penetration ammo (pen 50+)",
      "His guards are very well equipped — eliminate them first",
      "Grenades are very effective",
      "His stash key contains very valuable loot"
    ]
  },
  {
    id: "kollontay",
    name: "Kollontay",
    nickname: "The Enforcer",
    image: "assets/kollontay.jpg",
    maps: ["Streets of Tarkov", "Ground Zero"],
    spawnRate: "~30%",
    guards: 5,
    difficulty: "Very Hard",
    description: "Kollontay is a high-ranking enforcer who patrols Streets of Tarkov and Ground Zero. He requires the player to be level 21+ to spawn on Ground Zero.",
    loot: [
      "Kollontay's police baton (unique)",
      "High-tier weapons",
      "Class 5-6 armor",
      "Valuable items"
    ],
    tips: [
      "Level 21+ required for him to spawn on Ground Zero",
      "He is extremely aggressive — always flanked by guards",
      "Use high penetration ammo",
      "His police baton is required for a quest",
      "Grenades and explosives are recommended"
    ]
  },
  {
    id: "knight",
    name: "Knight",
    nickname: "The Goons Leader",
    image: "assets/Knight.jpg",
    maps: ["Woods", "Customs", "Shoreline", "Lighthouse",],
    spawnRate: "~25% (rotates between maps)",
    guards: 2,
    difficulty: "Extreme",
    description: "Knight is the leader of The Goons squad. He uses an assault rifle and coordinates his team with Big Pipe and Birdeye. The Goons rotate randomly between maps each raid.",
    loot: [
      "Knight's dog tag (unique)",
      "High-tier assault rifle",
      "Class 5-6 armor",
      "High-tier weapon mods",
      "Valuable items"
    ],
    tips: [
      "The Goons always spawn together — never fight one alone",
      "Knight rushes aggressively — be ready for close combat",
      "They rotate randomly between maps — check the discord for current location",
      "Use grenades to break their formation",
      "High penetration ammo is mandatory (pen 50+)"
    ]
  },
  {
    id: "birdeye",
    name: "Birdeye",
    nickname: "The Goons Sniper",
    image: "assets/Birdeye.jpg",
    maps: ["Woods", "Customs", "Shoreline", "Lighthouse",],
    spawnRate: "~25% (rotates between maps)",
    guards: 2,
    difficulty: "Extreme",
    description: "Birdeye is the long-range specialist of The Goons. He positions himself at distance and provides sniper support while Knight and Big Pipe engage.",
    loot: [
      "Birdeye's dog tag (unique)",
      "High-tier sniper rifle",
      "Class 5-6 armor",
      "High-tier ammunition",
      "Weapon mods"
    ],
    tips: [
      "Birdeye stays at distance — never stand in the open",
      "Locate him first before engaging Knight or Big Pipe",
      "He has a suppressor — hard to locate by sound",
      "Use smoke grenades to break his line of sight",
      "Always check rooftops and elevated positions"
    ]
  },
  {
    id: "bigpipe",
    name: "Big Pipe",
    nickname: "The Goons Grenadier",
    image: "assets/Bigpipe.jpg",
    maps: ["Woods", "Customs", "Shoreline", "Lighthouse",],
    spawnRate: "~25% (rotates between maps)",
    guards: 2,
    difficulty: "Extreme",
    description: "Big Pipe is the grenadier of The Goons. He uses an underbarrel grenade launcher and is extremely dangerous at medium range.",
    loot: [
      "Big Pipe's dog tag (unique)",
      "High-tier weapon with underbarrel launcher",
      "Class 5-6 armor",
      "Grenades",
      "Weapon mods"
    ],
    tips: [
      "He spams grenades — never stay behind cover for too long",
      "Keep moving constantly when engaging him",
      "He has heavy armor — use pen 50+ ammo",
      "Engage him at long range to avoid his grenades",
      "He is the most dangerous of the three at close range"
    ]
  }
];

function showBosses(push = true) {
  currentSection = "bosses";
  if (push) pushHistory("bosses");
  setActiveNav("bosses");
  searchInput.style.display = "none";
  searchInput.value = "";

  content.innerHTML = `
    <h2>💀 Bosses</h2>
    <p style="color:var(--muted); font-size:13px; margin-bottom:16px">
      Tap a boss to see details, spawn zones and tips.
    </p>
  `;

  bossesData.forEach(boss => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => displayBossDetails(boss);

    card.innerHTML = `
      <div class="boss-card-row">
        <img src="${escapeHTML(boss.image)}" alt="${escapeHTML(boss.name)}" class="boss-thumb" loading="lazy">
        <div class="boss-card-info">
          <h3>${escapeHTML(boss.name)}</h3>
          <p class="boss-nickname">"${escapeHTML(boss.nickname)}"</p>
          <p class="boss-maps">📍 ${boss.maps.join(", ")}</p>
          <span class="boss-difficulty boss-difficulty-${boss.difficulty.toLowerCase().replace(" ", "-")}">
            ${escapeHTML(boss.difficulty)}
          </span>
        </div>
      </div>
    `;

    content.appendChild(card);
  });
}

function displayBossDetails(boss) {
  pushHistory("bosses");
  setActiveNav("bosses");

  content.innerHTML = `
    <button class="back-btn" onclick="showBosses()">← Back</button>

    <div class="quest-detail">
      <div class="boss-detail-header">
        <img src="${escapeHTML(boss.image)}" alt="${escapeHTML(boss.name)}" class="boss-detail-img" loading="lazy">
        <div>
          <h2>${escapeHTML(boss.name)}</h2>
          <p class="boss-nickname">"${escapeHTML(boss.nickname)}"</p>
          <span class="boss-difficulty boss-difficulty-${boss.difficulty.toLowerCase().replace(" ", "-")}">
            ${escapeHTML(boss.difficulty)}
          </span>
        </div>
      </div>

      <div class="detail-box">
        <p>${escapeHTML(boss.description)}</p>
      </div>

      <div class="detail-box">
        <h3>📊 Info</h3>
        <p><strong>Maps:</strong> ${boss.maps.join(", ")}</p>
        <p><strong>Spawn rate:</strong> ${escapeHTML(boss.spawnRate)}</p>
        <p><strong>Guards:</strong> ${boss.guards === 0 ? "None (solo)" : boss.guards}</p>
      </div>

      <div class="detail-box">
        <h3>🎁 Notable Loot</h3>
        ${boss.loot.map(item => `
          <div class="objective">🔸 ${escapeHTML(item)}</div>
        `).join("")}
      </div>

      <div class="detail-box">
        <h3>💡 Tips</h3>
        ${boss.tips.map(tip => `
          <div class="objective">✔ ${escapeHTML(tip)}</div>
        `).join("")}
      </div>
    </div>
  `;
}
