from fastapi import APIRouter
from app.schemas.fir import FIRChatRequest, FIRChatResponse
import httpx

router = APIRouter(prefix="/fir", tags=["FIR"])

AI_ENGINE_URL = "http://localhost:8001"

@router.post("/chat", response_model=FIRChatResponse)
async def fir_chat(request: FIRChatRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_ENGINE_URL}/agent/fir/chat",
            json=request.dict()
        )
    return response.json()

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{AI_ENGINE_URL}/agent/fir/session/{session_id}"
        )
    return response.json()