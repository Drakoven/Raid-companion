const groundZeroMarkers = [
  // EXTRACTIONS
  { type: "extractions", icon: "E", name: "Tartowers Sales Office", info: "Code Required", lat: 459, lng: 156 },
  { type: "extractions", icon: "E", name: "Mira Avenue", info: "Green Flare required", lat: 781, lng: 123 },
  { type: "extractions", icon: "E", name: "Emercom Checkpoint", info: "Always open", lat: 883, lng: 245 },
  { type: "extractions", icon: "E", name: "Police Cordon V-EX", info: "20 000 Rubles required", lat: 499, lng: 561 },
  { type: "extractions", icon: "E", name: "Nakatani Basement", info: "Always open", lat: 82, lng: 558 },

  // SCAV EXTRACTIONS
  { type: "extractions_scav", icon: "ES", name: "Tartowers Sales Office", info: "Code Required", lat: 460, lng: 160 },
  { type: "extractions_scav", icon: "ES", name: "Nakatani Basement", info: "Always open", lat: 80, lng: 550 },
  { type: "extractions_scav", icon: "ES", name: "Emercom Checkpoint", info: "Always open", lat: 885, lng: 250 },

  // EXTRACTION CO-OP
  { type: "extractions_coop", icon: "EC", name: "Scav Checkpoint", info: "Co-op", lat: 859, lng: 480 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Streets Of Tarkov", info: "Minimum of 1 min in raid for the transit to activate", lat: 578, lng: 97 },

  // BOSS
  { type: "boss", icon: "S", name: "Kollontay", info: "Has a chance to spawn anywhere on the map after requirements are met. Must be level 21+", lat: 701, lng: 376 },

  // SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 93, lng: 288 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 163, lng: 217 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 207, lng: 291 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 236, lng: 252 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 359, lng: 292 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 380, lng: 324 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 421, lng: 247 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 432, lng: 457 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 472, lng: 191 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 587, lng: 320 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 721, lng: 207 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 714, lng: 299 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 831, lng: 259 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 895, lng: 448 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 806, lng: 523 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 706, lng: 546 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 765, lng: 918 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 583, lng: 819 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 512, lng: 900 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 400, lng: 896 },

  // QUESTS
  { type: "quests", icon: "Q", name: "First in Line", info: "Locate the Emercom station on Ground Zero. Hand over any 3 found in raid médicine items", lat: 861, lng: 247 , questId: "657315ddab5a49b71f098853"},
  { type: "quests", icon: "Q", name: "Shooting Cans", info: "AGS Grenade Launcher", lat: 90, lng: 212 , questId: "657315df034d76585f032e01"},
  { type: "quests", icon: "Q", name: "Shooting Cans", info: "UTYOS Machine Gun", lat: 372, lng: 424 , questId: "657315df034d76585f032e01"},
  { type: "quests", icon: "Q", name: "Burning Rubber", info: "Use the paid vehicle extraction on Ground Zero", lat: 493, lng: 560 , questId: "657315e270bb0b8dba00cc48"},
  { type: "quests", icon: "Q", name: "Saving The Mole", info: "Ground floor, by the elevators the debris.", lat: 665, lng: 636 , questId: "657315e4a6af4ab4b50f3459"},
  { type: "quests", icon: "Q", name: "Saving The Mole", info: "Hall entrance to TerraGroup from parking lot", lat: 742, lng: 576 , questId: "657315e4a6af4ab4b50f3459"},
  { type: "quests", icon: "Q", name: "Saving The Mole", info: "TerraGroup Science Office Key. Up the right hand staircase (when entering the front door). On the 2nd floor, number (4) room. Found on the middle desk's left side. You can enter through the window of Room 3, which doesn't require a key", lat: 617, lng: 670 , questId: "657315e4a6af4ab4b50f3459"},
  { type: "quests", icon: "Q", name: "Saving The Mole", info: "Locate the USEC PMC group at the parking lot of the TerraGroup Complex on Ground Zero.", lat: 753, lng: 568 , questId: "657315e4a6af4ab4b50f3459"},
  { type: "quests", icon: "Q", name: "Luxurious Life", info: "Locate the liquor store and obtain the wine bottle. Hand over the wine bottle", lat: 644, lng: 293 , questId: "657315e1dccd301f1301416a"},
  { type: "quests", icon: "Q", name: "Shady Contractor", info: "Locate the Knossos LLC senior manager's car, Locate and obtain the manager's diary. Hand over the diary", lat: 286, lng: 368 , questId: "67a09636b8725511260bc421"},
];
