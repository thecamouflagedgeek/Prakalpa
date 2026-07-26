"""
forecast.py

PRISM Crime Intelligence Forecast Engine

This module predicts crime risk for a police station by combining
historical crime patterns, hotspot analysis, temporal trends,
deployment intelligence and explainable reasoning.
"""

import pandas as pd
import numpy as np

# ==========================================================
# CONFIGURATION
# ==========================================================

HIGH_RISK_THRESHOLD = 85
MEDIUM_RISK_THRESHOLD = 55

TOP_CRIMES = 3
TOP_LOCATIONS = 3

RECENT_DAYS = 30
PREVIOUS_DAYS = 60

# ==========================================================
# GENERIC HELPERS
# ==========================================================

def safe_mode(series, default="Unknown"):
    """
    Safely return the mode of a series.
    """

    series = series.dropna()

    if series.empty:
        return default

    return series.mode().iloc[0]


def safe_percentage(value, total):

    if total == 0:
        return 0

    return round((value / total) * 100)


def normalize_score(value, minimum, maximum):

    if maximum == minimum:
        return 0

    return ((value - minimum) / (maximum - minimum)) * 100


def confidence_from_score(score):

    score = min(score, 100)

    if score < 50:
        return 70

    if score < 70:
        return 80

    if score < 85:
        return 90

    return 95


# ==========================================================
# DATA EXTRACTION
# ==========================================================

def prepare_station_dataframe(df, station):

    zone_df = df[df["police_station"] == station].copy()

    if zone_df.empty:
        return None

    zone_df["occurrence_datetime"] = pd.to_datetime(
        zone_df["occurrence_datetime"]
    )

    zone_df["hour"] = (
        zone_df["occurrence_datetime"]
        .dt.hour
    )

    zone_df["weekday"] = (
        zone_df["occurrence_datetime"]
        .dt.day_name()
    )

    zone_df["month"] = (
        zone_df["occurrence_datetime"]
        .dt.month
    )

    return zone_df

# ==========================================================
# INTELLIGENCE SCORING ENGINE
# ==========================================================

def calculate_historical_crime_score(zone_df):
    """
    Measures historical crime volume.
    """

    total_cases = len(zone_df)

    if total_cases >= 200:
        score = 40
        level = "Very High"

    elif total_cases >= 120:
        score = 32
        level = "High"

    elif total_cases >= 70:
        score = 24
        level = "Moderate"

    elif total_cases >= 30:
        score = 15
        level = "Low"

    else:
        score = 8
        level = "Very Low"

    return {
        "score": score,
        "cases": total_cases,
        "level": level
    }


# ----------------------------------------------------------

def calculate_recent_trend_score(zone_df):
    """
    Compare last 30 days with previous 30 days.
    """

    latest = zone_df["occurrence_datetime"].max()

    recent = zone_df[
        zone_df["occurrence_datetime"]
        >= latest - pd.Timedelta(days=30)
    ]

    previous = zone_df[
        (
            zone_df["occurrence_datetime"]
            >= latest - pd.Timedelta(days=60)
        )
        &
        (
            zone_df["occurrence_datetime"]
            < latest - pd.Timedelta(days=30)
        )
    ]

    recent_cases = len(recent)
    previous_cases = len(previous)

    if previous_cases == 0:

        return {
            "score": 10,
            "trend": "Unknown",
            "change": 0
        }

    change = (
        (recent_cases - previous_cases)
        / previous_cases
    ) * 100

    if change >= 40:

        score = 30
        trend = "Rapid Increase"

    elif change >= 20:

        score = 22
        trend = "Increasing"

    elif change >= 5:

        score = 15
        trend = "Slight Increase"

    elif change <= -20:

        score = 5
        trend = "Decreasing"

    else:

        score = 10
        trend = "Stable"

    return {

        "score": score,

        "trend": trend,

        "change": round(change, 1)

    }


# ----------------------------------------------------------

def calculate_risk_score(zone_df):
    """
    Uses historical risk labels.
    """

    risk = safe_mode(
        zone_df["risk_level"],
        "Medium"
    )

    scores = {

        "High": 25,

        "Medium": 15,

        "Low": 5

    }

    return {

        "score": scores.get(risk, 10),

        "risk": risk

    }


# ----------------------------------------------------------

def calculate_weather_festival_score(zone_df):
    """
    External environmental influence.
    """

    score = 0

    reasons = []

    weather = safe_mode(
        zone_df["weather"]
    )

    if weather in ["Clear", "Cloudy"]:

        score += 8

        reasons.append(
            f"{weather} weather historically has higher crime occurrence."
        )

    festival = safe_mode(
        zone_df["festival_flag"],
        False
    )

    if bool(festival):

        score += 15

        reasons.append(
            "Festival periods historically increase activity."
        )

    return {

        "score": score,

        "reasons": reasons

    }


