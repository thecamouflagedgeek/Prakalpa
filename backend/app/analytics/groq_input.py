"""
groq_input.py

Prepares structured intelligence for the Groq LLM.
"""

from typing import Dict


def build_groq_input(zone_summary: Dict) -> Dict:
    """
    Converts analytics output into a structured JSON payload
    suitable for the Groq LLM.
    """

    payload = {

        "role": "Karnataka Police Crime Intelligence Officer",

        "zone": zone_summary["zone"],

        "district": zone_summary["district"],

        "crime_statistics": {

            "crime_count": zone_summary["crime_count"],

            "top_crime": zone_summary["top_crime"],

            "risk_level": zone_summary["risk"],

            "risk_score": zone_summary["risk_score"]

        },

        "patterns": {

            "peak_time": zone_summary["peak_time"],

            "weather": zone_summary["common_weather"],

            "festival": zone_summary["festival"],

            "linked_story": zone_summary["linked_story"]

        },

        "crime_breakdown":
        zone_summary["crime_breakdown"],

        "reasoning":
        zone_summary["reasoning"]

    }

    return payload