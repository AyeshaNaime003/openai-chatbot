# endpoint, functions and routing
from fastapi import FastAPI
from pydantic import BaseModel
from .openai_client import chat, conversations

from fastapi.staticfiles import StaticFiles



class Message(BaseModel):
    conversation_id : str
    message : str
    

app = FastAPI()


@app.get("/conversations")
async def get_conversations():
    return [
        {
            "id": conversation_id,
            "title": conversation.title,
            # "messages": conversation.previous_messages
        }
        for conversation_id, conversation in conversations.items()
    ]

@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):  
    conversation = conversations.get(conversation_id)
    return {
        conversation_id: conversation_id,
        "title": conversation.title,
        "messages": conversation.previous_messages}

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
