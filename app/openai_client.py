#  open ai functionality
import openai
from dotenv import load_dotenv
import os

load_dotenv()
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-5-nano"
INSTRUCTIONS = "Act like a frindly chatbot that serves people in roman urdu, the answers should be short and precise"


class Conversation():
    def __init__(self, previous_response_id=None, previous_messages=None):
        self.previous_response_id = previous_response_id
        self.previous_messages = previous_messages or []

    def clear_memory(self):
        self.conversation_id = None
        self.previous_response_id = None
        self.previous_messages = []

conversations = {
    "conversation_jobsearch": Conversation(),
    "conversation_masters": Conversation(),
    "conversation_business": Conversation()}


async def chat(message, conversation_id):
    # chatmemory.memory += message
    current_conversation = conversations.get(conversation_id)
    response = await client.responses.create(
        model = MODEL,
        instructions = INSTRUCTIONS,
        previous_response_id=current_conversation.previous_response_id,
        input = message
    )
    current_conversation.previous_response_id = response.id
    current_conversation.previous_messages.append({"user":message,
                                                   "model":response.output_text})
    return response.output_text

# print(chat("hi"))
