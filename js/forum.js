// ================================
//  FORUM — Raid Companion
// ================================

let currentCategory = null;
let currentTopic = null;

async function showForum(push = true) {
  if (push) pushHistory("forum");
  setActiveNav("forum");

  content.innerHTML = `<p style="color:var(--muted); text-align:center; margin-top:40px;">Chargement du forum...</p>`;

  try {
    const res = await fetch("forum.php?action=categories");
    const categories = await res.json();

    content.innerHTML = `
      <h2 style="color:var(--accent); margin-bottom:20px;">💬 Forum</h2>
      <div id="forum-categories">
        ${categories.map(cat => `
          <div class="card forum-category-card" onclick="showForumCategory(${cat.id}, '${escapeHTML(cat.icone)} ${escapeHTML(cat.nom)}')">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:28px;">${cat.icone}</span>
              <div style="flex:1;">
                <h3 style="margin:0 0 4px;">${escapeHTML(cat.nom)}</h3>
                <p style="margin:0; font-size:13px;">${escapeHTML(cat.description)}</p>
              </div>
              <span style="font-size:13px; color:var(--muted); white-space:nowrap;">${cat.nb_topics} sujet${cat.nb_topics != 1 ? 's' : ''}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch(e) {
    content.innerHTML = `<p style="color:var(--danger);">Erreur de chargement du forum.</p>`;
  }
}

async function showForumCategory(categoryId, categoryName) {
  currentCategory = categoryId;
  pushHistory("forum-category", { categoryId, categoryName });
  setActiveNav("forum");

  content.innerHTML = `<p style="color:var(--muted); text-align:center; margin-top:40px;">Chargement...</p>`;

  try {
    const res = await fetch(`forum.php?action=topics&category_id=${categoryId}`);
    const topics = await res.json();
    const user = getCurrentUser();

    content.innerHTML = `
      <button class="back-btn" onclick="showForum()">← Retour au forum</button>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
        <h2 style="color:var(--accent); margin:0;">${escapeHTML(categoryName)}</h2>
        ${user ? `<button onclick="showCreateTopic(${categoryId}, '${escapeHTML(categoryName)}')" style="padding:10px 16px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:14px; min-height:unset;">+ Nouveau sujet</button>` : ""}
      </div>

      ${!user ? `<p style="color:var(--muted); font-size:13px; text-align:center; margin-bottom:16px;"><span onclick="showAuthModal()" style="color:var(--accent); cursor:pointer; text-decoration:underline;">Connecte-toi</span> pour créer un sujet.</p>` : ""}

      ${topics.length === 0 ? `
        <div class="detail-box" style="text-align:center; padding:30px;">
          <p style="color:var(--muted);">Aucun sujet pour l'instant.<br>Sois le premier à en créer un !</p>
        </div>
      ` : topics.map(t => `
        <div class="card" onclick="showForumTopic(${t.id})">
          <div style="display:flex; align-items:flex-start; gap:10px;">
            <div style="flex:1;">
              <h3 style="margin:0 0 6px;">${escapeHTML(t.titre)}</h3>
              <p style="margin:0; font-size:12px;">
                👤 ${escapeHTML(t.username)}
                ${t.role === "admin" ? '<span style="font-size:11px; background:#4a0080; color:#e0b0ff; padding:1px 6px; border-radius:20px; margin-left:4px;">👑 Admin</span>' : t.role === "moderateur" ? '<span style="font-size:11px; background:#1a3a5c; color:#7ec8f7; padding:1px 6px; border-radius:20px; margin-left:4px;">🛡️ Modo</span>' : ""}
                · ${new Date(t.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <span style="font-size:12px; color:var(--muted); white-space:nowrap;">💬 ${t.nb_replies}</span>
          </div>
        </div>
      `).join("")}
    `;
  } catch(e) {
    content.innerHTML = `<p style="color:var(--danger);">Erreur de chargement.</p>`;
  }
}

function showCreateTopic(categoryId, categoryName) {
  pushHistory("forum-create", { categoryId, categoryName });
  setActiveNav("forum");

  content.innerHTML = `
    <button class="back-btn" onclick="showForumCategory(${categoryId}, '${escapeHTML(categoryName)}')">← Retour</button>
    <h2 style="color:var(--accent); margin-bottom:20px;">✏️ Nouveau sujet</h2>

    <div class="detail-box">
      <input type="text" id="topic-titre" placeholder="Titre du sujet..." style="width:100%; padding:12px; margin-bottom:12px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:14px;" />
      <textarea id="topic-contenu" rows="6" placeholder="Décris ta question ou ton sujet..." style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:14px; resize:vertical;"></textarea>
      <div id="topic-msg" style="display:none; padding:10px; border-radius:8px; margin-top:10px; background:#0f3460; text-align:center; font-size:13px;"></div>
      <button onclick="submitTopic(${categoryId}, '${escapeHTML(categoryName)}')" style="margin-top:12px; width:100%; padding:14px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:15px;">
        Publier le sujet
      </button>
    </div>
  `;
}

async function submitTopic(categoryId, categoryName) {
  const user = getCurrentUser();
  if (!user) return;

  const titre = document.getElementById("topic-titre").value.trim();
  const contenu = document.getElementById("topic-contenu").value.trim();

  if (!titre || !contenu) {
    const msg = document.getElementById("topic-msg");
    msg.textContent = "❌ Remplis tous les champs.";
    msg.style.display = "block";
    return;
  }

  const res = await fetch("forum.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_topic", category_id: categoryId, user_id: user.id, titre, contenu })
  });
  const data = await res.json();

  if (data.succès) {
    showForumTopic(data.id);
  }
}

