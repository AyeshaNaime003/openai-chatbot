const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const messages = document.getElementById("messages");
const sidebar = document.querySelector(".sidebar");
const toggleSidebar = document.getElementById("toggle-sidebar");
const conversationsList = document.getElementById("conversations")

const conversations = {
    "conversation_jobsearch": {
        title: "Job Search",
        messages: []
    },
    "conversation_masters": {
        title: "Masters",
        messages: []
    },
    "conversation_business": {
        title: "Business",
        messages: []
    }
};
let activeConversationId = "conversation_jobsearch"; // Default conversation ID

function switchConversation(conversationId) {
    activeConversationId = conversationId;
     console.log("Switched to:", conversationId);
}

function displayConversations(){
    conversationsList.innerHTML = "";
     for (const conversationId in conversations){
        // get conversation content
        const conversation = conversations[conversationId];
        // make the element and add it to the list
        const conversationElement = document.createElement("div");
        conversationElement.textContent = conversation.title;
        conversationElement.classList.add("conversation");
        conversationsList.appendChild(conversationElement);
        // add the event listener to the element
        conversationElement.addEventListener("click", function() {
            switchConversation(conversationId);
        })
     }

}
displayConversations();
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

    addMessage(data.message, "model");
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