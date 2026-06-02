const storylineData = [
  {
    id: "tour",
    chapter: 1,
    title: "Tour",
    icon: "🗺",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary","ending_survived"],
    description: "Escape Ground Zero and establish contact with Tarkov's traders.",
    steps: [
      { id: "tour_1", text: "Escape from Ground Zero,  (tutorial raid)" },
      { id: "tour_2", text: "Talk to Therapist — pay 250,000₽ to unlock Streets of Tarkov" },
      { id: "tour_3", text: "Talk to Fence — scout Interchange and report back (unlocks Skier)" },
      { id: "tour_4", text: "Talk to Skier — hand over 5 Building Materials FIR (unlocks Factory + Mechanic)" },
      { id: "tour_5", text: "Talk to Mechanic — hand over 2 weapons FIR (unlocks Prapor + Woods)" },
      { id: "tour_6", text: "Talk to Skier again — eliminate 3 targets on Woods (unlocks Shoreline + Peacekeeper)" },
      { id: "tour_7", text: "Find the entrance to the Port Terminal on Shoreline" },
      { id: "tour_8", text: "Survive and extract from Shoreline — collect 5 PMC dogtags for Prapor (unlocks Reserve)" },
      { id: "tour_9", text: "Hand over $20,000 to Mechanic (unlocks Lighthouse)" },
      { id: "tour_10", text: "Reach the TerraGroup Secret Facility (Labs) — visit Server Room, Office, and Collector exit" },
    ]
  },
  {
    id: "falling_skies",
    chapter: 2,
    title: "Falling Skies",
    icon: "✈️",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary","ending_survived"],
    description: "Investigate the crashed plane and uncover TerraGroup's secrets.",
    steps: [
      { id: "fs_1", text: "Talk to Mechanic — he mentions a fallen plane on Woods" },
      { id: "fs_2", text: "Locate the crashed plane on Woods" },
      { id: "fs_3", text: "Retrieve the black box from the crash site" },
      { id: "fs_4", text: "Hand over the black box to Mechanic" },
      { id: "fs_5", text: "Investigate the TerraGroup connection with Paradigm Shipping" },
      { id: "fs_6", text: "Complete all Mechanic objectives to finish the chapter" },
    ]
  },
  {
    id: "they_are_already_here",
    chapter: 3,
    title: "They Are Already Here",
    icon: "👥",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary","ending_survived"],
    description: "Uncover the infiltrators operating within Tarkov.",
    steps: [
      { id: "taah_1", text: "Receive intelligence about unknown operatives from Prapor" },
      { id: "taah_2", text: "Investigate PMC activity on Customs" },
      { id: "taah_3", text: "Find and collect evidence of the infiltration" },
      { id: "taah_4", text: "Report findings back to Prapor" },
      { id: "taah_5", text: "Complete all objectives to unlock the next chapter" },
    ]
  },
  {
    id: "batya",
    chapter: 4,
    title: "Batya",
    icon: "🪖",
    requiredFor: ["ending_humanity","ending_darkness"],
    description: "Track down the mysterious figure known as 'Batya'.",
    steps: [
      { id: "batya_1", text: "Receive the tip about Batya from a trader" },
      { id: "batya_2", text: "Search for clues about Batya's location on Reserve" },
      { id: "batya_3", text: "Follow the trail across multiple maps" },
      { id: "batya_4", text: "Confront Batya's associates" },
      { id: "batya_5", text: "Complete the chapter objectives" },
    ]
  },
  {
    id: "accidental_witness",
    chapter: 5,
    title: "Accidental Witness",
    icon: "👁",
    requiredFor: ["ending_humanity","ending_mercenary"],
    description: "You witnessed something you shouldn't have — now you're a target.",
    steps: [
      { id: "aw_1", text: "Discover what you witnessed during a raid" },
      { id: "aw_2", text: "Evade the operatives hunting you" },
      { id: "aw_3", text: "Gather evidence of what you saw" },
      { id: "aw_4", text: "Find an ally who can help you survive" },
      { id: "aw_5", text: "Complete the chapter objectives" },
    ]
  },
  {
    id: "blue_fire",
    chapter: 6,
    title: "Blue Fire",
    icon: "🔵",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary"],
    description: "Investigate the mysterious blue fire phenomenon linked to TerraGroup experiments.",
    steps: [
      { id: "bf_1", text: "Receive intel about the Blue Fire phenomenon" },
      { id: "bf_2", text: "Locate the source of the blue fire on Lighthouse" },
      { id: "bf_3", text: "Collect samples for analysis" },
      { id: "bf_4", text: "Deliver samples to the appropriate trader" },
      { id: "bf_5", text: "Uncover the truth behind TerraGroup's experiments" },
      { id: "bf_6", text: "Complete all chapter objectives" },
    ]
  },
  {
    id: "the_unheard",
    chapter: 7,
    title: "The Unheard",
    icon: "🔇",
    requiredFor: ["ending_humanity"],
    description: "Someone is communicating through hidden channels — find out who.",
    steps: [
      { id: "tu_1", text: "Detect the hidden signal via Intelligence Center level 3" },
      { id: "tu_2", text: "Locate the first signal source on Shoreline" },
      { id: "tu_3", text: "Locate the second signal source on Woods" },
      { id: "tu_4", text: "Decode the messages and identify the sender" },
      { id: "tu_5", text: "Make contact with the mysterious sender" },
      { id: "tu_6", text: "Complete all chapter objectives" },
    ]
  },
  {
    id: "the_labyrinth",
    chapter: 8,
    title: "The Labyrinth",
    icon: "🌀",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary","ending_survived"],
    description: "Navigate the underground TerraGroup network to uncover the final truth.",
    steps: [
      { id: "tl_1", text: "Gain access to the TerraGroup underground facility" },
      { id: "tl_2", text: "Navigate through Labs to find the key data" },
      { id: "tl_3", text: "Retrieve the TerraGroup research files" },
      { id: "tl_4", text: "Survive the encounter with TerraGroup security" },
      { id: "tl_5", text: "Extract with the data and deliver it" },
      { id: "tl_6", text: "Complete all chapter objectives" },
    ]
  },
  {
    id: "the_ticket",
    chapter: 9,
    title: "The Ticket",
    icon: "🎫",
    requiredFor: ["ending_humanity","ending_darkness","ending_mercenary","ending_survived"],
    description: "Your path out of Tarkov — choose your ending wisely.",
    steps: [
      { id: "tt_1", text: "Receive the extraction offer from your contact" },
      { id: "tt_2", text: "Gather the required items for extraction" },
      { id: "tt_3", text: "⚠️ KEY CHOICE — Trust Kerman or go alone?" },
      { id: "tt_4", text: "Complete the final extraction sequence" },
    ],
    endings: [
      {
        id: "ending_humanity",
        icon: "🌟",
        title: "Escaped for Humanity",
        condition: "Trust Kerman completely — share all TerraGroup data publicly",
        description: "You placed your trust in Kerman. The truth about TerraGroup was exposed, corrupt politicians lost their power, and humanity was freed from its chains."
      },
      {
        id: "ending_darkness",
        icon: "🌑",
        title: "Fell into Darkness",
        condition: "Distrust Kerman — hide the data and escape alone",
        description: "You did not believe him. Tarkov fell, madness followed. You escaped but brought nothing but yourself."
      },
      {
        id: "ending_mercenary",
        icon: "💰",
        title: "Mercenary Without Honor",
        condition: "Partial cooperation — incomplete commitment to Kerman",
        description: "You nearly touched the truth but froze halfway. TerraGroup survived and grew stronger. You remain a mercenary bound by debt."
      },
      {
        id: "ending_survived",
        icon: "🏃",
        title: "Simply Survived",
        condition: "Ignore the larger conflict — focus only on escaping",
        description: "You ran, hoping to escape. You broke out, but couldn't truly escape from yourself."
      }
    ]
  }
];

