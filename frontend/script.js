// element selectors
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const messagesList = document.getElementById("messages");
const sidebar = document.querySelector(".sidebar");
const toggleSidebar = document.getElementById("toggle-sidebar");
const conversationsList = document.getElementById("conversations")
const newChatButton = document.getElementById("new-chat");
// variables
let activeConversationId = null; // Default conversation ID
// event listeners
newChatButton.addEventListener("click", createNewChat);


async function getConversations(message, sender) {
    // Get all conversations
    const response = await fetch("/conversations");
    const conversations = await response.json();
    return conversations;
}

// initialize chat
async function initializeChat() {
    const conversations = await getConversations();
    if (conversations.length === 0) {
        // If no conversations exist, create a new one
        await createNewChat();
        return;
    }
    // Display sidebar
    displayConversations(conversations);
    // Make the first conversation active
    const lastConversation = conversations[conversations.length - 1];
    switchConversation(lastConversation.conversation_id);
}

async function refreshConversations() {
    const conversations = await getConversations();
    displayConversations(conversations);
}

async function createNewChat() {
    // title prompt
    const title = prompt("Enter a title for the new chat:");
    if (!title) {
        alert("Title cannot be empty.");
        return;
    }
    console.log("Creating new chat with title:", title);
    // create new object in backend
    const response = await fetch("/new_conversation", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ title: title })
    });
    const conversation = await response.json();
    // refresh the conversation list
    refreshConversations();
    // switch to the new conversation
    await switchConversation(conversation.conversation_id);
}

async function loadMessages(conversationId) {
    const response = await fetch(`/conversations/${conversationId}`);
    const conversation = await response.json();

    messagesList.innerHTML = "";

    for (const message of conversation.messages) {
        addMessage(message.user, "user");
        addMessage(message.assistant, "assistant");
    }
}

async function switchConversation(conversationId) {
    activeConversationId = conversationId;
    await loadMessages(conversationId);
    console.log("Switched to:", conversationId);
}

async function displayConversations(conversations){
    conversationsList.innerHTML = "";
    
    for (const conversation of conversations){
        // make the element and add it to the list
        const conversationElement = document.createElement("div");
        conversationElement.classList.add("conversation-card");
        
        // title
        const titleElement = document.createElement("span");
        titleElement.textContent = conversation.title;
        conversationElement.appendChild(titleElement);
        
        // menu
        const menuButton = document.createElement("button");
        menuButton.textContent = "⋮";
        menuButton.classList.add("conversation-menu-button");
        
        // add event listener to the menu button
        menuButton.addEventListener("click", function(event) {
            event.stopPropagation();
            showMenu(menuButton, conversation.conversation_id)
        });
        conversationElement.appendChild(menuButton);

        // add the new conversation element to the list
        conversationsList.appendChild(conversationElement);
        
        // add the event listener to the element
        conversationElement.addEventListener("click", function() {
            switchConversation(conversation.conversation_id);
        })

     }

}

async function showMenu(menuButton, conversationId) {
    const existingMenu = document.querySelector(".conversation-menu");
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    const menu = document.createElement("div");
    menu.classList.add("conversation-menu");

    const renameOption = document.createElement("div");
    renameOption.textContent = "Rename";
    renameOption.addEventListener("click", async function() {
        const newTitle = prompt("Enter a new title for the conversation:");
        if (!newTitle) {
            alert("Title cannot be empty.");
            return;
        }
        const response = await fetch(`/conversations/${conversationId}`,{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({title: newTitle})
        });
        if (!response.ok) {
            alert("Failed to rename conversation.");
            return;
        }
        await refreshConversations();
    });

    const deleteOption = document.createElement("div");
    deleteOption.textContent = "Delete";

    menu.appendChild(renameOption);
    menu.appendChild(deleteOption);
    // conversationElement.appendChild(menu);
    document.body.appendChild(menu);
    // Get button's position on the screen
    const buttonRect = menuButton.getBoundingClientRect();
    // Position menu next to button
    menu.style.top = `${buttonRect.top}px`;
    menu.style.left = `${buttonRect.right + 5}px`;
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) {
        return;
    }
    // add user message to the chat
    addMessage(message, "user");
    messageInput.value = "";
    // send the message to the backend
    const response = await fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            conversation_id: activeConversationId,
            user_message: message
        })
    });
    const data = await response.json();
    // add assistant message to the chat
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