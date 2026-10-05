# endpoint, functions and routing
from fastapi import FastAPI
from pydantic import BaseModel
from .openai_client import chat

from fastapi.staticfiles import StaticFiles



class Message(BaseModel):
    conversation_id : str
    message : str
    

app = FastAPI()


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
