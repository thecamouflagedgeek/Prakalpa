from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("CRIME_GROQ_API_KEY")
)


def analyze(data: dict):
    """
    Receives the payload from the backend.

    Expected payload:
    {
        "station": "...",
        "prompt": "...",
        "analytics": {...}
    }
    """

    prompt = data["prompt"]

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        temperature=0.2,

        max_tokens=800,

        messages=[

            {
                "role": "system",
                "content":
                (
                    "You are a Senior Karnataka Police Intelligence Officer. "
                    "Generate professional operational intelligence reports. "
                    "Never invent facts. "
                    "Use ONLY the supplied intelligence."
                )
            },

            {
                "role": "user",
                "content": prompt
            }

        ]

    )

    return {

        "station": data["station"],

        "report": response.choices[0].message.content,

        "analytics": data["analytics"]

    }

def pattern_summary(data: dict):
    """
    Receives the payload from the backend.

    Expected payload:
    {
        "station": "...",
        "prompt": "...",
        "analytics": {...}
    }

    Returns a short narrative summary (2-4 sentences) rather than
    the full operational report `analyze()` produces.
    """

    prompt = data["prompt"]

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        temperature=0.2,

        max_tokens=250,

        messages=[

            {
                "role": "system",
                "content":
                (
                    "You are a Senior Karnataka Police Intelligence Officer. "
                    "Summarize the supplied crime intelligence into a single, "
                    "clear narrative paragraph (2-4 sentences) explaining the "
                    "key pattern, trend, or risk finding for this station. "
                    "Never invent facts. Use ONLY the supplied intelligence. "
                    "Do not use headings, bullet points, or markdown — plain "
                    "prose only."
                )
            },

            {
                "role": "user",
                "content": prompt
            }

        ]

    )

    return {
        "summary": response.choices[0].message.content
    }