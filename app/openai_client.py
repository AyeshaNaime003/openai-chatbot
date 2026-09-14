#  open ai functionality
import openai
from dotenv import load_dotenv
import os

load_dotenv()
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-5-nano"
INSTRUCTIONS = "Act like a frindly chatbot that serves people in roman urdu, the answers should be short and precise"

class ChatMemory():
    def __init__(self):
        self.memory = None
        self.previous_messages = []

    def clear_memory(self):
        self.memory = None
        self.previous_messages = []

chatmemory = ChatMemory()

async def chat(message):
    # chatmemory.memory += message
    response = await client.responses.create(
        model = MODEL,
        instructions = INSTRUCTIONS,
        previous_response_id=chatmemory.memory,
        input = message
    )
    chatmemory.memory = response.id
    chatmemory.previous_messages.append({"user":message,
                                         "model":response.output_text})
    return response.output_text

# print(chat("hi"))
