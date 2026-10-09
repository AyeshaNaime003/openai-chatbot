// element selectors
const titleHeading = document.getElementById("title-heading")
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send");
const messagesList = document.getElementById("messages");
const sidebar = document.querySelector(".sidebar");
const toggleSidebar = document.getElementById("toggle-sidebar");
const conversationsList = document.getElementById("conversations")
const newChatButton = document.getElementById("new-chat");
const modal = document.getElementById("modal");
const modalInput = document.getElementById("modal-input");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");
// variables
let activeConversationId = null; // Default conversation ID
let recentSwitch = false
// event listeners
newChatButton.addEventListener("click", () => createNewChat(false));


async function getConversations() {
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
        await createNewChat(true);
        return;
    }
    // Display sidebar
    displayConversations(conversations);
    // Make the first conversation active
    const lastConversation = conversations[0];
    switchConversation(lastConversation.conversation_id, lastConversation.title);
}

async function refreshConversations() {
    const conversations = await getConversations();
    displayConversations(conversations);
}

async function createNewChat(fromZero=false){
     console.log("fromZero:", fromZero);
    // title prompt
    let prompt;
    if(fromZero){
        prompt = "Give a title to your first chat";
    }
    else{
        prompt = "Give a title to your chat";
    }
    const title = await showModal(prompt, "");

    // const title = prompt("Enter a title for the new chat:");
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
    await refreshConversations();
    // switch to the new conversation
    await switchConversation(conversation.conversation_id, conversation.title);
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

async function switchConversation(conversationId, conversationTitle) {
    activeConversationId = conversationId;
    recentSwitch = true
    titleHeading.textContent = conversationTitle
    await loadMessages(conversationId);
    console.log("Switched to:", conversationId);
}

function displayConversations(conversations){
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
            showMenu(menuButton, conversation)
        });
        conversationElement.appendChild(menuButton);

        // add the new conversation element to the list
        conversationsList.appendChild(conversationElement);
        
        // add the event listener to the element
        conversationElement.addEventListener("click", function() {
            switchConversation(conversation.conversation_id, conversation.title);
        })

     }

}

function showMenu(menuButton, conversation) {
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
        const newTitle = await showModal("Rename your chat", conversation.title)
        if (!newTitle) {
            alert("Title cannot be empty.");
            return;
        }
        const response = await fetch(`/conversations/${conversation.conversation_id}`,{
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
    deleteOption.addEventListener("click", async function (){
        const response = await fetch(`/conversations/${conversation.conversation_id}`, {
             method: "DELETE",
            headers: {"Content-Type": "application/json"},
        })
         if (!response.ok) {
            alert("Failed to delete conversation.");
            return;
        }
        menu.remove()
        await refreshConversations()

    })

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
    // if this was the first message after a switch then refresh
    if (recentSwitch){
        recentSwitch=false;
        await refreshConversations();
    }
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

function showModal(prompt, placeholder) {
    return new Promise(function(resolve){
        document.getElementById("modal-title").textContent = prompt;
        modal.classList.remove("hidden");
        modalInput.value = placeholder;
        modalInput.focus();

        modalConfirm.onclick=function(){
            const title = modalInput.value.trim();
            if(!title){
                return ;
            }
            modal.classList.add("hidden");
            resolve(title);
        };
        modalCancel.onclick = function() {
            modal.classList.add("hidden");
            resolve(null);
        };
    });
    
}

function closeModal() {
    modal.classList.add("hidden");
}

// modalConfirm.addEventListener("click", async function() {
//     const title = modalInput.value.trim();
//      if (!title) {
//         alert("Title cannot be empty.");
//         return;
//     }
//     console.log("Creating new chat with title:", title);
//     // create new object in backend
//     const response = await fetch("/new_conversation", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ title: title })
//     });
//     const conversation = await response.json();
//     // refresh the conversation list
//     refreshConversations();
//     // switch to the new conversation
//     await switchConversation(conversation.conversation_id);
// });o