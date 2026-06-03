const reserveMarkers = [
  // EXTRACTIONS PMC
  { type: "extractions", icon: "E", name: "D-2", info: "First activate the switch, which will turn on the lights at the exfil. Then press the button beside the extract to exit.", lat: 752, lng: 264 },
  { type: "extractions", icon: "E", name: "Cliff Descent", info: "Paracord + Red Rebel and no body armor required", lat: 724, lng: 953 },
  { type: "extractions", icon: "E", name: "Sewer Manhole", info: "No backpack equipped", lat: 529, lng: 1095 },
  { type: "extractions", icon: "E", name: "Armored Train", info: "Get inside the train before it departs", lat: 195, lng: 1420 },
  { type: "extractions", icon: "E", name: "Bunker Hermetic Door", info: "Activate the Hermetic Door Switch (you then have 4 minutes to extract before needing to activate the switch again). The light overhead must be green for extraction", lat: 77, lng: 1256 },
  { type: "extractions", icon: "E", name: "Exit To Woods", info: "Minefield Map required", lat: 29, lng: 1232 },

  // EXTRACTIONS SCAV
  { type: "extractions_scav", icon: "ES", name: "Checkpoint Fence", info: "Always open", lat: 638, lng: 1115 },
  { type: "extractions_scav", icon: "ES", name: "Sewer Manhole", info: "No backpack equipped", lat: 530, lng: 1100 },
  { type: "extractions_scav", icon: "ES", name: "Armored Train", info: "Get inside the train before it departs", lat: 200, lng: 1425 },
  { type: "extractions_scav", icon: "ES", name: "Depot Hermetic Door", info: "Always open", lat: 230, lng: 1755 },
  { type: "extractions_scav", icon: "ES", name: "Bunker Hermetic Door", info: "Activate the Hermetic Door Switch (you then have 4 minutes to extract before needing to activate the switch again). The light overhead must be green for extraction", lat: 80, lng: 1260 },
  { type: "extractions_scav", icon: "ES", name: "Exit To Woods", info: "Minefield Map required", lat: 30, lng: 1235 },
  { type: "extractions_scav", icon: "ES", name: "The Heating Pipe", info: "Always open", lat: 51, lng: 1069 },
  { type: "extractions_scav", icon: "ES", name: "Hole in the wall by the mountains", info: "Always open", lat: 354, lng: 591 },

  // EXTRACTION CO-OP
  { type: "extractions_coop", icon: "EC", name: "Scav Land", info: "Requirements: Scav + PMC", lat: 76, lng: 911 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Lighthouse", info: "Marathon mode and a minimum of 7 min in raid for the extract to be active", lat: 249, lng: 1525 },
  { type: "transit", icon: "T", name: "Transit To Woods", info: "Always Open", lat: 160, lng: 1526 },
  { type: "transit", icon: "T", name: "Transit To Customs", info: "Always open", lat: 92, lng: 780 },

  // BOSS
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 226, lng: 1651 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 116, lng: 1221 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 220, lng: 1177 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 388, lng: 1206 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 390, lng: 1093 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 298, lng: 801 },
  { type: "boss", icon: "G", name: "Glukhar", info: "Boss — patrols military base", lat: 422, lng: 766 },

  // PMC SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 812, lng: 459 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 462, lng: 237 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 402, lng: 496 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 394, lng: 590 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 389, lng: 665 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 141, lng: 641 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 110, lng: 611 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 102, lng: 812 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 89, lng: 890 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 54, lng: 927 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 289, lng: 872 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 675, lng: 843 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 636, lng: 991 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 505, lng: 985 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 401, lng: 1093 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 639, lng: 1109 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 94, lng: 1079 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 544, lng: 1135 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 518, lng: 1135 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 543, lng: 1264 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 514, lng: 1286 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 532, lng: 1461 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 479, lng: 1456 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 325, lng: 1496 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 302, lng: 1362 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 188, lng: 1508 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 182, lng: 1421 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 118, lng: 1485 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 57, lng: 1453 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 93, lng: 1275 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 120, lng: 1254 },

  // QUESTS
  { type: "quests", icon: "Q", name: "The Bunker - Part 1", info: "Locate the underground bunker on Reserve. Locate the control room in the underground bunker on Reserve. Survive and extract from the location", lat: 378, lng: 291, questId: "5ede55112c95834b583f052a" },

  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "BMP #1 — inspect and mark", lat: 69, lng: 960, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "BMP #2 — inspect and mark", lat: 597, lng: 1251, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "BMP #3 — RB-ST key required, inspect and mark", lat: 536, lng: 1208, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "BMP #4 — inspect and mark", lat: 614, lng: 1097, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "LAV III #1 — inspect and mark", lat: 56, lng: 1222, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "LAV III #2 — inspect", lat: 216, lng: 910, questId: "6086c852c945025d41566124" },
  { type: "quests", icon: "Q", name: "Revision - Reserve", info: "T-90 — inspect", lat: 108, lng: 839, questId: "6086c852c945025d41566124" },

  { type: "quests", icon: "Q", name: "Back Door", info: "Find the unpowered secret exit on Reserve. Survive and extract from the location through the secret exit", lat: 751, lng: 254, questId: "6089736efa70fc097863b8f6" },

  { type: "quests", icon: "Q", name: "Classified Technologies", info: "Obtain the package with T-90M Commander control panel on Reserve. Hand over the package to Peacekeeper", lat: 732, lng: 321, questId: "60896888e4a85c72ef3fa300" },

  { type: "quests", icon: "Q", name: "Surplus Goods", info: "Obtain the MBT Integrated Navigation System. Hand over the navigation system to Mechanic", lat: 523, lng: 1203, questId: "6089732b59b92115597ad789" },

  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "Black Bishop", lat: 333, lng: 225, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "Black Bishop", lat: 325, lng: 279, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "White King", lat: 402, lng: 365, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "Black Pawn", lat: 371, lng: 214, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "Black Pawn", lat: 432, lng: 214, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "White Pawn", lat: 478, lng: 254, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "White Pawn", lat: 479, lng: 315, questId: "5ede567cfa6dc072ce15d6e3" },
  { type: "quests", icon: "Q", name: "The Bunker - Part 2", info: "White Bishop", lat: 337, lng: 352, questId: "5ede567cfa6dc072ce15d6e3" },

  { type: "quests", icon: "Q", name: "Disease History", info: "Medical Record #1 — RB-KSM key required", lat: 201, lng: 417, questId: "60896e28e4a85c72ef3fa301" },
  { type: "quests", icon: "Q", name: "Disease History", info: "Medical Record #2 — RB-SMP key required", lat: 202, lng: 380, questId: "60896e28e4a85c72ef3fa301" },

  { type: "quests", icon: "Q", name: "Safe Corridor", info: "Eliminate 10 Scavs in the underground warehouse on Reserve", lat: 190, lng: 1655, questId: "6089743983426423753cd58a" },

  { type: "quests", icon: "Q", name: "No Place for Renegades", info: "Eliminate 5 Raiders in the command bunker on Reserve", lat: 402, lng: 285, questId: "60896bca6ee58f38c417d4f2" },

  { type: "quests", icon: "Q", name: "Inventory Check", info: "Duty Room — RB-OB key required", lat: 366, lng: 105, questId: "608974af4b05530f55550c21" },
  { type: "quests", icon: "Q", name: "Inventory Check", info: "First arsenal room — no key required", lat: 359, lng: 69, questId: "608974af4b05530f55550c21" },
  { type: "quests", icon: "Q", name: "Inventory Check", info: "RB-ORB1 key required", lat: 644, lng: 240, questId: "608974af4b05530f55550c21" },
  { type: "quests", icon: "Q", name: "Inventory Check", info: "RB-ORB3 key required", lat: 360, lng: 134, questId: "608974af4b05530f55550c21" },
  { type: "quests", icon: "Q", name: "Inventory Check", info: "RB-ORB2 key required", lat: 577, lng: 242, questId: "608974af4b05530f55550c21" },

  { type: "quests", icon: "Q", name: "A Fuel Matter", info: "Fuel tank #1", lat: 519, lng: 1053, questId: "608974d01a66564e74191fc0" },
  { type: "quests", icon: "Q", name: "A Fuel Matter", info: "Fuel tank #2", lat: 285, lng: 1384, questId: "608974d01a66564e74191fc0" },

  { type: "quests", icon: "Q", name: "Documents", info: "Military document #1", lat: 378, lng: 290, questId: "60896b7bfa70fc097863b8f5" },
  { type: "quests", icon: "Q", name: "Documents", info: "Military document #2", lat: 394, lng: 277, questId: "60896b7bfa70fc097863b8f5" },
  { type: "quests", icon: "Q", name: "Documents", info: "Military document #3", lat: 400, lng: 299, questId: "60896b7bfa70fc097863b8f5" },

  { type: "quests", icon: "Q", name: "Reserve", info: "Locate the food storage location. Survive and extract from the location", lat: 180, lng: 1678, questId: "5d25e4d586f77443e625e388" },

  { type: "quests", icon: "Q", name: "Pest Control", info: "Kill Scavs inside and near the Black and White Pawn buildings", lat: 457, lng: 791, questId: "608a768d82e40b3c727fd17d" },

  { type: "quests", icon: "Q", name: "Hot Wheels - Let's Try Again", info: "Mark the Spare BTR wheels with an MS2000 Marker", lat: 478, lng: 1217, questId: "673f5a4976553f78350bdac1" },
];