# ----------------------------------------------------------

def calculate_diversity_score(zone_df):
    """
    Measures diversity of crime categories.
    """

    unique_crimes = zone_df["crime_head"].nunique()

    unique_groups = zone_df["crime_group"].nunique()

    score = min(

        (unique_crimes * 1.5)

        +

        (unique_groups * 2),

        20

    )

    return {

        "score": round(score),

        "crime_types": unique_crimes,

        "crime_groups": unique_groups

    }


# ----------------------------------------------------------

def calculate_overall_intelligence(zone_df):
    """
    Master intelligence score.
    """

    historical = calculate_historical_crime_score(zone_df)

    trend = calculate_recent_trend_score(zone_df)

    risk = calculate_risk_score(zone_df)

    weather = calculate_weather_festival_score(zone_df)

    diversity = calculate_diversity_score(zone_df)

    total = (

        historical["score"]

        +

        trend["score"]

        +

        risk["score"]

        +

        weather["score"]

        +

        diversity["score"]

    )

    if total >= HIGH_RISK_THRESHOLD:

        level = "HIGH"

    elif total >= MEDIUM_RISK_THRESHOLD:

        level = "MEDIUM"

    else:

        level = "LOW"

    return {

        "overall_score": total,

        "overall_risk": level,

        "confidence": confidence_from_score(total),

        "historical": historical,

        "trend": trend,

        "risk": risk,

        "weather": weather,

        "diversity": diversity

    }

# ==========================================================
# CRIME INTELLIGENCE ENGINE
# ==========================================================

def build_crime_intelligence(zone_df):
    """
    Builds intelligence for the most probable crimes.
    """

    crime_counts = (
        zone_df["crime_head"]
        .value_counts()
        .head(TOP_CRIMES)
    )

    total_cases = len(zone_df)

    intelligence = []

    for crime, count in crime_counts.items():

        crime_df = zone_df[
            zone_df["crime_head"] == crime
        ]

        probability = round(
            (count / total_cases) * 100
        )

        crime_group = safe_mode(
            crime_df["crime_group"]
        )

        hotspot = safe_mode(
            crime_df["place_of_offence"]
        )

        peak_period = safe_mode(
            crime_df["time_slot"]
        )

        cluster = safe_mode(
            crime_df["linked_case_cluster"],
            "No Cluster"
        )

        suspect_group = safe_mode(
            crime_df["suspect_group"],
            "Unknown"
        )

        suspect_vehicle = safe_mode(
            crime_df["suspect_vehicle"],
            "Unknown"
        )

        patrol_priority = safe_mode(
            crime_df["patrol_priority"],
            "Medium"
        )

        historical_risk = safe_mode(
            crime_df["risk_level"],
            "Medium"
        )

        confidence = min(
            95,
            65 + probability // 2
        )

        # -----------------------------------------
        # Deployment Recommendation
        # -----------------------------------------

        if crime == "Vehicle Theft":

            deployment = "Motorcycle Patrol"

        elif crime == "Robbery":

            deployment = "Mobile Patrol Unit"

        elif crime == "Burglary":

            deployment = "Residential Beat Patrol"

        elif crime == "Fatal Accident":

            deployment = "Traffic Patrol"

        elif crime == "Cyber Crime":

            deployment = "Cyber Investigation Team"

        else:

            deployment = "Routine Patrol"

        intelligence.append({

            "crime": crime,

            "crime_group": crime_group,

            "probability": probability,

            "likely_location": hotspot,

            "peak_period": peak_period,

            "historical_risk": historical_risk,

            "linked_cluster": cluster,

            "suspect_group": suspect_group,

            "suspect_vehicle": suspect_vehicle,

            "recommended_deployment": deployment,

            "confidence": confidence

        })

    return intelligence


# ==========================================================
# HOTSPOT INTELLIGENCE
# ==========================================================

def build_location_intelligence(zone_df):
    """
    Generates hotspot-wise intelligence.
    """

    hotspots = []

    top_places = (
        zone_df["place_of_offence"]
        .value_counts()
        .head(TOP_LOCATIONS)
        .index
    )

    for place in top_places:

        place_df = zone_df[
            zone_df["place_of_offence"] == place
        ]

        dominant_crime = safe_mode(
            place_df["crime_head"]
        )

        peak_period = safe_mode(
            place_df["time_slot"]
        )

        patrol = safe_mode(
            place_df["patrol_priority"]
        )

        risk = safe_mode(
            place_df["risk_level"]
        )

        hotspots.append({

            "location": place,

            "risk": risk,

            "dominant_crime": dominant_crime,

            "peak_period": peak_period,

            "historical_cases": len(place_df),

            "recommended_patrol": patrol

        })

    return hotspots


