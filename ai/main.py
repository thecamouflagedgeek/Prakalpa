from fastapi import FastAPI
from pydantic import BaseModel
from agents.fir_agent import chat, sessions
app = FastAPI(title="KAVACH AI Engine")

class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"

@app.post("/agent/fir/chat")
def fir_chat(request: ChatRequest):
    return chat(request.session_id, request.message, request.language)

@app.get("/agent/fir/session/{session_id}")
def get_session(session_id: str):
    return sessions.get(session_id, {})
