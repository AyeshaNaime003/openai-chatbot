#  open ai functionality
import openai
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-5-nano"
INSTRUCTIONS = "Act like a friendly chatbot that serves people, the answers should be short and precise"


# class Conversation():
#     def __init__(self, previous_response_id=None, previous_messages=None, title=None):
#         self.previous_response_id = previous_response_id
#         self.previous_messages = previous_messages or []
#         self.title = title

#     def clear_memory(self):
#         self.previous_response_id = None
#         self.previous_messages = []

# with open("database\\db.json", "r") as file:
#     conversations = json.load(file)

async def chat_with_openai(message, previous_response_id=None):
    # chatmemory.memory += message
    response = await client.responses.create(
        model = MODEL,
        instructions = INSTRUCTIONS,
        previous_response_id=previous_response_id,
        input = message
    )
    return response.output_text, response.id

# print(chat("hi"))
