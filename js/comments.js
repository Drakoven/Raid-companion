// ================================
//  COMMENTS — Raid Companion
// ================================

async function loadComments(questId) {
  const user = getCurrentUser();

  // Charger les commentaires
  try {
    const res = await fetch(`comments.php?quest_id=${encodeURIComponent(questId)}`);
    const comments = await res.json();

    const list = document.getElementById("comments-list");
    if (!list) return;

    if (comments.length === 0) {
      list.innerHTML = `<p style="color:var(--muted); font-size:13px;">Aucun commentaire pour l'instant. Sois le premier !</p>`;
    } else {
      list.innerHTML = comments.map(c => `
        <div class="comment-card" id="comment-${c.id}">
          <div class="comment-header">
            <span class="comment-username">👤 ${escapeHTML(c.username)}</span>
            ${c.role === "admin" ? '<span style="font-size:11px; background:#4a0080; color:#e0b0ff; padding:2px 8px; border-radius:20px; font-weight:700;">👑 Admin</span>' : c.role === "moderateur" ? '<span style="font-size:11px; background:#1a3a5c; color:#7ec8f7; padding:2px 8px; border-radius:20px; font-weight:700;">🛡️ Modérateur</span>' : ""}
            <span class="comment-date">${new Date(c.created_at).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}</span>
            ${user && (user.role === "admin" || user.role === "moderateur") ? `
              <button onclick="deleteComment(${c.id}, '${escapeHTML(questId)}')" style="padding:2px 8px; font-size:11px; background:var(--danger); border-radius:6px; color:#fff; min-height:unset;">🗑</button>
            ` : ""}
          </div>
          <p class="comment-text">${escapeHTML(c.contenu)}</p>
        </div>
      `).join("");
    }

    // Afficher le formulaire
    const form = document.getElementById("comment-form");
    if (!form) return;

    if (user) {
      const roleBadge = user.role === "admin" ? "👑 Admin" : user.role === "moderateur" ? "🛡️ Modérateur" : "👤 Membre";
      form.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
          <span style="font-size:13px; color:var(--accent); font-weight:700;">${escapeHTML(user.username)}</span>
          <span style="font-size:11px; background:var(--surface-3); padding:2px 8px; border-radius:20px; color:var(--muted);">${roleBadge}</span>
        </div>
        <textarea id="comment-input" rows="3" placeholder="Écris ton commentaire..." style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:14px; resize:vertical;"></textarea>
        <button onclick="submitComment('${escapeHTML(questId)}')" style="margin-top:8px; padding:10px 20px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:14px;">
          Envoyer
        </button>
      `;
    } else {
      form.innerHTML = `
        <p style="color:var(--muted); font-size:13px; text-align:center;">
          <span onclick="showAuthModal()" style="color:var(--accent); cursor:pointer; text-decoration:underline;">Connecte-toi</span> pour laisser un commentaire.
        </p>
      `;
    }

  } catch(e) {
    console.error("Erreur chargement commentaires", e);
  }
}

async function submitComment(questId) {
  const user = getCurrentUser();
  if (!user) return;

  const input = document.getElementById("comment-input");
  const contenu = input.value.trim();

  if (!contenu) return;

  try {
    const res = await fetch("comments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: questId, user_id: user.id, contenu })
    });
    const data = await res.json();

    if (data.succès) {
      input.value = "";
      loadComments(questId);
    }
  } catch(e) {
    console.error("Erreur envoi commentaire", e);
  }
}

async function deleteComment(commentId, questId) {
  if (!confirm("Supprimer ce commentaire ?")) return;

  try {
    const res = await fetch("comments.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId })
    });
    const data = await res.json();
    if (data.succès) loadComments(questId);
  } catch(e) {
    console.error("Erreur suppression commentaire", e);
  }
}