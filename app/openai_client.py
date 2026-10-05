#  open ai functionality
import openai
from dotenv import load_dotenv
import os

load_dotenv()
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-5-nano"
INSTRUCTIONS = "Act like a friendly chatbot that serves people, the answers should be short and precise"


class Conversation():
    def __init__(self, previous_response_id=None, previous_messages=None, title=None):
        self.previous_response_id = previous_response_id
        self.previous_messages = previous_messages or []
        self.title = title

    def clear_memory(self):
        self.previous_response_id = None
        self.previous_messages = []

conversations = {
    "conversation_jobs": Conversation(
        title="Jobs Search",
        previous_messages=[
            {"user": "What jobs should I apply for?", "assistant": "You should focus on junior AI and software engineering roles."},
            {"user": "Should I tailor my CV?", "assistant": "Yes, tailor it to each relevant job description."}
        ]
    ),

    "conversation_masters": Conversation(
        title="Masters",
        previous_messages=[
            {"user": "Which CS masters are available?", "assistant": "Let's look at English-taught programs in Germany."}
        ]
    ),

    "conversation_business": Conversation(
        title="Business",
        previous_messages=[
            {"user": "How should I start the business?", "assistant": "Start by defining the problem and target customer."}
        ]
    )
}

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
    current_conversation.previous_messages.append({"user":message, "assistant":response.output_text})
    return response.output_text

# print(chat("hi"))
