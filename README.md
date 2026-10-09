Project overview — The project's aim is for me to learn multiple aspects fo modern llms
1. use of openai api models for making a chatbot
2. using previous_response_id to maintain the converation (but this will be maintendon the opeanai side, we ahve not implemented any backend logic for this)
3. we are saving the messages for each converation but mostly for display purposes and not so model can remember the converation
4. handling multiple conversations: using dummy conversations and being able to switch bw them and extend them
5. from using variable db to json db, Conversations class is no longer being used
5. making new chats: working but need to clean both js and where the db gets opened in the db
6. deleting old ones 


issue to resolve
1. bubble whe the assistant is thinking
2. menu should disappear when clicked anywhere else
4. responsiveness

Tools and pacakges
openai responses
pydantic for http request data validation
slef made converation class for handling multiple converations
fastapi for backend app
uvicorn for running it

HOw the project was made
venv, installations, requirements
uvicorn needed to run the fastapi app
app -> main and openai_client
app/main: routing and 
app/opena--client: Memory class for holding reponse ids, chat fucntions to call openai
frontned: input, button, response
js sends the post request to backend
how will frontend send index.html? mount the staticfiles 

--------------------------------------------------------------------------
