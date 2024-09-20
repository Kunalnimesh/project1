// Function to toggle the chatbot window
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    
    if (chatbotWindow.classList.contains('active')) {
        // Fade out animation
        chatbotWindow.classList.remove('active');
        chatbotWindow.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            chatbotWindow.style.display = 'none';
        }, 300); // Delay to match animation time
    } else {
        // Show the chatbot
        chatbotWindow.style.display = 'flex';
        chatbotWindow.classList.add('active');
        chatbotWindow.style.animation = 'fadeIn 0.3s ease-out';
    }
    
}
async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();

    if (message === '') return;

    // Add user's message to chat window
    addMessageToChat('You', message);
    inputField.value = '';  // Clear input

    // Call the chatbot API
    const chatbotResponse = await callChatbotAPI(message);
    addMessageToChat('Chatbot', chatbotResponse);
}

// Function to call the chatbot API
async function callChatbotAPI(message) {
    const url = 'https://iocl-hr-openai-service.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview';
    const apiKey = '9f82a1e82c7444e8a8453f9d7f787e2a'; // Your API key from the screenshot

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey  // Correct key for Azure OpenAI
        },
        body: JSON.stringify({
            "messages": [
                { "role": "system", "content": "You are an assistant." },
                { "role": "user", "content": message }
            ],
            "max_tokens": 50
        })
    });

    if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.choices[0].message.content;
    } else {
        return 'Error retrieving a response. Please try again later.';
    }
}

// Function to add a message to the chat window
function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Auto scroll
}