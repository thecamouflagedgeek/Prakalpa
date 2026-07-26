"""
risk.py

Calculates a zone risk score based on crime analytics.
"""

from typing import Dict


def calculate_zone_risk(zone_summary: Dict) -> Dict:
    """
    Calculates a risk score for a police station.

    Inputs:
        zone_summary (dict)

    Returns:
        {
            "risk_score": 78,
            "risk_level": "High",
            "reasoning": [...]
        }
    """

    score = 0
    reasoning = []

    # -----------------------------
    # Crime Volume (40 Points)
    # -----------------------------
    crime_count = zone_summary["crime_count"]

    if crime_count >= 350:
        score += 40
        reasoning.append("Very high crime volume")
    elif crime_count >= 250:
        score += 30
        reasoning.append("High crime volume")
    elif crime_count >= 150:
        score += 20
        reasoning.append("Moderate crime volume")
    else:
        score += 10
        reasoning.append("Low crime volume")

    # -----------------------------
    # Crime Concentration (30 Points)
    # -----------------------------
    breakdown = zone_summary["crime_breakdown"]

    if len(breakdown) > 0:
        top_count = breakdown[0]["count"]
        ratio = top_count / crime_count

        if ratio >= 0.60:
            score += 30
            reasoning.append("One crime type dominates the area")
        elif ratio >= 0.40:
            score += 20
            reasoning.append("High concentration of one crime type")
        else:
            score += 10
            reasoning.append("Crime types are diverse")

    # -----------------------------
    # Active Story (20 Points)
    # -----------------------------
    story = zone_summary["linked_story"]

    if story != "normal":
        score += 20
        reasoning.append("Linked investigation story detected")

    # -----------------------------
    # Peak Time (10 Points)
    # -----------------------------
    if zone_summary["peak_time"] == "Night":
        score += 10
        reasoning.append("Night-time crime concentration")

    # -----------------------------
    # Final Risk Level
    # -----------------------------
    if score >= 80:
        risk = "High"
    elif score >= 50:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "risk_score": score,
        "risk_level": risk,
        "reasoning": reasoning
    }