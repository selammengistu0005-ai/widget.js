(function() {
  // =================================================================
  // 1. Load External Dependencies (FontAwesome + Marked)
  // =================================================================
  
  // Load Font Awesome for icons
  const fontAwesomeLink = document.createElement("link");
  fontAwesomeLink.rel = "stylesheet";
  fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
  document.head.appendChild(fontAwesomeLink);

  // Load Marked.js for markdown parsing
  const markedScript = document.createElement("script");
  markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  document.head.appendChild(markedScript);

  // =================================================================
  // 2. Inject CSS
  // =================================================================
  const styles = `
    /* Define your variables here so they work on ANY site */
    :root {
      --primary: #00d4ff;  /* Cyan blue */
      --dark: #0f172a;     /* Dark slate */
      --glass: rgba(255, 255, 255, 0.1);
    }

    .support-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999; /* High z-index to sit on top of everything */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .support-fab:hover {
        transform: scale(1.1);
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
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        overflow: hidden;
        display: none; /* Hidden by default */
        flex-direction: column;
        box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        animation: slideUp 0.4s ease forwards;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .support-header {
        background: var(--primary);
        padding: 15px;
        color: var(--dark);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .support-header h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .support-header button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        font-weight: bold;
        color: var(--dark);
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
        color: #f8fafc;
        padding: 10px 15px;
        border-radius: 15px 15px 15px 0;
        margin: 10px 0;
        width: fit-content;
        max-width: 85%;
        align-self: flex-start;
        font-size: 0.85rem;
        line-height: 1.4;
    }

    /* Fix markdown paragraph spacing */
    .support-msg p { margin: 0; }

    .user-msg {
        background: var(--primary);
        color: var(--dark);
        padding: 8px 12px;
        border-radius: 15px 15px 0 15px;
        margin: 10px 0;
        width: fit-content;
        max-width: 80%;
        align-self: flex-end;
        font-size: 0.85rem;
        word-wrap: break-word;
    }

    .support-input {
        padding: 15px;
        display: flex;
        gap: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        cursor: pointer;
        font-size: 1.2rem;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // =================================================================
  // 3. Inject HTML
  // =================================================================
  
  // Note: I removed the onclick="..." attributes to keep code clean and secure
  const htmlContent = `
    <div class="support-container">
        <div class="support-window" id="supportWindow">
            <div class="support-header">
                <h3>Lumina Support</h3>
                <button id="closeBtn">&times;</button>
            </div>
            <div class="support-body" id="supportBody">
                <p style="margin-top:0;">Hi there! 👋 How can we help you today?</p>
                <div class="support-msg" id="reply-time-note">Our typical reply time is under 5 mins.</div>
            </div>
            <div class="support-input">
                <input type="text" id="supportInputField" placeholder="Type your message...">
                <button id="sendBtn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>

        <button class="support-fab" id="fabBtn">
            <i class="fas fa-comments"></i> 
        </button>
    </div>
  `;

  const widgetContainer = document.createElement("div");
  widgetContainer.innerHTML = htmlContent;
  document.body.appendChild(widgetContainer);

  // =================================================================
  // 4. JavaScript Logic
  // =================================================================

  const fabBtn = document.getElementById('fabBtn');
  const closeBtn = document.getElementById('closeBtn');
  const supportWindow = document.getElementById('supportWindow');
  const chatInput = document.getElementById('supportInputField');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('supportBody');

  // Toggle Window
  function toggleSupport() {
      if (supportWindow.style.display === "flex") {
          supportWindow.style.display = "none";
      } else {
          supportWindow.style.display = "flex";
      }
  }

  fabBtn.addEventListener('click', toggleSupport);
  closeBtn.addEventListener('click', toggleSupport);

  // Send Message Logic
  function sendMessage() {
      const messageText = chatInput.value.trim();
      if (!messageText) return;

      // 1. Display USER Message
      const userMsg = document.createElement('div');
      userMsg.className = 'user-msg';
      userMsg.innerText = messageText;
      chatMessages.appendChild(userMsg);
      
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight; 

      // 2. Fetch AI response
      fetch('https://lumina-web.onrender.com/api/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText })
      })
      .then(res => res.json())
      .then(data => {
          const rawReply = data.reply || "Sorry, I didn’t get that.";
          
          // Check if 'marked' is loaded, otherwise just show plain text
          let formattedReply;
          if (typeof marked !== 'undefined') {
            formattedReply = marked.parse(rawReply, { breaks: true });
          } else {
            formattedReply = rawReply;
          }

          const botMsg = document.createElement('div');
          botMsg.className = 'support-msg'; 
          botMsg.innerHTML = formattedReply; 
          
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight; 
      })
      .catch(err => {
          console.error("Fetch error:", err);
          const errMsg = document.createElement('div');
          errMsg.className = 'support-msg';
          errMsg.style.color = "#ff4d4d";
          errMsg.innerText = "⚠️ Connection Error. Please try again.";
          chatMessages.appendChild(errMsg);
      });
  }

  // Attach Event Listeners
  sendBtn.addEventListener('click', sendMessage);

  chatInput.addEventListener('keypress', function(event) {
      if (event.key === "Enter") {
          event.preventDefault(); 
          sendMessage();
      }
  });

})();