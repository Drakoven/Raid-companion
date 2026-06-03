const interchangeMarkers = [
  // EXTRACTIONS PMC
  { type: "extractions", icon: "E", name: "Power Station V-EX", info: "The black SUV must be present for extraction. 5000 Roubles per player. Max 4 players", lat: 844, lng: 1380 },
  { type: "extractions", icon: "E", name: "Emercom Checkpoint", info: "Always Open", lat: 181, lng: 1396 },
  { type: "extractions", icon: "E", name: "Path To River", info: "Green Flare needs to be shot in the Green Flare Area", lat: 372, lng: 476 },
  { type: "extractions", icon: "E", name: "Safe Room", info: "Turn On The power Switch. Flush the urinal in Burger Spot to reveal the Hidden Locked Panel. Use Object 11SR keycard (#11SR) on the panel to open the Safe Room door" , lat: 519, lng: 1023 },
  { type: "extractions", icon: "E", name: "Smuggler's Tunnel", info: "Interchange underground utility plan required", lat: 649, lng: 309 },
  { type: "extractions", icon: "E", name: "Railway Exfil", info: "Always Open", lat: 926, lng: 570 },

  // EXTRACTIONS SCAV
  { type: "extractions_scav", icon: "ES", name: "Emercom Checkpoint", info: "Always Open", lat: 180, lng: 1400 },
  { type: "extractions_scav", icon: "ES", name: "Smuggler's Tunnel", info: "Interchange underground utility plan required", lat: 650, lng: 300 },
  { type: "extractions_scav", icon: "ES", name: "Railway Exfil", info: "Always Open", lat: 925, lng: 575 },

  // EXTRACTION CO-OP
  { type: "extractions_coop", icon: "EC", name: "Scav Co-op", info: "A SCAV and PMC must extract together", lat: 535, lng: 264 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Streets", info: "Always Open", lat: 924, lng: 786 },
  { type: "transit", icon: "T", name: "Transit To Customs", info: "Marathon mode and a minimum of 1 min in raid for the extract to be active", lat: 17, lng: 772 },

  // BOSS
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 519, lng: 1023 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 349, lng: 1075 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 742, lng: 1045 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 766, lng: 985 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 527, lng: 1200 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 486, lng: 1693 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 724, lng: 145 },
  { type: "boss", icon: "K", name: "Killa", info: "Boss — patrols the mall", lat: 395, lng: 145 },
  { type: "boss", icon: "T", name: "Tagilla", info: "Boss — patrols the mall", lat: 629, lng: 345 },

  // PMC SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 101, lng: 779 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 142, lng: 747 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 373, lng: 771 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 471, lng: 773 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 613, lng: 745 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 673, lng: 676 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 763, lng: 672 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 866, lng: 759 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 900, lng: 754 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 757, lng: 818 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 881, lng: 869 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 894, lng: 977 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 874, lng: 1095 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 864, lng: 1235 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 758, lng: 1361 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 542, lng: 1275 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 461, lng: 1291 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 409, lng: 1323 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 304, lng: 1251 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 256, lng: 1212 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 271, lng: 1435 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 188, lng: 1419 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 182, lng: 1278 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 159, lng: 1115 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 195, lng: 1021 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 62, lng: 910 },

  // QUESTS
  { type: "quests", icon: "Q", name: "Big Sale", info: "Avocado store", lat: 436, lng: 1088, questId: "5ae448e586f7744dcf0c2a67" },
  { type: "quests", icon: "Q", name: "Big Sale", info: "Dino Clothes store", lat: 580, lng: 966, questId: "5ae448e586f7744dcf0c2a67" },
  { type: "quests", icon: "Q", name: "Big Sale", info: "Kostin store", lat: 576, lng: 1099, questId: "5ae448e586f7744dcf0c2a67" },
  { type: "quests", icon: "Q", name: "Big Sale", info: "Top Brand store", lat: 464, lng: 964, questId: "5ae448e586f7744dcf0c2a67" },
  { type: "quests", icon: "Q", name: "Big Sale", info: "Trent store", lat: 624, lng: 1007, questId: "5ae448e586f7744dcf0c2a67" },

  { type: "quests", icon: "Q", name: "Database - Part 2", info: "Find OLI cargo route documents — OLI logistics office key required", lat: 337, lng: 971, questId: "5ae4493d86f7744b8e15aa8f" },

  { type: "quests", icon: "Q", name: "The Blood of War - Part 1", info: "Fuel tank #1", lat: 538, lng: 1280, questId: "5ae448f286f77448d73c0131" },
  { type: "quests", icon: "Q", name: "The Blood of War - Part 1", info: "Fuel tank #2", lat: 142, lng: 1022, questId: "5ae448f286f77448d73c0131" },
  { type: "quests", icon: "Q", name: "The Blood of War - Part 1", info: "Fuel tank #3", lat: 834, lng: 1243, questId: "5ae448f286f77448d73c0131" },
  { type: "quests", icon: "Q", name: "The Blood of War - Part 1", info: "Fuel tank #4", lat: 332, lng: 619, questId: "5ae448f286f77448d73c0131" },

  { type: "quests", icon: "Q", name: "Database - Part 1", info: "GOSHAN manifests", lat: 629, lng: 1144, questId: "5ae4493486f7744efa289417" },
  { type: "quests", icon: "Q", name: "Database - Part 1", info: "IDEA manifests", lat: 771, lng: 1068, questId: "5ae4493486f7744efa289417" },
  { type: "quests", icon: "Q", name: "Database - Part 1", info: "OLI manifests", lat: 299, lng: 1023, questId: "5ae4493486f7744efa289417" },

  { type: "quests", icon: "Q", name: "Minibus", info: "Minibus #1", lat: 162, lng: 952, questId: "5b478d0f86f7744d190d91b5" },
  { type: "quests", icon: "Q", name: "Minibus", info: "Minibus #2", lat: 403, lng: 217, questId: "5b478d0f86f7744d190d91b5" },
  { type: "quests", icon: "Q", name: "Minibus", info: "Minibus #3", lat: 491, lng: 148, questId: "5b478d0f86f7744d190d91b5" },

  { type: "quests", icon: "Q", name: "The Key to Success", info: "Obtain the Clothes design handbook - Part 1", lat: 471, lng: 1676, questId: "5ae4498786f7744bde357695" },
  { type: "quests", icon: "Q", name: "The Key to Success", info: "Obtain the Clothes design handbook - Part 2", lat: 606, lng: 1089, questId: "5ae4498786f7744bde357695" },

  { type: "quests", icon: "Q", name: "Hot Delivery", info: "6B47 and ComTac II", lat: 438, lng: 1118, questId: "5b478b1886f7744d1b23c57d" },
  { type: "quests", icon: "Q", name: "Hot Delivery", info: "Gzhel-K body armors", lat: 504, lng: 881, questId: "5b478b1886f7744d1b23c57d" },

  { type: "quests", icon: "Q", name: "Irresistible", info: "Unlocks the secret container and obtain the lost weapon case — #21WS key required", lat: 187, lng: 922, questId: "671a49f77d49aea42c029b5f" },
];
