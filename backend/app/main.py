from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx, uuid, json
from datetime import datetime

app = FastAPI(title="Prakalpa Backend")
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
users= {
    "citizen001": {"password": "citizen123", "role": "citizen", "name": "Rahul Kumar"},
    "citizen002": {"password": "citizen123", "role": "citizen", "name": "Priya Sharma"},
    "officer001": {"password": "officer123", "role": "officer", "name": "SI Ravi Kumar", "badge": "KSP-2341"},
    "officer002": {"password": "officer123", "role": "officer", "name": "SI Anitha Rao", "badge": "KSP-1892"},
}
complaints= {}

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    role: str
    name: str
    username: str
    badge: Optional[str] = None

@app.post("/api/v1/auth/login", response_model=LoginResponse)
def login(req: LoginRequest):
    user=users.get(req.username)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "success": True,
        "role": user["role"],
        "name": user["name"],
        "username": req.username,
        "badge": user.get("badge"),
    }

class ComplaintSubmit(BaseModel):
    citizen_username: str
    citizen_name: str
    mode: str 
    incident_type: Optional[str] = None
    incident_date: Optional[str] = None
    incident_time: Optional[str] = None
    incident_location: Optional[str] = None
    incident_description: Optional[str] = None
    accused_description: Optional[str] = None
    witnesses: Optional[str] = None
    evidence: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    

    chat_session_id: Optional[str] = None
    chat_collected_data: Optional[dict] = None

@app.post("/api/v1/complaints/submit")
def submit_complaint(complaint: ComplaintSubmit):
    complaint_id = f"CMP-{str(uuid.uuid4())[:8].upper()}"
    complaints[complaint_id] = {
        **complaint.dict(),
        "complaint_id": complaint_id,
        "status": "PENDING",
        "submitted_at": datetime.now().isoformat(),
        "assigned_officer": None,
        "fir_number": None,
    }
    return {"success": True, "complaint_id": complaint_id}

@app.get("/api/v1/complaints/all")
def get_all_complaints():
    return list(complaints.values())

@app.get("/api/v1/complaints/{complaint_id}")
def get_complaint(complaint_id: str):
    c=complaints.get(complaint_id)
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return c

@app.patch("/api/v1/complaints/{complaint_id}/assign")
def assign_officer(complaint_id: str, body: dict):
    c=complaints.get(complaint_id)
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    c["assigned_officer"] = body.get("officer_username")
    c["status"] = "UNDER_REVIEW"
    return c

@app.patch("/api/v1/complaints/{complaint_id}/file-fir")
def file_fir(complaint_id: str):
    c=complaints.get(complaint_id)
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    c["status"] = "FIR_FILED"
    c["fir_number"] = f"FIR-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
    return c

#for ai engie
class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"

@app.post("/api/v1/fir/chat")
async def fir_chat(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post("http://127.0.0.1:8001/agent/fir/chat",json=request.dict(), timeout=30.0)
    return response.json()