async function showForumTopic(topicId) {
  currentTopic = topicId;
  pushHistory("forum-topic", { topicId });
  setActiveNav("forum");

  content.innerHTML = `<p style="color:var(--muted); text-align:center; margin-top:40px;">Chargement...</p>`;

  try {
    const res = await fetch(`forum.php?action=topic&topic_id=${topicId}`);
    const data = await res.json();
    const { topic, replies } = data;
    const user = getCurrentUser();

    const roleBadge = (role) => {
      if (role === "admin") return '<span style="font-size:11px; background:#4a0080; color:#e0b0ff; padding:1px 6px; border-radius:20px; margin-left:4px;">👑 Admin</span>';
      if (role === "moderateur") return '<span style="font-size:11px; background:#1a3a5c; color:#7ec8f7; padding:1px 6px; border-radius:20px; margin-left:4px;">🛡️ Modo</span>';
      return "";
    };

    const canDelete = user && (user.role === "admin" || user.role === "moderateur");

    content.innerHTML = `
      <button class="back-btn" onclick="showForumCategory(${topic.category_id}, '')">← Retour</button>

      <div class="detail-box" style="border-left: 4px solid var(--accent);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <h2 style="color:var(--accent); margin:0; flex:1;">${escapeHTML(topic.titre)}</h2>
          ${canDelete ? `<button onclick="deleteTopic(${topic.id}, ${topic.category_id})" style="padding:4px 10px; font-size:12px; background:var(--danger); border-radius:8px; color:#fff; min-height:unset; margin-left:10px;">🗑 Supprimer</button>` : ""}
        </div>
        <p style="font-size:12px; color:var(--muted); margin-bottom:12px;">
          👤 ${escapeHTML(topic.username)} ${roleBadge(topic.role)}
          · ${new Date(topic.created_at).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
        </p>
        <p style="line-height:1.6; white-space:pre-wrap;">${escapeHTML(topic.contenu)}</p>
      </div>

      <h3 style="color:var(--accent); margin:20px 0 12px;">💬 Réponses (${replies.length})</h3>

      <div id="replies-list">
        ${replies.length === 0 ? `<p style="color:var(--muted); font-size:13px;">Aucune réponse pour l'instant. Sois le premier !</p>` :
          replies.map(r => `
            <div class="comment-card" id="reply-${r.id}">
              <div class="comment-header">
                <span class="comment-username">👤 ${escapeHTML(r.username)}</span>
                ${roleBadge(r.role)}
                <span class="comment-date">${new Date(r.created_at).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}</span>
                ${canDelete ? `<button onclick="deleteReply(${r.id}, ${topicId})" style="padding:2px 8px; font-size:11px; background:var(--danger); border-radius:6px; color:#fff; min-height:unset;">🗑</button>` : ""}
              </div>
              <p class="comment-text" style="white-space:pre-wrap;">${escapeHTML(r.contenu)}</p>
            </div>
          `).join("")
        }
      </div>

      <div class="detail-box" style="margin-top:20px;">
        ${user ? `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <span style="font-size:13px; color:var(--accent); font-weight:700;">${escapeHTML(user.username)}</span>
            ${roleBadge(user.role)}
          </div>
          <textarea id="reply-input" rows="4" placeholder="Ta réponse..." style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:14px; resize:vertical;"></textarea>
          <button onclick="submitReply(${topicId})" style="margin-top:8px; padding:10px 20px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:14px;">
            Répondre
          </button>
        ` : `
          <p style="color:var(--muted); font-size:13px; text-align:center;">
            <span onclick="showAuthModal()" style="color:var(--accent); cursor:pointer; text-decoration:underline;">Connecte-toi</span> pour répondre.
          </p>
        `}
      </div>
    `;
  } catch(e) {
    content.innerHTML = `<p style="color:var(--danger);">Erreur de chargement.</p>`;
  }
}

async function submitReply(topicId) {
  const user = getCurrentUser();
  if (!user) return;

  const contenu = document.getElementById("reply-input").value.trim();
  if (!contenu) return;

  const res = await fetch("forum.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_reply", topic_id: topicId, user_id: user.id, contenu })
  });
  const data = await res.json();
  if (data.succès) showForumTopic(topicId);
}

async function deleteTopic(topicId, categoryId) {
  if (!confirm("Supprimer ce sujet et toutes ses réponses ?")) return;

  const res = await fetch("forum.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete_topic", id: topicId })
  });
  const data = await res.json();
  if (data.succès) showForumCategory(categoryId, "");
}

async function deleteReply(replyId, topicId) {
  if (!confirm("Supprimer cette réponse ?")) return;

  const res = await fetch("forum.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete_reply", id: replyId })
  });
  const data = await res.json();
  if (data.succès) showForumTopic(topicId);
}