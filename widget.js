(function () {
  // ===============================================================
  // 1. Load External Dependencies
  // ===============================================================

  // Font Awesome
  const fa = document.createElement("link");
  fa.rel = "stylesheet";
  fa.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
  document.head.appendChild(fa);

  // Marked.js
  const markedScript = document.createElement("script");
  markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  markedScript.onload = () => {
    window.__markedReady = true;
  };
  document.head.appendChild(markedScript);

  // ===============================================================
  // 2. Inject CSS
  // ===============================================================

  const styles = `
    :root {
      --primary: #00d4ff;
      --dark: #0f172a;
      --glass: rgba(255, 255, 255, 0.1);
    }

    .support-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Helvetica, Arial, sans-serif;
    }

    .support-fab {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary);
      border: none;
      color: var(--dark);
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .support-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      max-height: 80vh;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    }

    .support-header {
      background: var(--primary);
      padding: 15px;
      color: var(--dark);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .support-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      color: white;
    }

    .support-msg {
      background: var(--glass);
      padding: 10px 15px;
      border-radius: 15px 15px 15px 0;
      margin: 10px 0;
      max-width: 85%;
      font-size: 0.85rem;
    }

    .support-msg p { margin: 0; }

    .user-msg {
      background: var(--primary);
      color: var(--dark);
      padding: 8px 12px;
      border-radius: 15px 15px 0 15px;
      margin: 10px 0;
      max-width: 80%;
      align-self: flex-end;
      font-size: 0.85rem;
    }

    .support-input {
      padding: 15px;
      display: flex;
      gap: 10px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .support-input input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 5px;
      padding: 8px;
      color: white;
      outline: none;
    }

    .support-input button {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 1.2rem;
      cursor: pointer;
    }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // ===============================================================
  // 3. Init Widget (DOM SAFE)
  // ===============================================================

  function initLuminaWidget() {
    const html = `
      <div class="support-container">
        <div class="support-window" id="supportWindow">
          <div class="support-header">
            <h3>Lumina Support</h3>
            <button id="closeBtn">&times;</button>
          </div>
          <div class="support-body" id="supportBody">
            <div class="support-msg">Hi there 👋 How can we help?</div>
          </div>
          <div class="support-input">
            <input id="supportInput" placeholder="Type a message..." />
            <button id="sendBtn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <button class="support-fab" id="fabBtn">
          <i class="fas fa-comments"></i>
        </button>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const fabBtn = document.getElementById("fabBtn");
    const closeBtn = document.getElementById("closeBtn");
    const supportWindow = document.getElementById("supportWindow");
    const input = document.getElementById("supportInput");
    const sendBtn = document.getElementById("sendBtn");
    const body = document.getElementById("supportBody");

    function toggle() {
      supportWindow.style.display =
        supportWindow.style.display === "flex" ? "none" : "flex";
    }

    fabBtn.onclick = toggle;
    closeBtn.onclick = toggle;

    function sendMessage() {
      const msg = input.value.trim();
      if (!msg) return;

      const userMsg = document.createElement("div");
      userMsg.className = "user-msg";
      userMsg.textContent = msg;
      body.appendChild(userMsg);
      input.value = "";

      fetch("https://lumina-web.onrender.com/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      })
        .then((r) => r.json())
        .then((d) => {
          const bot = document.createElement("div");
          bot.className = "support-msg";
          const reply = d.reply || "Sorry, I didn’t get that.";
          bot.innerHTML =
            window.__markedReady && window.marked
              ? marked.parse(reply)
              : reply;
          body.appendChild(bot);
          body.scrollTop = body.scrollHeight;
        })
        .catch(() => {
          const err = document.createElement("div");
          err.className = "support-msg";
          err.textContent = "⚠️ Connection error.";
          body.appendChild(err);
        });
    }

    sendBtn.onclick = sendMessage;
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // DOM ready guard (CRITICAL)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLuminaWidget);
  } else {
    initLuminaWidget();
  }
})();
