from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    role: str        
    content: str
    language: str = "en"

class FIRChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"   
    voice_input: bool = False

class FIRChatResponse(BaseModel):
    session_id: str
    reply: str
    fir_progress: dict       
    is_complete: bool
    recommended_sections: Optional[List[dict]] = None

class FIRExportRequest(BaseModel):
    session_id: str

class TTSRequest(BaseModel):
    text: str
    language: str = "en"

class TTSResponse(BaseModel):
    audio_base64: str
    format: str
    language: str