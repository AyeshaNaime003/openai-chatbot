Project overview — what the AI chatbot does and what problem it demonstrates.
Key features — conversational memory, OpenAI Responses API, FastAPI, async processing, etc.
Architecture — how frontend → FastAPI → OpenAI → response works.
Technical decisions — briefly explain why you chose things:
FastAPI → async API backend
Responses API → conversation chaining with previous_response_id
Pydantic → request validation
environment variables → API-key security
Docker → reproducible deployment
Project structure — explain what each important file does.
Setup & usage — simple steps for someone else to clone/run it.
API endpoints — what /chat accepts and returns.
Limitations / future improvements — e.g. current memory is single-session, authentication/persistent storage could be added.
Screenshots/demo — once we have the frontend.

HOw the project was made
venv, installations, requirements
uvicorn needed to run the fastapi app
app -> main and openai_client
app/main: routing and 
app/opena--client: Memory class for holding reponse ids, chat fucntions to call openai
frontned: input, button, response
js sends the post request to backend
how will frontend send index.html? mount the staticfiles 
