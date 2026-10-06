# endpoint, functions and routing
from fastapi import FastAPI
from pydantic import BaseModel
from .openai_client import chat, conversations
import uuid 
import json
from fastapi.staticfiles import StaticFiles



class Message(BaseModel):
    conversation_id : str
    message : str

class NewConversation(BaseModel):
    title : str

app = FastAPI()


@app.post("/new_conversation")
async def create_conversation(data: NewConversation):
    conversation_id = str(uuid.uuid4())
    with open("database\\db.json", "r") as file:
        conversations = json.load(file)
        conversations[conversation_id] = {
            "title": data.title,
            "previous_response_id": None,
            "previous_messages": []
        }
    with open("database\\db.json", "w") as file:
        json.dump(conversations, file)
    return {"conversation_id": conversation_id, 
            "title": data.title}

@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):  
    with open("database\\db.json", "r") as file:
        json_conversations = json.load(file)
    conversation = json_conversations[conversation_id]
    return {
        "conversation_id": conversation_id,
        "title": conversation["title"],
        "messages": conversation["previous_messages"]
        }

@app.get("/conversations")
async def get_conversations():
    with open("database\\db.json", "r") as file:
        json_conversations = json.load(file)
    return [
        {
            "id": conversation_id,
            "title": conversation["title"],
            # "messages": conversation.previous_messages
        }
        for conversation_id, conversation in json_conversations.items()
    ]

@app.post("/chat")
async def start(data: Message):
    print(f"data sent in the post \\chat function:   {data.message}")
    output_text = await chat(data.message, data.conversation_id)
    print(output_text)
    return {"message": output_text}
# implicit get function to serve the frontenfnastd files
app.mount("/", 
          StaticFiles(directory="frontend", html=True), 
          name="frontend")
