from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(title="KAVACH Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"

@app.get("/")
def root():
    return {"message": "KAVACH Backend Running"}

@app.post("/api/v1/fir/chat")
async def fir_chat(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:8001/agent/fir/chat",
            json=request.dict(),
            timeout=30.0
        )
    return response.json()