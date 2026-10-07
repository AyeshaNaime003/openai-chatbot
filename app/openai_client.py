#  open ai functionality
import openai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY is not set")

client = openai.AsyncOpenAI(api_key=api_key)

MODEL = "gpt-5-nano"
INSTRUCTIONS = "Act like a friendly chatbot that serves people, the answers should be short and precise"


async def chat_with_openai(message, previous_response_id=None):
    response = await client.responses.create(
        model = MODEL,
        instructions = INSTRUCTIONS,
        previous_response_id=previous_response_id,
        input = message
    )
    return response.output_text, response.id


