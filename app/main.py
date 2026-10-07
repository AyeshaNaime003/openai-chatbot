# endpoint, functions and routing
from fastapi import FastAPI
from pydantic import BaseModel
from .openai_client import chat_with_openai
from .database_operations import load_conversations, save_conversations
import uuid 
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException


class Message(BaseModel):
    conversation_id : str
    user_message : str

class NewConversation(BaseModel):
    title : str

app = FastAPI()

# rename a conversation
@app.patch("/conversations/{conversation_id}")
async def rename_conversation(conversation_id: str, data: NewConversation):
    conversations = load_conversations()
    if conversation_id in conversations:
        conversations[conversation_id]["title"] = data.title
        save_conversations(conversations)
        return {"message": "Conversation renamed successfully"}
    else:
        raise HTTPException(status_code=404, detail="Conversation not found")


# load, update(add new conversation), dump
@app.post("/new_conversation")
async def create_conversation(data: NewConversation):
    conversation_id = str(uuid.uuid4())
    conversations = load_conversations()
    conversations[conversation_id] = {
            "title": data.title,
            "previous_response_id": None,
            "previous_messages": []
        }
    save_conversations(conversations)
    return {"conversation_id": conversation_id, 
            "title": data.title}

# load
@app.get("/conversations/{conversation_id}")
async def get_messages(conversation_id: str):  
    conversations = load_conversations()
    conversation = conversations[conversation_id]
    return {
        "conversation_id": conversation_id,
        "title": conversation["title"],
        "messages": conversation["previous_messages"]
        }

# load
@app.get("/conversations")
async def get_conversations():
    conversations = load_conversations()
    return [
        {
            "conversation_id": conversation_id,
            "title": conversation["title"],
        }
        for conversation_id, conversation in conversations.items()
    ]


# load, update, dump
@app.post("/chat")
async def chat(data: Message):
    print(f"\033[0;35m User: {data.user_message} \033[00m")
    
    conversations = load_conversations()
    current_conversation = conversations[data.conversation_id]
    previous_response_id = current_conversation['previous_response_id']
    
    assistant_message, new_response_id = await chat_with_openai(data.user_message, previous_response_id)

    current_conversation['previous_response_id'] = new_response_id
    current_conversation['previous_messages'].append({"user": data.user_message, "assistant": assistant_message})

    save_conversations(conversations)
    
    print(f"\033[0;34m Assistant: {assistant_message} \033[00m")
    return {"message": assistant_message}


# implicit get function to serve the frontend files
app.mount("/", 
          StaticFiles(directory="frontend", html=True), 
          name="frontend")