function showStoryline(push = true) {
  currentSection = "storyline";
  if (push) pushHistory("storyline");
  setActiveNav("storyline");
  searchInput.style.display = "none";

  const totalSteps = storylineData.reduce((sum, ch) => sum + ch.steps.length, 0);
  const doneSteps = Object.values(completedStorySteps).filter(Boolean).length;
  const globalPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  content.innerHTML = `
    <h2>📖 Storyline</h2>
    <div class="detail-box" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-weight:700">Overall Progress</span>
        <span style="font-weight:700;color:var(--accent)">${doneSteps} / ${totalSteps} · ${globalPct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${globalPct}%"></div>
      </div>
    </div>
    ${chosenEnding ? `
      <div class="detail-box" style="margin-bottom:16px;border:1px solid var(--accent)">
        <p style="margin:0">🎫 Chosen ending: <strong>${storylineData[8].endings.find(e => e.id === chosenEnding)?.title || "Unknown"}</strong></p>
      </div>
    ` : ""}
  `;

  storylineData.forEach(chapter => {
    const done = chapter.steps.filter(s => completedStorySteps[s.id]).length;
    const total = chapter.steps.length;
    const pct = Math.round((done / total) * 100);
    const isComplete = done === total;

    const isRequired = !chosenEnding || (chapter.requiredFor || []).includes(chosenEnding);
    const isOnPath = chosenEnding && (chapter.requiredFor || []).includes(chosenEnding);

    const card = document.createElement("div");
    card.className = `card ${isComplete ? "quest-complete" : ""} ${!isRequired ? "story-chapter-off-path" : ""}`;
    card.onclick = () => displayChapterDetail(chapter);

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
        <span style="font-size:22px">${chapter.icon}</span>
        <div style="flex:1">
          <h3 style="margin:0">
            ${isComplete ? "✔ " : ""}Chapter ${chapter.chapter} — ${escapeHTML(chapter.title)}
            ${isOnPath ? '<span class="story-path-badge">✓ Your path</span>' : ""}
            ${chosenEnding && !isRequired ? '<span class="story-skip-badge">Not required</span>' : ""}
          </h3>
          <p style="margin:2px 0 0;color:var(--muted);font-size:13px">${escapeHTML(chapter.description)}</p>
        </div>
        <span style="color:var(--accent);font-weight:700">${pct}%</span>
      </div>
      <div class="progress-bar mini-progress">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${done} / ${total} steps</p>
    `;

    content.appendChild(card);
  });
}

function displayChapterDetail(chapter) {
  pushHistory("storyline");
  setActiveNav("storyline");

  const done = chapter.steps.filter(s => completedStorySteps[s.id]).length;
  const total = chapter.steps.length;
  const pct = Math.round((done / total) * 100);

  content.innerHTML = `
    <button class="back-btn" onclick="showStoryline()">← Back</button>
    <div class="quest-detail">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <span style="font-size:32px">${chapter.icon}</span>
        <div>
          <h2 style="margin:0">Chapter ${chapter.chapter} — ${escapeHTML(chapter.title)}</h2>
          <p style="margin:4px 0 0;color:var(--muted)">${escapeHTML(chapter.description)}</p>
        </div>
      </div>

      <div class="detail-box">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-weight:700">Progress</span>
          <span style="color:var(--accent);font-weight:700" id="chapter-progress-label">${done} / ${total}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="chapter-progress-bar" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="detail-box">
        <h3>Steps</h3>
        ${chapter.steps.map(step => {
          const isDone = !!completedStorySteps[step.id];
          const isChoice = step.text?.startsWith("⚠️");
          return `
            <div
              class="objective objective-checkable ${isDone ? "objective-done" : ""} ${isChoice ? "story-choice-step" : ""}"
              id="story-step-${step.id}"
              onclick="toggleStoryStep('${step.id}', '${chapter.id}')"
            >
              <span class="obj-checkbox">${isDone ? "✔" : ""}</span>
              <span class="obj-text">${escapeHTML(step.text)}</span>
            </div>
          `;
        }).join("")}
      </div>

      ${chapter.endings ? `
        <div class="detail-box">
          <h3>🎫 Choose Your Ending</h3>
          <p style="color:var(--muted);font-size:13px;margin-bottom:12px">Once chosen, this is your path out of Tarkov.</p>
          ${chapter.endings.map(ending => `
            <div class="story-ending-card ${chosenEnding === ending.id ? "story-ending-chosen" : ""}" onclick="chooseEnding('${ending.id}')">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <span style="font-size:24px">${ending.icon}</span>
                <div>
                  <strong>${escapeHTML(ending.title)}</strong>
                  ${chosenEnding === ending.id ? ' <span style="color:var(--accent)">✔ Chosen</span>' : ""}
                </div>
              </div>
              <p style="margin:0 0 4px;font-size:12px;color:var(--accent)"><em>${escapeHTML(ending.condition)}</em></p>
              <p style="margin:0;font-size:13px;color:var(--muted)">${escapeHTML(ending.description)}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function toggleStoryStep(stepId, chapterId) {
  completedStorySteps[stepId] = !completedStorySteps[stepId];
  localStorage.setItem("completedStorySteps", JSON.stringify(completedStorySteps));

  const el = document.getElementById(`story-step-${stepId}`);
  if (el) {
    el.classList.toggle("objective-done", completedStorySteps[stepId]);
    const checkbox = el.querySelector(".obj-checkbox");
    if (checkbox) checkbox.textContent = completedStorySteps[stepId] ? "✔" : "";
  }

  const chapter = storylineData.find(c => c.id === chapterId);
  if (chapter) {
    const done = chapter.steps.filter(s => completedStorySteps[s.id]).length;
    const total = chapter.steps.length;
    const pct = Math.round((done / total) * 100);
    const bar = document.getElementById("chapter-progress-bar");
    const label = document.getElementById("chapter-progress-label");
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${done} / ${total}`;
  }
}

function chooseEnding(endingId) {
  if (chosenEnding === endingId) {
    chosenEnding = null;
    localStorage.removeItem("chosenEnding");
  } else {
    chosenEnding = endingId;
    localStorage.setItem("chosenEnding", endingId);
  }
  displayChapterDetail(storylineData[8]);
}
