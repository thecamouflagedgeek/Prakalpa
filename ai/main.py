from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any

from agents.fir_agent import chat, sessions
from agents.crime_agent import analyze
from agents.legal_recommender import recommend_sections

app = FastAPI(title="KAVACH AI Engine")


class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"


class CrimeRequest(BaseModel):
    station: str
    prompt: str
    analytics: Dict[str, Any]


class LegalRecommendationRequest(BaseModel):
    incident_description: str


@app.post("/agent/fir/chat")
def fir_chat(request: ChatRequest):
    return chat(
        request.session_id,
        request.message,
        request.language
    )


@app.get("/agent/fir/session/{session_id}")
def get_session(session_id: str):
    return sessions.get(session_id, {})


@app.post("/agent/crime/analyze")
def crime_analysis(request: CrimeRequest):
    return analyze(request.model_dump())


@app.post("/agent/legal/recommend")
def legal_recommend(request: LegalRecommendationRequest):
    return recommend_sections(request.incident_description)