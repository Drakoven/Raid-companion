const streetsMarkers = [
  // EXTRACTIONS PMC
  { type: "extractions", icon: "E", name: "Crash Site", info: "Always Open", lat: 239, lng: 275 },
  { type: "extractions", icon: "E", name: "Collapsed Crane", info: "Always Open", lat: 395, lng: 376 },
  { type: "extractions", icon: "E", name: "Smuggler's Basement", info: "Always Open", lat: 627, lng: 522 },
  { type: "extractions", icon: "E", name: "Expo Checkpoint", info: "Always Open", lat: 794, lng: 371 },
  { type: "extractions", icon: "E", name: "Stylobate Elevator Extract", info: "Third floor, elevator is in the room behind the bar", lat: 878, lng: 741 },
  { type: "extractions", icon: "E", name: "Klimov Street", info: "Green Flare required", lat: 635, lng: 827 },
  { type: "extractions", icon: "E", name: "Sewer River", info: "At the end of the tunnel. Access via the crashed tram to the west", lat: 456, lng: 878 },
  { type: "extractions", icon: "E", name: "Damaged House", info: "At the end of the hallway near the blue light", lat: 315, lng: 862 },
  { type: "extractions", icon: "E", name: "Courtyard", info: "Green smoke must be present for extraction", lat: 149, lng: 760 },
  { type: "extractions", icon: "E", name: "Primorsky Ave Taxi V-EX", info: "The black SUV must be present for extraction. 5000 roubles per player. Max 4 players", lat: 187, lng: 603 },

  // EXTRACTIONS SCAV
  { type: "extractions_scav", icon: "ES", name: "Sewer Manhole", info: "Always Open", lat: 314, lng: 307 },
  { type: "extractions_scav", icon: "ES", name: "Near Kamchatskaya Arch", info: "Always Open", lat: 624, lng: 325 },
  { type: "extractions_scav", icon: "ES", name: "Smuggler's Basement", info: "Always Open", lat: 625, lng: 525 },
  { type: "extractions_scav", icon: "ES", name: "Cardinal Apartment Complex Parking", info: "Underneath the ramp at the shop with the boarded up windows", lat: 852, lng: 495 },
  { type: "extractions_scav", icon: "ES", name: "Klimov Shopping Mall Exfil", info: "In the corner, at the bottom of the stair case, from the food court", lat: 686, lng: 771 },
  { type: "extractions_scav", icon: "ES", name: "Entrance To Catacombs", info: "Head into the apartment block (entrance on northern side), go down the stairs and to the end of the corridor", lat: 423, lng: 861 },
  { type: "extractions_scav", icon: "ES", name: "Ventilation Shaft", info: "Stand next to the square concrete ventilation enclosure protruding from the grass", lat: 228, lng: 733 },

  // EXTRACTION CO-OP
  { type: "extractions_coop", icon: "EC", name: "Pinewood Basement", info: "SCAV + PMC required", lat: 612, lng: 717 },

  // TRANSIT
  { type: "transit", icon: "T", name: "Transit To Labs", info: "Always Open", lat: 592, lng: 378 },
  { type: "transit", icon: "T", name: "Transit To Ground Zero", info: "Always Open", lat: 568, lng: 873 },
  { type: "transit", icon: "T", name: "Transit To Interchange", info: "Always Open", lat: 151, lng: 285 },

  // BOSS
  { type: "boss", icon: "K", name: "Kaban", info: "Boss — patrols the streets", lat: 357, lng: 518 },
  { type: "boss", icon: "K", name: "Kollontay", info: "Boss — patrols the streets", lat: 711, lng: 751 },
  { type: "boss", icon: "K", name: "Kollontay", info: "Boss — patrols the streets", lat: 533, lng: 868 },

  // PMC SPAWN
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 259, lng: 358 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 316, lng: 373 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 367, lng: 380 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 429, lng: 412 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 480, lng: 403 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 498, lng: 357 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 498, lng: 421 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 586, lng: 316 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 589, lng: 336 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 624, lng: 329 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 550, lng: 474 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 614, lng: 481 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 633, lng: 545 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 612, lng: 555 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 723, lng: 344 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 786, lng: 349 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 815, lng: 420 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 853, lng: 490 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 822, lng: 554 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 825, lng: 614 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 802, lng: 636 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 749, lng: 652 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 711, lng: 715 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 747, lng: 761 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 726, lng: 763 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 862, lng: 860 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 594, lng: 630 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 615, lng: 725 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 546, lng: 701 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 567, lng: 786 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 486, lng: 772 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 485, lng: 817 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 428, lng: 860 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 382, lng: 838 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 318, lng: 802 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 309, lng: 847 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 315, lng: 666 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 266, lng: 804 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 252, lng: 744 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 238, lng: 791 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 183, lng: 783 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 191, lng: 766 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 196, lng: 668 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 189, lng: 636 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 242, lng: 564 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 201, lng: 495 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 225, lng: 436 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 201, lng: 387 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 129, lng: 309 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 77, lng: 333 },
  { type: "spawn", icon: "SP", name: "PMC Spawn", info: "PMC spawn point", lat: 63, lng: 310 },

  // QUESTS
  { type: "quests", icon: "Q", name: "The Delicious Sausage", info: "Goshan store in Concordia", lat: 268, lng: 311, questId: "63a88045abf76d719f42d715" },
  { type: "quests", icon: "Q", name: "The Delicious Sausage", info: "Shestyorochka Store", lat: 486, lng: 819, questId: "63a88045abf76d719f42d715" },
  { type: "quests", icon: "Q", name: "The Delicious Sausage", info: "Sparja Store Pinwood Hotel", lat: 512, lng: 681, questId: "63a88045abf76d719f42d715" },
  { type: "quests", icon: "Q", name: "The Delicious Sausage", info: "Sparja Store Primorsky Ave", lat: 361, lng: 436, questId: "63a88045abf76d719f42d715" },

  { type: "quests", icon: "Q", name: "Cease Fire!", info: "RSP-30 reactive signal cartridge (Green) or 26x75mm green flare cartridge fired from a signal pistol", lat: 644, lng: 789, questId: "639136e84ed9512be67647db" },

  { type: "quests", icon: "Q", name: "Population Census", info: "First and second floor office. Multiple spawn including on the desk or brown shelves. Second floor under the fallen bookcase", lat: 545, lng: 514, questId: "639135d89444fb141f4e6eea" },

  { type: "quests", icon: "Q", name: "Pets Won't Need It - Part 1", info: "Head upstairs and find the animal cage with the hanging rubber chicken", lat: 493, lng: 364, questId: "64f731ab83cfca080a361e42" },
  { type: "quests", icon: "Q", name: "Pets Won't Need It - Part 1", info: "X-Ray Room Key required", lat: 572, lng: 224, questId: "64f731ab83cfca080a361e42" },

  { type: "quests", icon: "Q", name: "Pets Won't Need It - Part 2", info: "Pharmacy #1", lat: 516, lng: 557, questId: "6573387d0b26ed4fde798de3" },
  { type: "quests", icon: "Q", name: "Pets Won't Need It - Part 2", info: "Pharmacy #3", lat: 968, lng: 508, questId: "6573387d0b26ed4fde798de3" },

  { type: "quests", icon: "Q", name: "You've Got Mail", info: "4 possible spawns inside the post office", lat: 553, lng: 560, questId: "6391359b9444fb141f4e6ee6" },

  { type: "quests", icon: "Q", name: "Broadcast - Part 2", info: "Inside the Primorsky avenue Sparja grocery store — behind the deli counter", lat: 345, lng: 436, questId: "63913715f8e5dd32bf4e3aaa" },

  { type: "quests", icon: "Q", name: "Dangerous Road", info: "Extract through the Primorsky Ave Taxi V-Ex to complete the quest", lat: 195, lng: 608, questId: "63ab180c87413d64ae0ac20a" },

  { type: "quests", icon: "Q", name: "The Door", info: "Signal jamming — Rusted bloody key required", lat: 623, lng: 281, questId: "64ee9df4496db64f9b7a4432" },
  { type: "quests", icon: "Q", name: "The Door", info: "Camera #1 — Rusted bloody key required", lat: 621, lng: 276, questId: "64ee9df4496db64f9b7a4432" },
  { type: "quests", icon: "Q", name: "The Door", info: "Camera #2 — Rusted bloody key required", lat: 592, lng: 286, questId: "64ee9df4496db64f9b7a4432" },

  { type: "quests", icon: "Q", name: "Urban Medicine", info: "Found inside the Chemical Laboratory at the LexOs garage. Multiple spawn points throughout the lab", lat: 339, lng: 502, questId: "639135e0fa894f0a866afde6" },

  { type: "quests", icon: "Q", name: "Revision - Streets of Tarkov", info: "Stryker #1", lat: 213, lng: 748, questId: "639135f286e646067c176a87" },
  { type: "quests", icon: "Q", name: "Revision - Streets of Tarkov", info: "Stryker #2", lat: 246, lng: 445, questId: "639135f286e646067c176a87" },
  { type: "quests", icon: "Q", name: "Revision - Streets of Tarkov", info: "Stryker #3", lat: 643, lng: 598, questId: "639135f286e646067c176a87" },

  { type: "quests", icon: "Q", name: "Audit", info: "Found inside an office on the 2nd floor", lat: 441, lng: 1003, questId: "638fcd23dc65553116701d33" },

  { type: "quests", icon: "Q", name: "Glory to CPSU - Part 1", info: "Locate the apartment of Prapor's friend. Survive and extract", lat: 432, lng: 133, questId: "639135b04ed9512be67647d7" },

  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 199, lng: 430, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 238, lng: 270, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 856, lng: 518, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 788, lng: 485, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 690, lng: 510, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 622, lng: 487, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 468, lng: 654, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 424, lng: 462, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 285, lng: 364, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Can spawn in passenger seat, back of ambulance or close to it on the ground", lat: 318, lng: 611, questId: "64f3176921045e77405d63b5" },
  { type: "quests", icon: "Q", name: "Ambulances Again", info: "Extract through Primorsky Ave Taxi V-Ex [PMC] with the phone", lat: 181, lng: 608, questId: "64f3176921045e77405d63b5" },

  { type: "quests", icon: "Q", name: "Green Corridor", info: "Convoy location", lat: 425, lng: 585, questId: "639136d68ba6894d155e77cf" },
  { type: "quests", icon: "Q", name: "Green Corridor", info: "Ambush spot", lat: 396, lng: 528, questId: "639136d68ba6894d155e77cf" },

  { type: "quests", icon: "Q", name: "Watching You", info: "Hotel Room 215 Key required. Flash drive found in room 215 of the Pinewood Hotel (2nd floor)", lat: 612, lng: 896, questId: "639136fa9444fb141f4e6eee" },

  { type: "quests", icon: "Q", name: "Broadcast - Part 3", info: "Inside the Dostoevsky Restaurant, immediately on the right as you enter from Malevicha St.", lat: 612, lng: 896, questId: "63a511ea30d85e10e375b045" },

  { type: "quests", icon: "Q", name: "Ballet Lover", info: "The Primorsky 48 Apartment 10 (the Balletmeister's Apartment) is accessible via the Skybridge to the north", lat: 522, lng: 51, questId: "639135a7e705511c8a4a1b78" },

  { type: "quests", icon: "Q", name: "Audiophile", info: "10 possible locations for the guitar pick (6 in the music room and 4 in the bedroom)", lat: 525, lng: 64, questId: "639135bbc115f907b14700a6" },

  { type: "quests", icon: "Q", name: "Gendarmerie - Tickets, Please", info: "Eliminate any 25 targets at the Rodina cinema while using SMGs", lat: 254, lng: 849, questId: "64e7b9a4aac4cd0a726562cb" },

  { type: "quests", icon: "Q", name: "Gendarmerie - District Patrol", info: "Eliminate any 30 targets at the Cardinal apartment complex while using Assault rifles or Assault carbines", lat: 800, lng: 460, questId: "64e7b9bffd30422ed03dad38" },

  { type: "quests", icon: "Q", name: "Glory to CPSU - Part 2", info: "The journal has 4 spawn locations in this room", lat: 639, lng: 337, questId: "64f5aac4b63b74469b6c14c2" },

  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 1", info: "Chef's diary — first spawn", lat: 798, lng: 729, questId: "64f5e20652fc01298e2c61e3" },
  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 1", info: "Chef's diary — second spawn", lat: 871, lng: 740, questId: "64f5e20652fc01298e2c61e3" },

  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 2", info: "Secret ingredient — first spawn", lat: 736, lng: 556, questId: "64f6aafd67e11a7c6206e0d0" },
  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 2", info: "Secret ingredient — second spawn", lat: 796, lng: 642, questId: "64f6aafd67e11a7c6206e0d0" },
  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 2", info: "Secret ingredient — third spawn", lat: 758, lng: 537, questId: "64f6aafd67e11a7c6206e0d0" },
  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 2", info: "Secret ingredient — fourth spawn", lat: 796, lng: 630, questId: "64f6aafd67e11a7c6206e0d0" },
  { type: "quests", icon: "Q", name: "Beyond the Red Meat - Part 2", info: "Secret ingredient — fifth spawn", lat: 803, lng: 630, questId: "64f6aafd67e11a7c6206e0d0" },

  { type: "quests", icon: "Q", name: "Properties All Around", info: "Real estate office room key required", lat: 198, lng: 656, questId: "6573397ef3f8344c4575cd87" },

  { type: "quests", icon: "Q", name: "The Huntsman Path - Administrator", info: "Deal with the looters in the Pinewood Hotel. Shoot a yellow flare in the hotel's courtyard", lat: 568, lng: 678, questId: "639136df4b15ca31f76bc31f" },

  { type: "quests", icon: "Q", name: "The Huntsman Path - Crooked Cop", info: "Kill Kollontay and his guards and turn in his police baton", lat: 710, lng: 750, questId: "6578eb36e5020875d64645cd" },

  { type: "quests", icon: "Q", name: "Developer's Secrets - Part 1", info: "Negotiation room key required", lat: 503, lng: 424, questId: "65733403eefc2c312a759ddb" },

  { type: "quests", icon: "Q", name: "Developer's Secrets - Part 2", info: "Relaxation room key required", lat: 359, lng: 825, questId: "6573382e557ff128bf3da536" },

  { type: "quests", icon: "Q", name: "Surveillance", info: "Concordia Security Room Key required to access", lat: 31, lng: 376, questId: "639135e8c115f907b14700aa" },

  { type: "quests", icon: "Q", name: "Broadcast - Part 4", info: "Abandoned Factory Marked Key required", lat: 392, lng: 956, questId: "6391372c8ba6894d155e77d7" },

  { type: "quests", icon: "Q", name: "Key to the City", info: "Locate and obtain the souvenir key to the city on Streets of Tarkov", lat: 622, lng: 340, questId: "666314c5a9290f9e0806cca5" },

  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 778, lng: 349, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 702, lng: 497, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 711, lng: 512, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 897, lng: 600, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 872, lng: 591, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 754, lng: 635, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 752, lng: 656, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 695, lng: 721, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 684, lng: 778, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 731, lng: 769, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 820, lng: 844, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 430, lng: 539, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 286, lng: 304, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 199, lng: 659, questId: "6572e876dc0d635f633a5714" },
  { type: "quests", icon: "Q", name: "Pyramid Scheme", info: "ATM", lat: 199, lng: 653, questId: "6572e876dc0d635f633a5714" },

  { type: "quests", icon: "Q", name: "Debtor", info: "The Debtor's body is found lying inside Hotel Room 206, on the 2nd floor of the Pinewood Hotel", lat: 625, lng: 910, questId: "639dbaf17c898a131e1cffff" },

  { type: "quests", icon: "Q", name: "Dandies", info: "Requires: Bomber beanie, RayBench Hipster Reserve sunglasses and kill 30 enemies", lat: 244, lng: 375, questId: "65734c186dc1e402c80dc19e" },

  { type: "quests", icon: "Q", name: "House Arrest - Part 1", info: "Iron gate key required", lat: 431, lng: 69, questId: "639135c3744e452011470807" },

  { type: "quests", icon: "Q", name: "House Arrest - Part 2", info: "The Chekannaya 15 Apartment Key is required", lat: 431, lng: 159, questId: "639135cd8ba6894d155e77cb" },

  { type: "quests", icon: "Q", name: "Missing Informant", info: "Complete previous Lightkeeper quest: Information Source", lat: 262, lng: 737, questId: "63966fbeea19ac7ed845db2e" },

  { type: "quests", icon: "Q", name: "Trouble in the Big City", info: "MS2000 marker and Yellow Flare required", lat: 450, lng: 591, questId: "63967028c4a91c5cb76abd81" },

  { type: "quests", icon: "Q", name: "Your Car Needs a Service", info: "Car dealership director's office room key + Car dealership closed section key required", lat: 356, lng: 315, questId: "639135534b15ca31f76bc317" },
];
