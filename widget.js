(function() {
    // Create chat widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '20px';
    widgetContainer.style.right = '20px';
    widgetContainer.style.zIndex = '10000';
    document.body.appendChild(widgetContainer);

    // Create floating icon button with glassmorphism
    const chatButton = document.createElement('button');
    chatButton.innerHTML = '💬'; // Chat icon (you can replace with SVG if needed)
    chatButton.style.width = '60px';
    chatButton.style.height = '60px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.background = 'rgba(255, 255, 255, 0.2)';
    chatButton.style.backdropFilter = 'blur(10px)';
    chatButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    chatButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    chatButton.style.color = '#000';
    chatButton.style.fontSize = '24px';
    chatButton.style.cursor = 'pointer';
    chatButton.style.display = 'flex';
    chatButton.style.alignItems = 'center';
    chatButton.style.justifyContent = 'center';
    chatButton.title = 'Our typical reply time is under 2 mins'; // Tooltip text
    widgetContainer.appendChild(chatButton);

    // Create chat window (hidden initially)
    const chatWindow = document.createElement('div');
    chatWindow.style.display = 'none';
    chatWindow.style.width = '300px';
    chatWindow.style.height = '400px';
    chatWindow.style.background = 'rgba(0, 0, 0, 0.7)'; // Adjusted for dark mode to match screenshot
    chatWindow.style.backdropFilter = 'blur(10px)';
    chatWindow.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    chatWindow.style.borderRadius = '10px';
    chatWindow.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    chatWindow.style.marginBottom = '10px';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    widgetContainer.appendChild(chatWindow);

    // Chat messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.style.flex = '1';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.padding = '10px';
    chatWindow.appendChild(messagesContainer);

    // Gradient text above input field
    const replyTimeText = document.createElement('div');
    replyTimeText.innerText = 'Our typical reply time is under 2 mins';
    replyTimeText.style.textAlign = 'center';
    replyTimeText.style.padding = '5px';
    replyTimeText.style.fontSize = '12px';
    replyTimeText.style.color = '#007bff'; // Fallback color for browsers without background-clip support
    replyTimeText.style.background = 'linear-gradient(to right, #007bff, #00ff7f)'; // Gradient
    replyTimeText.style.webkitBackgroundClip = 'text';
    replyTimeText.style.webkitTextFillColor = 'transparent';
    replyTimeText.style.backgroundClip = 'text';
    chatWindow.appendChild(replyTimeText);

    // Input area
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)'; // Adjusted for dark mode
    chatWindow.appendChild(inputContainer);

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Type your query...';
    inputField.style.flex = '1';
    inputField.style.border = 'none';
    inputField.style.padding = '10px';
    inputField.style.outline = 'none';
    inputField.style.background = 'transparent';
    inputField.style.color = '#fff'; // For dark mode
    inputContainer.appendChild(inputField);

    const sendButton = document.createElement('button');
    sendButton.innerHTML = '➤';
    sendButton.style.background = 'transparent';
    sendButton.style.border = 'none';
    sendButton.style.padding = '10px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.color = '#a855f7'; // Purple to match screenshot
    inputContainer.appendChild(sendButton);

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        if (chatWindow.style.display === 'flex' && messagesContainer.innerHTML === '') {
            addMessage('assistant', 'Hello! How can I help you today?');
        }
    });

    // Function to add message
    function addMessage(sender, text) {
        const message = document.createElement('div');
        message.style.marginBottom = '10px';
        message.style.padding = '8px';
        message.style.borderRadius = '8px';
        message.style.maxWidth = '80%';
        message.style.color = '#fff'; // For dark mode
        if (sender === 'user') {
            message.style.alignSelf = 'flex-end';
            message.style.background = 'rgba(168, 85, 247, 0.8)'; // Purple for user messages to match
            message.style.marginLeft = 'auto';
        } else {
            message.style.background = 'rgba(0, 0, 0, 0.5)';
        }
        message.innerText = text;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send message on enter or button click
    function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;
        addMessage('user', message);
        inputField.value = '';

        fetch('https://trex-backend-09ab.onrender.com/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, user: { name: 'Selam', preferences: {} } }) // Customize user as needed
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('assistant', data.reply);
            } else {
                addMessage('assistant', 'Sorry, there was an error. Please try again.');
            }
        })
        .catch(() => addMessage('assistant', 'Sorry, connection issue. Please try again.'));
    }

    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
})();
