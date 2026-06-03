const reserveMarkers = [
  // EXTRACTIONS PMC
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
];
