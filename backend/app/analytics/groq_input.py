"""
groq_input.py

Builds the complete intelligence package that will be
sent to the Groq LLM.
"""

from app.analytics.forecast import get_forecast
from app.analytics.patterns import get_patterns
from app.analytics.anomaly import get_anomalies
from app.analytics.prompt_builder import build_prompt


def build_groq_input(df, station_name):
    """
    Generates the complete AI input for Groq.

    Returns:
    {
        "station": "...",
        "prompt": "...",
        "analytics": {...}
    }
    """

    # ---------------------------------------
    # Generate intelligence
    # ---------------------------------------

    forecast = get_forecast(df, station_name)

    patterns = get_patterns(df, station_name)

    anomalies = get_anomalies(df, station_name)

    # ---------------------------------------
    # Build Prompt
    # ---------------------------------------

    prompt = build_prompt(
        forecast=forecast,
        patterns=patterns,
        anomalies=anomalies
    )

    # ---------------------------------------
    # Return package
    # ---------------------------------------

    return {

        "station": station_name,

        "prompt": prompt,

        "analytics": {

            "forecast": forecast,

            "patterns": patterns,

            "anomalies": anomalies

        }

    }