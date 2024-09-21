// Function to toggle the chatbot window
function toggleChatbot() {
    console.log("Chatbot toggle clicked"); // Debug statement to check if the function is called
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

// Function to send the message and get a response from the API
async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();

    if (message === '') return;

    // Add user's message to chat window
    addMessageToChat('You', message);
    inputField.value = '';  // Clear input

    // Call the chatbot API and get the response
    const chatbotResponse = await callChatbotAPI(message);
    
    console.log("API Response: ", chatbotResponse); // Debugging statement to log the API response
    
    // Check if response should include a PDF link
    let responseWithLink = chatbotResponse;
    if (message.toLowerCase().includes('transfer allowance')) {
        console.log("Adding View in PDF link"); // Debugging log
        // Add the "View in PDF" link at the end of the response
        responseWithLink += `<br><a href="https://drive.google.com/file/d/1MP06KjBCpyR1882IFEu-2qYKJKIUzJ40/view?usp=sharing" target="_blank" style="color: blue; text-decoration: underline;">View in PDF</a>`;
    }
    
    console.log("Final Response with Link: ", responseWithLink); // Log the final response
    addMessageToChat('Chatbot', responseWithLink);
}

// Function to call the chatbot API
async function callChatbotAPI(message) {
    const url = 'https://iocl-hr-openai-service.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview';
    const apiKey = '9f82a1e82c7444e8a8453f9d7f787e2a'; // Your API key

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey // Correct key for Azure OpenAI
            },
            body: JSON.stringify({
                "messages": [
                    { "role": "system", "content": "You are an assistant." },
                    { "role": "user", "content": message }
                ],
                "max_tokens": 900, // Increase this value to allow longer responses
                "temperature": 0.7 // Adjust temperature if needed
            })
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.choices[0].message.content;
        } else {
            console.error('Error response from API:', response.status, response.statusText);
            return 'Error retrieving a response. Please try again later.';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Error retrieving a response. Please check your connection and try again later.';
    }
}
// Function to add a message to the chat window
function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `${sender}: ${message}`; // Using innerHTML to handle links correctly
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Auto scroll
}
