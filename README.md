# My AI Assistant - An openAI chatbot

## Purpose

I built this project primarily as a learning exercise. I wanted to move beyond calling an LLM API in isolation and build a complete application around it. My goals were to understand OpenAI's Responses API, use it to build a chatbot with persistent conversation context, and improve my web engineering skills, particularly JavaScript.
 
## Project Overview

A simple replica of a modern LLM chat platform, inspired by ChatGPT and powered by OpenAI's Responses API.

The project focuses on multi-conversation management, persistent conversation context, and frontend–backend communication.

## What the Application Does

Users can create multiple conversations and switch between them. Within each conversation, they can chat about different topics and continue conversations across multiple messages while the model retains the preceding context.

Conversations are stored in a local JSON file, allowing users to return to existing chats after restarting the application.

The application currently supports text-based conversations only; media inputs and outputs are not supported.

## Features

* Create multiple conversations.
* Send messages and receive AI-generated responses.
* Maintain context across messages within a conversation.
* Persist conversation history between application sessions.
* Switch between conversations.
* Rename conversations.
* Delete conversations.

## Tech Stack

* **Python** — backend application logic.
* **FastAPI** — HTTP API and serving the frontend.
* **OpenAI Responses API** — generating assistant responses and maintaining conversation context.
* **HTML** — frontend structure.
* **CSS** — styling and interface design.
* **JavaScript** — frontend interactions, asynchronous API requests, and conversation management.
* **JSON** — local database storage.

## Architecture

The application follows a simple client–server architecture.

1. **Frontend:** HTML defines the interface, CSS styles it, and JavaScript handles user interactions. JavaScript sends HTTP requests to the FastAPI backend using `fetch()` and updates the interface with the results.

2. **Backend:** FastAPI exposes endpoints for creating, retrieving, renaming, and deleting conversations, as well as sending chat messages.

3. **OpenAI client:** A separate Python module communicates with OpenAI's Responses API. It sends the user's message and the previous response ID associated with the conversation, then returns the assistant's response and the new response ID.

4. **Persistence:** A database operations module reads and writes conversation data to `database/db.json`. Each conversation stores its title, previous response ID, message history, and latest activity timestamp.

**How conversation context works:** Each conversation maintains its own `previous_response_id`. When the user sends another message, the application supplies that ID to the Responses API, linking the new request to the preceding response chain. The application also stores the messages locally so it can reconstruct the conversation in the frontend.

This separates three responsibilities: handling HTTP requests, communicating with the LLM, and storing application data.

## Project Structure

```text
project/
├── app/
│   ├── main.py
│   ├── openai_client.py
│   └── database_operations.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── db.json
├── requirements.txt
├── .env
└── .gitignore
```

* `app/main.py` — defines FastAPI endpoints, handles incoming requests, coordinates the application modules, and serves the frontend.
* `app/openai_client.py` — configures the OpenAI client and sends requests to the Responses API.
* `app/database_operations.py` — handles loading and saving conversation data.
* `frontend/index.html` — defines the chat interface and its elements.
* `frontend/style.css` — controls the appearance and layout of the application.
* `frontend/script.js` — handles conversation creation, switching, renaming, deletion, message sending, and dynamic interface updates.
* `database/db.json` — stores conversation metadata, response IDs, and message history.
* `requirements.txt` — lists the Python dependencies required to run the project.
* `.env` — stores the OpenAI API key locally and should not be committed to version control.

## Prerequisites

* Python installed.
* Git installed.
* An OpenAI API key with access to the selected model.
* An internet connection for communicating with OpenAI's API.

## Run the Existing Project

Clone the repository:

```bash
git clone https://github.com/AyeshaNaime003/openai-chatbot.git
cd openai-chatbot
```

Create and activate a virtual environment on Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```text
OPENAI_API_KEY=your_api_key_here
```

Start the application:

```bash
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000` in your browser.

Keep your API key private. Do not commit your `.env` file to GitHub.

## Build from Scratch

A suggested implementation sequence for recreating the project:

1. Set up the Python environment, install dependencies, and organize the project files.
2. Configure the OpenAI client and test the Responses API independently.
3. Implement conversation storage and retrieval using JSON.
4. Create the FastAPI endpoints for chat and conversation management.
5. Build the HTML interface and style it with CSS.
6. Use JavaScript `fetch()` to connect the frontend to the backend.
7. Implement conversation switching, renaming, deletion, and dynamic sidebar updates.
8. Add loading indicators, error handling, and basic validation.
9. Test conversation persistence and verify that separate conversations maintain separate context chains.

## API Endpoints

| Method   | Endpoint                           | Purpose                                           |
| -------- | ---------------------------------- | ------------------------------------------------- |
| `GET`    | `/conversations`                   | Retrieve conversations for the sidebar.           |
| `POST`   | `/new_conversation`                | Create a conversation.                            |
| `GET`    | `/conversations/{conversation_id}` | Retrieve a conversation and its messages.         |
| `POST`   | `/chat`                            | Send a message and receive an assistant response. |
| `PATCH`  | `/conversations/{conversation_id}` | Rename a conversation.                            |
| `DELETE` | `/conversations/{conversation_id}` | Delete a conversation.                            |

## Limitations and Future Improvements

* **No user accounts or authentication:** Conversations are not associated with individual users. The application does not provide user-specific data isolation, so it should not be treated as a multi-user service.
* **Local JSON storage:** JSON is sufficient for this learning project, but a database would be more suitable for concurrent users, larger datasets, and more robust data management.
* **Text-only interaction:** The application does not support image, audio, video, or file uploads.
* **Limited error handling:** Network failures and API errors could be handled more comprehensively.
* **No production deployment yet:** Hosting, persistent storage, and production configuration need to be addressed before making the application publicly accessible.

Potential future improvements include account-based conversation management, a proper database, richer error handling, media support, and deployment to a hosting platform.