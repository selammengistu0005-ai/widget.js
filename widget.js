(function() {
    // 1. BRAND COLORS & CONFIG
    const BRAND_COLOR = '#5850ec'; // Matches your ECHO primary button
    const BACKEND_URL = 'https://lumina-web.onrender.com/api/support';

    // 2. STYLES
    const style = document.createElement('style');
    style.innerHTML = `
        #echo-widget-container { position: fixed; bottom: 30px; right: 30px; font-family: 'Inter', sans-serif; z-index: 10000; }
        #echo-trigger { 
            width: 60px; height: 60px; background: ${BRAND_COLOR}; border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; cursor: pointer;
            box-shadow: 0 8px 24px rgba(88, 80, 236, 0.25); transition: all 0.3s ease;
        }
        #echo-trigger:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(88, 80, 236, 0.4); }
        #echo-window { 
            display: none; width: 380px; height: 550px; background: white; 
            border-radius: 20px; flex-direction: column; overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-bottom: 20px; border: 1px solid #f0f0f0;
        }
        #echo-header { background: ${BRAND_COLOR}; color: white; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        #echo-messages { flex: 1; padding: 20px; overflow-y: auto; background: #ffffff; display: flex; flex-direction: column; gap: 12px; }
        .echo-bubble { max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; animation: fadeIn 0.3s ease; }
        .user-echo { align-self: flex-end; background: ${BRAND_COLOR}; color: white; border-bottom-right-radius: 4px; }
        .bot-echo { align-self: flex-start; background: #f3f4f6; color: #1f2937; border-bottom-left-radius: 4px; }
        #echo-input-container { padding: 15px; background: white; border-top: 1px solid #f3f4f6; display: flex; gap: 10px; }
        #echo-input { flex: 1; border: 1px solid #e5e7eb; border-radius: 25px; padding: 10px 18px; outline: none; transition: border 0.2s; }
        #echo-input:focus { border-color: ${BRAND_COLOR}; }
        #echo-send { background: ${BRAND_COLOR}; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // 3. HTML
    const container = document.createElement('div');
    container.id = 'echo-widget-container';
    container.innerHTML = `
        <div id="echo-window">
            <div id="echo-header">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:10px; height:10px; background:#4ade80; border-radius:50%;"></div>
                    <span style="font-size: 16px; letter-spacing: 0.5px;">ECHO Support</span>
                </div>
                <span id="echo-close" style="cursor:pointer; font-size:24px;">&times;</span>
            </div>
            <div id="echo-messages"></div>
            <div id="echo-input-container">
                <input type="text" id="echo-input" placeholder="Type your message...">
                <button id="echo-send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
            </div>
        </div>
        <div id="echo-trigger">
            <svg id="chat-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    document.body.appendChild(container);

    // 4. LOGIC
    const trigger = document.getElementById('echo-trigger');
    const window = document.getElementById('echo-window');
    const input = document.getElementById('echo-input');
    const sendBtn = document.getElementById('echo-send');
    const messages = document.getElementById('echo-messages');

    trigger.onclick = () => {
        window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
        if(messages.children.length === 0) addMessage('bot', 'Hi there! I am Lumi. How can I help you with ECHO courses today?');
    };
    document.getElementById('echo-close').onclick = () => window.style.display = 'none';

    function addMessage(type, text) {
        const bubble = document.createElement('div');
        bubble.className = `echo-bubble ${type}-echo`;
        bubble.innerText = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage('user', text);
        input.value = '';

        try {
            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, user: { name: 'Student' } })
            });
            const data = await res.json();
            addMessage('bot', data.reply);
        } catch (err) {
            addMessage('bot', "I'm having trouble connecting to ECHO servers.");
        }
    }

    sendBtn.onclick = sendMessage;
    input.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
})();
