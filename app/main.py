# endpoint, functions and routing
from fastapi import FastAPI
from pydantic import BaseModel
from .openai_client import chat, chatmemory

from fastapi.staticfiles import StaticFiles



class Message(BaseModel):
    message : str
    

app = FastAPI()


@app.post("/chat")
async def start(data: Message):
    print(f"data sent in the post \chat function:   {data.message}")
    if data.message=="/help":
            print('user wants to see the help informations')
            return {"message": "Use /help for instructions \n/clear-memory to clear memory \n/clear-chat to clear the chat"}
    elif data.message=="/clear":
                print('user wants to see the clear informations')
                chatmemory.clear_memory()
                return {"message": "all the memory was cleared successfully "}
    else:
            output_text = await chat(data.message)
            print(output_text)
            return {"message": output_text}

app.mount("/", 
          StaticFiles(directory="frontend", html=True), 
          name="frontend")
