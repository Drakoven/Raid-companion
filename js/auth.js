// ================================
//  AUTH — Raid Companion
//  Gestion login / inscription / déconnexion
// ================================

const AUTH_URL = "register.php";
const LOGIN_URL = "login.php";

// Récupérer l'utilisateur connecté depuis le localStorage
function getCurrentUser() {
  const saved = localStorage.getItem("rc_user");
  return saved ? JSON.parse(saved) : null;
}

// Sauvegarder l'utilisateur après login
function setCurrentUser(user) {
  localStorage.setItem("rc_user", JSON.stringify(user));
}

// Déconnexion
function logout() {
  localStorage.removeItem("rc_user");
  renderAuthButton();
}

// Inscription
async function register(username, email, password) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  return await res.json();
}

// Connexion
async function login(email, password) {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.succès) {
    setCurrentUser(data.user);
  }
  return data;
}

// Afficher le bouton login/logout dans le header
function renderAuthButton() {
  const user = getCurrentUser();
  let btn = document.getElementById("auth-btn");

  if (!btn) {
    btn = document.createElement("div");
    btn.id = "auth-btn";
    document.querySelector("header").appendChild(btn);
  }

  if (user) {
    btn.innerHTML = `
      <span style="font-size:13px; color:#aaa;">👤 ${escapeHTML(user.username)}</span>
      <button onclick="logout()" style="margin-left:10px; padding:4px 10px; font-size:12px; background:#333; border-radius:8px;">Déconnexion</button>
    `;
  } else {
    btn.innerHTML = `
      <button onclick="showAuthModal()" style="padding:4px 14px; font-size:13px; background:var(--accent); color:#111; border-radius:8px; font-weight:700;">Connexion</button>
    `;
  }
}

// Afficher la modal de login/inscription
function showAuthModal() {
  let modal = document.getElementById("auth-modal");
  if (modal) { modal.remove(); return; }

  modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); z-index: 999;
    display: flex; align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background:#1c1c1c; border:1px solid #333; border-radius:16px; padding:28px; width:90%; max-width:380px;">
      <h2 style="color:var(--accent); margin:0 0 20px; text-align:center;" id="auth-modal-title">Connexion</h2>
      <div id="auth-modal-msg" style="display:none; padding:10px; border-radius:8px; margin-bottom:12px; background:#0f3460; text-align:center; font-size:13px;"></div>

      <div id="auth-form-login">
        <input type="email" id="auth-email" placeholder="Email" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-size:14px;" />
        <input type="password" id="auth-password" placeholder="Mot de passe" style="width:100%; padding:12px; margin-bottom:16px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-size:14px;" />
        <button onclick="handleLogin()" style="width:100%; padding:12px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:15px;">Se connecter</button>
        <p style="text-align:center; margin-top:12px; font-size:13px; color:#aaa;">Pas de compte ? <span onclick="toggleAuthForm()" style="color:var(--accent); cursor:pointer; text-decoration:underline;">S'inscrire</span></p>
      </div>

      <div id="auth-form-register" style="display:none;">
        <input type="text" id="auth-username" placeholder="Nom d'utilisateur" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-size:14px;" />
        <input type="email" id="auth-email2" placeholder="Email" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-size:14px;" />
        <input type="password" id="auth-password2" placeholder="Mot de passe" style="width:100%; padding:12px; margin-bottom:16px; border-radius:10px; border:1px solid #444; background:#111; color:#fff; font-size:14px;" />
        <button onclick="handleRegister()" style="width:100%; padding:12px; background:var(--accent); color:#111; border-radius:10px; font-weight:700; font-size:15px;">Créer un compte</button>
        <p style="text-align:center; margin-top:12px; font-size:13px; color:#aaa;">Déjà un compte ? <span onclick="toggleAuthForm()" style="color:var(--accent); cursor:pointer; text-decoration:underline;">Se connecter</span></p>
      </div>

      <button onclick="document.getElementById('auth-modal').remove()" style="width:100%; margin-top:12px; padding:10px; background:#333; border-radius:10px; font-size:13px;">Fermer</button>
    </div>
  `;

  document.body.appendChild(modal);
}

function toggleAuthForm() {
  const loginForm = document.getElementById("auth-form-login");
  const registerForm = document.getElementById("auth-form-register");
  const title = document.getElementById("auth-modal-title");

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    title.textContent = "Connexion";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    title.textContent = "Inscription";
  }
}

function showAuthMsg(msg) {
  const el = document.getElementById("auth-modal-msg");
  el.textContent = msg;
  el.style.display = "block";
}

async function handleLogin() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const data = await login(email, password);

  if (data.succès) {
    document.getElementById("auth-modal").remove();
    renderAuthButton();
  } else {
    showAuthMsg("❌ " + data.erreur);
  }
}

async function handleRegister() {
  const username = document.getElementById("auth-username").value;
  const email = document.getElementById("auth-email2").value;
  const password = document.getElementById("auth-password2").value;
  const data = await register(username, email, password);

  if (data.succès) {
    showAuthMsg("✅ Compte créé ! Connecte-toi.");
    toggleAuthForm();
  } else {
    showAuthMsg("❌ " + data.erreur);
  }
}

// Initialisation au chargement
renderAuthButton();