from groq import Groq
from dotenv import load_dotenv
import json
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FIR_FIELDS = [
    "complainant_name",
    "complainant_contact",
    "complainant_address",
    "incident_date",
    "incident_time",
    "incident_location",
    "incident_description",
    "accused_description",
    "witnesses",
    "stolen_property",
    "injuries_reported"
]

# In-memory session store
sessions = {}

def get_or_create_session(session_id: str, language: str = "en"):
    if session_id not in sessions:
        sessions[session_id] = {
            "history": [],
            "collected_data": {},
            "language": language,
            "is_complete": False
        }
    return sessions[session_id]

def get_remaining_fields(collected_data: dict) -> list:
    return [f for f in FIR_FIELDS if not collected_data.get(f)]

def extract_data(history: list) -> dict:
    conversation_text = "\n".join([f"{m['role']}: {m['parts'][0]}" for m in history])

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": f"""Extract FIR information from this conversation into JSON.
Only include fields clearly mentioned. Return ONLY raw JSON, no markdown.

Conversation:
{conversation_text}

Keys to extract (omit if not mentioned):
complainant_name, complainant_contact, complainant_address,
incident_date, incident_time, incident_location,
incident_description, accused_description, witnesses,
stolen_property, injuries_reported"""
        }]
    )
    try:
        text=response.choices[0].message.content
        text=text.replace("```json","").replace("```","").strip()
        return json.loads(text)
    except:
        return {}

def build_system_prompt(collected_data: dict, remaining: list, language: str) -> str:
    if language == "kn":
        return f"""
        ನೀವು KAVACH, ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್‌ನ AI ಸಹಾಯಕ.
        FIR ದಾಖಲಿಸಲು ಸಹಾಯ ಮಾಡಿ. ಒಂದು ಸಮಯದಲ್ಲಿ ಒಂದು ಪ್ರಶ್ನೆ ಮಾತ್ರ ಕೇಳಿ.
        ಸೌಮ್ಯವಾಗಿ ಮತ್ತು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.
        
        ಈಗಾಗಲೇ ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿ: {json.dumps(collected_data, ensure_ascii=False)}
        ಇನ್ನೂ ಬೇಕಾದ ಮಾಹಿತಿ: {remaining}
        
        ಎಲ್ಲಾ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸಿದ ನಂತರ FIR ಸಾರಾಂಶ ಮಾಡಿ ಮತ್ತು ದೃಢೀಕರಣ ಕೇಳಿ.
        """
    else:
        return f"""
        You are KAVACH, an AI assistant for the Karnataka State Police helping lodge an FIR.
        
        Your job:
        - Ask ONE question at a time, never multiple
        - Be empathetic — the person may be distressed
        - If the user is vague, ask a gentle follow-up
        - Once all fields are collected, summarize the FIR and ask for confirmation
        - Keep responses short and clear
        - If the user speaks in Kannada, switch to Kannada
        
        Already collected: {json.dumps(collected_data, ensure_ascii=False)}
        Still needed: {remaining}
        
        {"All information collected. Now summarize the FIR clearly and ask the user to confirm." if not remaining else ""}
        """

def chat(session_id: str, user_message: str, language: str = "en") -> dict:
    session = get_or_create_session(session_id, language)

    session["history"].append({
        "role": "user",
        "parts": [user_message]
    })

    session["collected_data"] = extract_data(session["history"])
    remaining = get_remaining_fields(session["collected_data"])
    is_complete = len(remaining) == 0

    system_prompt = build_system_prompt(
        session["collected_data"], remaining, language
    )

    # Build messages for Groq
    messages = [{"role": "system", "content": system_prompt}]
    for m in session["history"]:
        messages.append({
            "role": "user" if m["role"] == "user" else "assistant",
            "content": m["parts"][0]
        })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=500
    )

    reply = response.choices[0].message.content

    session["history"].append({
        "role": "model",
        "parts": [reply]
    })

    session["is_complete"] = is_complete
    filled = len(FIR_FIELDS) - len(remaining)

    return {
        "session_id": session_id,
        "reply": reply,
        "fir_progress": {
            "filled": filled,
            "total": len(FIR_FIELDS),
            "percent": int((filled / len(FIR_FIELDS)) * 100),
            "collected_data": session["collected_data"]
        },
        "is_complete": is_complete,
        "language": language
    }