from groq import Groq
from dotenv import load_dotenv
from agents.legal_retriever import retrieve_sections

import json
import os
_key = os.getenv("GROQI")

print(f"[legal_recommender] Using key ending in: ...{_key[-6:] if _key else 'NOT FOUND'}")
load_dotenv()

client = Groq(
    api_key=os.getenv("GROQI")
)


def format_candidates(candidates):
    """
    Give Groq retrieved legal provisions in a compact,
    structured format.
    """

    formatted = []

    for candidate in candidates:

        # Avoid dumping enormous statutory text into prompt
        legal_text = candidate.get("text", "")

        if len(legal_text) > 3500:
            legal_text = legal_text[:3500]

        formatted.append({
            "section": candidate["section"],
            "title": candidate["title"],
            "legal_text": legal_text,
            "classifications": candidate.get(
                "classifications",
                []
            )
        })

    return formatted


def safe_json_load(text):

    text = (
        text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(text)


def recommend_sections(
    incident_description: str
) -> dict:

    # STEP 1: Retrieve relevant BNS provisions
    candidates = retrieve_sections(
        incident_description,
        top_k=10
    )

    candidate_data = format_candidates(
        candidates
    )

    allowed_sections = {
        str(candidate["section"])
        for candidate in candidates
    }

    prompt = f"""
You are KAVACH Legal Assist, a legal decision-support
system for Karnataka Police.

Your task is to analyze an FIR incident and rank the most
relevant provisions of the Bharatiya Nyaya Sanhita (BNS),
2023.

IMPORTANT LEGAL CONSTRAINTS:

1. You may ONLY recommend sections contained in
   CANDIDATE_SECTIONS below.

2. NEVER recommend a section from memory.

3. NEVER recommend an IPC section.

4. Do not invent facts that are absent from the FIR.

5. Select a maximum of 3 provisions.

6. A provision should only be selected when the facts in
   the incident reasonably support its application.

7. If fewer than 3 provisions are justified, return fewer.

8. Explain WHY the facts potentially satisfy the provision.
   Do not merely repeat the section title.

9. These are recommendations for officer review, not final
   legal determinations.

INCIDENT:

{incident_description}


CANDIDATE_SECTIONS:

{json.dumps(candidate_data, ensure_ascii=False)}


Return ONLY valid JSON.

Required structure:

{{
    "recommendations": [
        {{
            "section": "305",
            "why_it_applies":
                "The alleged property was taken from..."
        }}
    ]
}}
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=1200
        )

        raw = response.choices[0].message.content

        result = safe_json_load(raw)

    except Exception as e:

        return {
            "recommendations": [],
            "error": f"Legal analysis failed: {str(e)}"
        }

    # STEP 2:
    # Validate everything Groq returned against retrieval.

    validated = []

    candidate_lookup = {
        str(candidate["section"]): candidate
        for candidate in candidates
    }

    for recommendation in result.get(
        "recommendations",
        []
    ):

        section_number = str(
            recommendation.get("section", "")
        )

        # LLM attempted to invent a provision.
        if section_number not in allowed_sections:
            continue

        source = candidate_lookup[
            section_number
        ]

        classifications = source.get(
            "classifications",
            []
        )

        validated.append({
            "code": "BNS",
            "section": section_number,
            "title": source["title"],
            "why_it_applies": recommendation.get(
                "why_it_applies",
                ""
            ),
            "classifications": classifications,
            "retrieval_score": source.get(
                "retrieval_score"
            )
        })

        if len(validated) == 3:
            break

    return {
        "recommendations": validated,
        "disclaimer":
            "AI-assisted legal recommendations. "
            "Final section selection requires "
            "verification by the investigating officer."
    }