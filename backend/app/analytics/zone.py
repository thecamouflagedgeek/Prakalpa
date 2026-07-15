"""
zone.py

Generates detailed intelligence for a selected police station.
"""

import pandas as pd
from app.analytics.risk import calculate_zone_risk


def get_zone_summary(df: pd.DataFrame, zone: str):

    zone_df = df[df["police_station"] == zone]

    if zone_df.empty:
        return None

    crime_breakdown = (
        zone_df["crime_head"]
        .value_counts()
        .reset_index()
    )

    crime_breakdown.columns = ["crime", "count"]

    summary = {

        "zone": zone,

        "district":
        zone_df["district"].iloc[0],

        "crime_count":
        len(zone_df),

        "top_crime":
        zone_df["crime_head"].mode()[0],

        "crime_breakdown":
        crime_breakdown.to_dict(orient="records"),

        "peak_time":
        zone_df["time_slot"].mode()[0],

        "common_weather":
        zone_df["weather"].mode()[0],

        "festival":
        zone_df["festival_flag"].mode()[0],

        "linked_story":
        zone_df["ai_story_tag"].mode()[0],

    }
    risk_info = calculate_zone_risk(summary)

    summary["risk"] = risk_info["risk_level"]
    summary["risk_score"] = risk_info["risk_score"]
    summary["reasoning"] = risk_info["reasoning"]

    return summary
    