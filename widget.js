(function() {
    // 1. Inject CSS for the Premium Design
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .nexus-widget-container {
            font-family: 'Inter', sans-serif;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        /* Animated Floating Button */
        .nexus-launch-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .nexus-launch-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
            background: rgba(30, 41, 59, 0.95);
        }

        .nexus-launch-icon {
            font-size: 24px;
            filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
        }

        /* The Chat Window - Glassmorphism Card */
        .nexus-window {
            width: 350px;
            height: 500px;
            background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 100%);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            margin-bottom: 16px;
            display: none; /* Hidden by default */
            flex-direction: column;
            overflow: hidden;
            animation: nexus-fade-in 0.2s ease-out;
        }

        @keyframes nexus-fade-in {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header Section */
        .nexus-header {
            padding: 20px 20px 10px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .nexus-title-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .nexus-pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            position: relative;
            box-shadow: 0 0 10px #10b981;
        }
        
        .nexus-pulse-dot::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 100%; height: 100%;
            background-color: #10b981;
            border-radius: 50%;
            animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
            0% { width: 100%; height: 100%; opacity: 0.8; }
            100% { width: 300%; height: 300%; opacity: 0; }
        }

        .nexus-title {
            color: white;
            font-weight: 700;
            font-size: 18px;
            letter-spacing: -0.025em;
        }

        /* Metrics Grid (From Screenshot) */
        .nexus-metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .nexus-metric-box {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 10px;
            text-align: center;
        }

        .nexus-metric-label {
            display: block;
            font-size: 10px;
            color: #94a3b8;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .nexus-metric-value {
            color: white;
            font-weight: 700;
            font-size: 14px;
        }

        /* Chat Area */
        .nexus-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .nexus-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            animation: msg-slide 0.3s ease-out;
        }

        @keyframes msg-slide {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .nexus-msg-bot {
            background: rgba(30, 41, 59, 0.8);
            color: #e2e8f0;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .nexus-msg-user {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }

        /* Input Area */
        .nexus-input-area {
            padding: 15px;
            background: rgba(15, 23, 42, 0.8);
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            gap: 10px;
        }

        .nexus-input {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 10px 15px;
            color: white;
            font-family: inherit;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
        }

        .nexus-input:focus {
            background: rgba(255,255,255,0.1);
            border-color: #6366f1;
        }

        .nexus-send-btn {
            background: transparent;
            border: none;
            color: #6366f1;
            cursor: pointer;
            padding: 0 10px;
            font-size: 18px;
            transition: transform 0.2s;
        }

        .nexus-send-btn:hover {
            transform: translateX(3px);
            color: #818cf8;
        }
    `;
    document.head.appendChild(style);

    // 2. Create Widget Container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'nexus-widget-container';
    document.body.appendChild(widgetContainer);

    // 3. Create Chat Window (With the Design from your Screenshot)
    const chatWindow = document.createElement('div');
    chatWindow.className = 'nexus-window';
    
    // We use innerHTML to build the complex "Agent" Dashboard structure
    chatWindow.innerHTML = `
        <div class="nexus-header">
            <div class="nexus-title-row">
                <div class="nexus-pulse-dot"></div>
                <div class="nexus-title">Nexus AI Agent</div>
            </div>
            <div class="nexus-metrics">
                <div class="nexus-metric-box">
                    <span class="nexus-metric-label">Response Time</span>
                    <span class="nexus-metric-value">2m - 5m</span>
                </div>
                <div class="nexus-metric-box">
                    <span class="nexus-metric-label">Current Load</span>
                    <span class="nexus-metric-value" style="color: #34d399;">medium</span>
                </div>
            </div>
        </div>
        <div class="nexus-messages" id="nexus-messages-area"></div>
        <div class="nexus-input-area">
            <input type="text" class="nexus-input" id="nexus-input" placeholder="Ask Nexus anything..." />
            <button class="nexus-send-btn" id="nexus-send">➤</button>
        </div>
    `;
    widgetContainer.appendChild(chatWindow);

    // 4. Create Floating Button
    const chatButton = document.createElement('div');
    chatButton.className = 'nexus-launch-btn';
    chatButton.innerHTML = '<span class="nexus-launch-icon">🤖</span>'; // Robot emoji or use an SVG
    chatButton.title = 'Nexus AI Agent Active';
    widgetContainer.appendChild(chatButton);

    // 5. Logic Binding
    const messagesContainer = chatWindow.querySelector('#nexus-messages-area');
    const inputField = chatWindow.querySelector('#nexus-input');
    const sendButton = chatWindow.querySelector('#nexus-send');

    // Toggle Visibility
    chatButton.addEventListener('click', () => {
        const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
        chatWindow.style.display = isHidden ? 'flex' : 'none';
        
        if (isHidden) {
            inputField.focus();
            if (messagesContainer.children.length === 0) {
                addMessage('assistant', 'System Online. How can I assist you today?');
            }
        }
    });

    // Helper: Add Message
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `nexus-msg ${sender === 'user' ? 'nexus-msg-user' : 'nexus-msg-bot'}`;
        messageDiv.innerText = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Main Function: Send Message
    function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;

        addMessage('user', message);
        inputField.value = '';

        // API Call (Preserved from your code)
        fetch('https://lumina-web.onrender.com/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                user: { name: 'Visitor', preferences: {} } 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('assistant', data.reply);
            } else {
                addMessage('assistant', 'Error: Unable to process request.');
            }
        })
        .catch(() => addMessage('assistant', 'Connection lost. Reconnecting...'));
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})();

