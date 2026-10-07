import json

def load_conversations():
    with open("database\\db.json", "r") as file:
        conversations = json.load(file)
    return conversations

def save_conversations(conversations):
    with open("database\\db.json", "w") as file:
        json.dump(conversations, file)