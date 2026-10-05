const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const messagesList = document.getElementById("messages");
const sidebar = document.querySelector(".sidebar");
const toggleSidebar = document.getElementById("toggle-sidebar");
const conversationsList = document.getElementById("conversations")

// const conversations = {
//     "conversation_jobsearch": {
//         title: "Job Search",
//         messages: []
//     },
//     "conversation_masters": {
//         title: "Masters",
//         messages: []
//     },
//     "conversation_business": {
//         title: "Business",
//         messages: []
//     }
// };
let activeConversationId = null; // Default conversation ID

async function initializeChat() {
    // Get all conversations
    const response = await fetch("/conversations");
    const conversations = await response.json();

    // Display sidebar
    displayConversations(conversations);

    // Make the first conversation active
    activeConversationId = conversations[0].id;

    // Get and display its messages
    await loadConversation(activeConversationId);
}

async function loadConversation(conversationId) {
    const response = await fetch(`/conversations/${conversationId}`);
    const conversation = await response.json();

    messagesList.innerHTML = "";

    for (const message of conversation.messages) {
        addMessage(message.user, "user");
        addMessage(message.assistant, "assistant");
    }
}

function switchConversation(conversationId) {
    activeConversationId = conversationId;
    loadConversation(conversationId);
    console.log("Switched to:", conversationId);
}

async function displayConversations(conversations){
    conversationsList.innerHTML = "";
    
    for (const conversation of conversations){
        // make the element and add it to the list
        const conversationElement = document.createElement("div");
        conversationElement.textContent = conversation.title;
        conversationElement.classList.add("conversation");
        conversationsList.appendChild(conversationElement);
        
        // add the event listener to the element
        conversationElement.addEventListener("click", function() {
            switchConversation( conversation.id);
        })
     }

}


// Send message
async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");
    messageInput.value = "";
    const response = await fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            conversation_id: activeConversationId,
            message: message
        })
    });
    const data = await response.json();
    addMessage(data.message, "assistant");
}

// Display message
function addMessage(message, sender) {
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", sender);
    messageElement.textContent = message;

    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

// Send button
sendButton.addEventListener("click", sendMessage);

// Enter key
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Toggle sidebar
toggleSidebar.addEventListener("click", function() {
    sidebar.classList.toggle("hidden");
});

initializeChat();