# ==========================================================
# TEMPORAL INTELLIGENCE
# ==========================================================

def build_time_intelligence(zone_df):
    """
    Finds the busiest crime periods.
    """

    period_counts = (
        zone_df["time_slot"]
        .value_counts()
    )

    total = len(zone_df)

    output = []

    for period, count in period_counts.items():

        percentage = round(
            count / total * 100
        )

        dominant = safe_mode(

            zone_df[
                zone_df["time_slot"] == period
            ]["crime_head"]

        )

        output.append({

            "time_period": period,

            "crime_share": percentage,

            "dominant_crime": dominant,

            "cases": count

        })

    return output

# ==========================================================
# DEPLOYMENT INTELLIGENCE
# ==========================================================

def build_deployment_plan(crime_intelligence, location_intelligence):

    deployment = []

    for crime in crime_intelligence:

        priority = "HIGH"

        if crime["historical_risk"] == "Medium":
            priority = "MEDIUM"

        elif crime["historical_risk"] == "Low":
            priority = "LOW"

        deployment.append({

            "location": crime["likely_location"],

            "crime": crime["crime"],

            "deployment": crime["recommended_deployment"],

            "priority": priority,

            "reason":
                f"{crime['crime']} is most likely to occur "
                f"during {crime['peak_period']} in "
                f"{crime['likely_location']}."

        })

    return deployment


# ==========================================================
# EXPLAINABILITY ENGINE
# ==========================================================

def build_explainability_report(intelligence):

    reasons = []

    reasons.append(
        f"Historical crime level is "
        f"{intelligence['historical']['level']} "
        f"({intelligence['historical']['cases']} recorded cases)."
    )

    reasons.append(
        f"Recent crime trend: "
        f"{intelligence['trend']['trend']} "
        f"({intelligence['trend']['change']}%)."
    )

    reasons.append(
        f"Historical station risk is "
        f"{intelligence['risk']['risk']}."
    )

    if intelligence["weather"]["reasons"]:

        reasons.extend(
            intelligence["weather"]["reasons"]
        )

    reasons.append(
        f"{intelligence['diversity']['crime_types']} unique crime "
        f"types across "
        f"{intelligence['diversity']['crime_groups']} crime groups."
    )

    return reasons


# ==========================================================
# MAIN FORECAST FUNCTION
# ==========================================================

def get_forecast(df, station):

    zone_df = prepare_station_dataframe(
        df,
        station
    )

    if zone_df is None:
        return None

    intelligence = calculate_overall_intelligence(
        zone_df
    )

    crime_forecast = build_crime_intelligence(
        zone_df
    )

    location_intelligence = build_location_intelligence(
        zone_df
    )

    temporal_intelligence = build_time_intelligence(
        zone_df
    )

    deployment_plan = build_deployment_plan(
        crime_forecast,
        location_intelligence
    )

    explainability = build_explainability_report(
        intelligence
    )

    return {

        # =====================================
        # OVERALL SUMMARY
        # =====================================

        "station": station,

        "forecast_period": "Next 7 Days",

        "overall_risk": intelligence["overall_risk"],

        "overall_score": intelligence["overall_score"],

        "confidence": intelligence["confidence"],


        # =====================================
        # CRIME FORECAST
        # =====================================

        "crime_forecast": crime_forecast,


        # =====================================
        # LOCATION INTELLIGENCE
        # =====================================

        "location_intelligence":
            location_intelligence,


        # =====================================
        # TEMPORAL INTELLIGENCE
        # =====================================

        "time_intelligence":
            temporal_intelligence,


        # =====================================
        # DEPLOYMENT
        # =====================================

        "deployment_plan":
            deployment_plan,


        # =====================================
        # EXPLAINABILITY
        # =====================================

        "risk_factors":
            explainability,


        # =====================================
        # DASHBOARD METADATA
        # =====================================

        "metadata": {

            "historical_cases":
                intelligence["historical"]["cases"],

            "historical_risk":
                intelligence["risk"]["risk"],

            "crime_types":
                intelligence["diversity"]["crime_types"],

            "crime_groups":
                intelligence["diversity"]["crime_groups"]

        }

    }