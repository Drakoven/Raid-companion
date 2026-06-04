const lighthouseMarkers = [
  // EXTRACTIONS PMC
  { type: "extractions", icon: "E", name: "Northern Checkpoint", info: "Always Open", lat: 1072, lng: 254 },
  { type: "extractions", icon: "E", name: "Armored Train", info: "Always Open. Get inside the train for extraction", lat: 972, lng: 326 },
  { type: "extractions", icon: "E", name: "Road to Military Base V-EX", info: "Always Open. The black SUV must be present for extraction. 5,000 Roubles per player", lat: 934, lng: 548 },
  { type: "extractions", icon: "E", name: "Passage by The Lake", info: "Minefield mini map required", lat: 791, lng: 575 },
  { type: "extractions", icon: "E", name: "Path to Shoreline", info: "Always Open. Head towards the buildings in the distance to initiate extraction", lat: 500, lng: 573 },
  { type: "extractions", icon: "E", name: "Mountain Pass", info: "Always Open. Paracord + Red Rebel Ice pick + no vest armor equipped required", lat: 413, lng: 441 },
  { type: "extractions", icon: "E", name: "Southern Road", info: "Always Open", lat: 133, lng: 513 },

  // EXTRACTIONS SCAV
  { type: "extractions_scav", icon: "ES", name: "Armored Train", info: "Always Open. Get inside the train for extraction", lat: 975, lng: 325 },
  { type: "extractions_scav", icon: "ES", name: "Industrial Zone Gates", info: "Always Open", lat: 939, lng: 432 },
  { type: "extractions_scav", icon: "ES", name: "Passage by The Lake", info: "Minefield mini map required", lat: 792, lng: 570 },
  { type: "extractions_scav", icon: "ES", name: "Path to Shoreline", info: "Always Open. Head towards the buildings in the distance to initiate extraction", lat: 505, lng: 575 },
  { type: "extractions_scav", icon: "ES", name: "Scav Hideout at the Grotto", info: "Always Open. Get around the large rock and into the alcove", lat: 736, lng: 207 },
  { type: "extractions_scav", icon: "ES", name: "Southern Road Landslide", info: "Always Open", lat: 122, lng: 510 },
  { type: "extractions_scav", icon: "ES", name: "Hideout Under The Landing Stage", info: "Always Open. Under the building, close to the western pier", lat: 222, lng: 237 },

  // EXTRACTION CO-OP
  { type: "extractions_coop", icon: "EC", name: "Side Tunnel", info: "Friendly PMC/SCAV required", lat: 200, lng: 372 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Woods", info: "Always Open", lat: 1044, lng: 260 },
  { type: "transit", icon: "T", name: "Transit To Reserve", info: "Always Open", lat: 936, lng: 533 },
  { type: "transit", icon: "T", name: "Transit To Shoreline", info: "Always Open", lat: 502, lng: 537 },

  // GOONS
  { type: "goons", icon: "G", name: "The Goons", info: "Random spawn zone", lat: 457, lng: 398 },
  { type: "goons", icon: "G", name: "The Goons", info: "Random spawn zone", lat: 710, lng: 464 },
  { type: "goons", icon: "G", name: "The Goons", info: "Random spawn zone", lat: 909, lng: 402 },
  { type: "goons", icon: "G", name: "The Goons", info: "Random spawn zone", lat: 80, lng: 71 },

  // ROGUES
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 710, lng: 300 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 712, lng: 336 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 771, lng: 379 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 825, lng: 288 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 822, lng: 304 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 812, lng: 147 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 845, lng: 138 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 910, lng: 355 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 901, lng: 427 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 900, lng: 600 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 885, lng: 599 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 886, lng: 642 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 852, lng: 630 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 833, lng: 628 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 814, lng: 634 },
  { type: "boss", icon: "R", name: "Rogues", info: "Rogue patrol zone", lat: 849, lng: 440 },

  // BOSS
  { type: "boss", icon: "Z", name: "Zryachiy", info: "Boss — guards the lighthouse", lat: 95, lng: 65 },

  // PMC SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 1029, lng: 237 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 753, lng: 592 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 695, lng: 610 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 656, lng: 628 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 613, lng: 632 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 635, lng: 541 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 540, lng: 481 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 498, lng: 449 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 500, lng: 339 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 514, lng: 251 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 360, lng: 249 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 266, lng: 283 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 243, lng: 447 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 200, lng: 351 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 118, lng: 266 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 95, lng: 432 },

  // QUESTS
  { type: "quests", icon: "Q", name: "Cargo X - Part 4", info: "Find the wooden box labeled 'TerraGroup'", lat: 379, lng: 240, questId: "61958c366726521dd96828ec" },

  { type: "quests", icon: "Q", name: "Broadcast - Part 1", info: "Operating room key required", lat: 838, lng: 308, questId: "626bd75e47ea7f506e5493c5" },

  { type: "quests", icon: "Q", name: "Revision - Lighthouse", info: "First BRDM — inspect and mark", lat: 748, lng: 320, questId: "6179b4d1bca27a099552e04e" },
  { type: "quests", icon: "Q", name: "Revision - Lighthouse", info: "Second BRDM — inspect and mark", lat: 875, lng: 374, questId: "6179b4d1bca27a099552e04e" },
  { type: "quests", icon: "Q", name: "Revision - Lighthouse", info: "First Stryker — inspect and mark", lat: 75, lng: 290, questId: "6179b4d1bca27a099552e04e" },
  { type: "quests", icon: "Q", name: "Revision - Lighthouse", info: "Second Stryker — inspect and mark", lat: 401, lng: 356, questId: "6179b4d1bca27a099552e04e" },

  { type: "quests", icon: "Q", name: "Overpopulation", info: "Kill 12 scavs around the resort or the chalet", lat: 437, lng: 398, questId: "6179aff8f57fb279792c60a1" },

  { type: "quests", icon: "Q", name: "Corporate Secrets", info: "Pumping station operation area", lat: 837, lng: 165, questId: "6179b3bdc7560e13d23eeb8d" },
  { type: "quests", icon: "Q", name: "Corporate Secrets", info: "Waterpump operation data", lat: 899, lng: 573, questId: "6179b3bdc7560e13d23eeb8d" },

  { type: "quests", icon: "Q", name: "Seaside Vacation", info: "On the upper floor in the bedroom, on the ground under the bed next to the window", lat: 499, lng: 224, questId: "6179ad56c760af5ad2053587" },

  { type: "quests", icon: "Q", name: "Easy Job - Part 1", info: "Locate and mark the helicopter. Survive and extract", lat: 777, lng: 397, questId: "6179ac7511973d018217d0b9" },

  { type: "quests", icon: "Q", name: "Easy Job - Part 2", info: "Get 10 kills around the helicopter area. Rogues, Scavs and PMCs count. This will take several runs", lat: 776, lng: 387, questId: "6179acbdc760af5ad2053585" },

  { type: "quests", icon: "Q", name: "Reconnaissance", info: "Recon the roof of the first office building — all roofs must be visited in one raid", lat: 831, lng: 144, questId: "626bd75c71bd851e971b82a5" },
  { type: "quests", icon: "Q", name: "Reconnaissance", info: "Recon the roof of the second office building — all roofs must be visited in one raid", lat: 892, lng: 632, questId: "626bd75c71bd851e971b82a5" },
  { type: "quests", icon: "Q", name: "Reconnaissance", info: "Recon the roof of the third office building — all roofs must be visited in one raid", lat: 838, lng: 630, questId: "626bd75c71bd851e971b82a5" },

  { type: "quests", icon: "Q", name: "The Hermit", info: "The message is tucked under the bottom of the door to the cabin", lat: 627, lng: 498, questId: "61904daa7d0d857927447b9c" },

  { type: "quests", icon: "Q", name: "Long Road", info: "Kill 4 Scavs anywhere along the main highway south of this marker", lat: 643, lng: 340, questId: "6193850f60b34236ee0483de" },

  { type: "quests", icon: "Q", name: "Ask for Directions", info: "Locate and mark the first section of the cliff path with an MS2000 Marker", lat: 410, lng: 425, questId: "674492b6909d2013670a347a" },
  { type: "quests", icon: "Q", name: "Ask for Directions", info: "Locate and mark the second section of the cliff path with an MS2000 Marker", lat: 443, lng: 442, questId: "674492b6909d2013670a347a" },
  { type: "quests", icon: "Q", name: "Ask for Directions", info: "Locate and mark the third section of the cliff path with an MS2000 Marker", lat: 489, lng: 450, questId: "674492b6909d2013670a347a" },
  { type: "quests", icon: "Q", name: "Ask for Directions", info: "Locate and mark the fourth section of the cliff path with an MS2000 Marker", lat: 525, lng: 447, questId: "674492b6909d2013670a347a" },

  { type: "quests", icon: "Q", name: "Energy Crisis", info: "Fuel Tank", lat: 1027, lng: 408, questId: "6179b3a12153c15e937d52bc" },
  { type: "quests", icon: "Q", name: "Energy Crisis", info: "Tanker Truck #1", lat: 994, lng: 379, questId: "6179b3a12153c15e937d52bc" },
  { type: "quests", icon: "Q", name: "Energy Crisis", info: "Tanker Truck #2", lat: 818, lng: 435, questId: "6179b3a12153c15e937d52bc" },
  { type: "quests", icon: "Q", name: "Energy Crisis", info: "Tanker Truck #3", lat: 693, lng: 309, questId: "6179b3a12153c15e937d52bc" },

  { type: "quests", icon: "Q", name: "Lost Contact", info: "Find the lost group in the chalet area", lat: 324, lng: 376, questId: "6179afd0bca27a099552e040" },

  { type: "quests", icon: "Q", name: "Drug Trafficking", info: "Enter the lab through the open green shipping container to the west", lat: 973, lng: 406, questId: "626bd75b05f287031503c7f6" },

  { type: "quests", icon: "Q", name: "Missing Cargo", info: "Locate the crashed helicopter", lat: 212, lng: 421, questId: "6179b4f16e9dd54ac275e407" },
  { type: "quests", icon: "Q", name: "Missing Cargo", info: "Locate the crashed helicopter and take the intelligence folder on the back corner of the dining room on the third floor", lat: 351, lng: 408, questId: "6179b4f16e9dd54ac275e407" },

  { type: "quests", icon: "Q", name: "Knock-Knock", info: "Bring the Digital secure DSP radio transmitter to the Lighthouse bridge", lat: 63, lng: 240, questId: "625d7005a4eb80027c4f2e09" },

  { type: "quests", icon: "Q", name: "Top Secret", info: "Locate the radar station commandant office — Radar station commandant room key required", lat: 45, lng: 94, questId: "626bd75d5bef5d7d590bd415" },
];
