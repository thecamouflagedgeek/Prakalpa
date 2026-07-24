"""
patterns.py

Crime Pattern Intelligence Engine

Discovers recurring criminal behaviour,
organized crime patterns,
suspect activity,
cluster intelligence,
and operational alerts.
"""

import pandas as pd

TOP_PATTERNS = 5


# =====================================================
# UTILITIES
# =====================================================

def safe_mode(series, default="Unknown"):

    series = series.dropna()

    if series.empty:
        return default

    return series.mode().iloc[0]


def confidence_from_frequency(freq):

    if freq >= 40:
        return 95

    if freq >= 25:
        return 90

    if freq >= 15:
        return 85

    if freq >= 8:
        return 75

    return 65


# =====================================================
# DATA PREPARATION
# =====================================================

def prepare_station_dataframe(df, station):

    zone_df = df[
        df["police_station"] == station
    ].copy()

    if zone_df.empty:
        return None

    return zone_df

# =====================================================
# CRIME BEHAVIOUR PROFILE ENGINE
# =====================================================

def build_crime_profiles(zone_df):

    grouped = (
        zone_df.groupby(
            [
                "crime_head",
                "modus_operandi"
            ]
        )
        .size()
        .reset_index(name="frequency")
        .sort_values(
            "frequency",
            ascending=False
        )
    )

    profiles = []

    for _, row in grouped.head(TOP_PATTERNS).iterrows():

        subset = zone_df[
            (zone_df["crime_head"] == row["crime_head"]) &
            (zone_df["modus_operandi"] == row["modus_operandi"])
        ]

        locations = (
            subset["place_of_offence"]
            .value_counts()
            .head(3)
            .index
            .tolist()
        )

        peak_period = safe_mode(
            subset["time_slot"]
        )

        crime_group = safe_mode(
            subset["crime_group"]
        )

        linked_cluster = safe_mode(
            subset["linked_case_cluster"],
            "No Cluster"
        )

        suspect_group = safe_mode(
            subset["suspect_group"],
            "Unknown"
        )

        suspect_vehicle = safe_mode(
            subset["suspect_vehicle"],
            "Unknown"
        )

        act_sections = (
            subset["act_section"]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )

        avg_risk = safe_mode(
            subset["risk_level"],
            "Medium"
        )

        patrol_priority = safe_mode(
            subset["patrol_priority"],
            "Routine"
        )

        confidence = confidence_from_frequency(
            row["frequency"]
        )

        # ------------------------------------------
        # Pattern Classification
        # ------------------------------------------

        if row["frequency"] >= 40:
            pattern_type = "Highly Recurring"

        elif row["frequency"] >= 20:
            pattern_type = "Recurring"

        elif row["frequency"] >= 10:
            pattern_type = "Emerging"

        else:
            pattern_type = "Isolated"

        # ------------------------------------------
        # Operational Recommendation
        # ------------------------------------------

        if row["crime_head"] == "Vehicle Theft":

            recommendation = (
                "Increase motorcycle patrols, deploy ANPR cameras, "
                "and monitor parking areas."
            )

        elif row["crime_head"] == "Robbery":

            recommendation = (
                "Increase mobile patrols and surveillance during peak hours."
            )

        elif row["crime_head"] == "Burglary":

            recommendation = (
                "Increase residential beat patrols and CCTV monitoring."
            )

        elif row["crime_head"] == "Fatal Accident":

            recommendation = (
                "Increase traffic enforcement and speed monitoring."
            )

        else:

            recommendation = (
                "Increase police visibility and monitor recurring locations."
            )

        # ------------------------------------------
        # Intelligence Object
        # ------------------------------------------

        profiles.append({

            "pattern_name":
                f"{row['crime_head']} Behaviour Profile",

            "pattern_type":
                pattern_type,

            "crime":
                row["crime_head"],

            "crime_group":
                crime_group,

            "modus_operandi":
                row["modus_operandi"],

            "frequency":
                int(row["frequency"]),

            "confidence":
                confidence,

            "linked_cluster":
                linked_cluster,

            "suspect_group":
                suspect_group,

            "suspect_vehicle":
                suspect_vehicle,

            "preferred_locations":
                locations,

            "peak_period":
                peak_period,

            "historical_risk":
                avg_risk,

            "patrol_priority":
                patrol_priority,

            "act_sections":
                act_sections,

            "recommended_action":
                recommendation,

            "operational_alert":
                (
                    f"{row['crime_head']} repeatedly follows the "
                    f"same modus operandi across "
                    f"{len(locations)} primary locations."
                )

        })

    return profiles

# =====================================================
# ORGANIZED CRIME INTELLIGENCE
# =====================================================

def build_organized_crime_intelligence(zone_df):

    organized_groups = []

    grouped = (
        zone_df.groupby("suspect_group")
        .size()
        .reset_index(name="cases")
        .sort_values("cases", ascending=False)
    )

    for _, row in grouped.iterrows():

        if pd.isna(row["suspect_group"]):
            continue

        if row["suspect_group"] in ["Unknown", "None", ""]:
            continue

        subset = zone_df[
            zone_df["suspect_group"] == row["suspect_group"]
        ]

        locations = (
            subset["place_of_offence"]
            .value_counts()
            .head(5)
            .index
            .tolist()
        )

        crimes = (
            subset["crime_head"]
            .value_counts()
            .head(5)
            .index
            .tolist()
        )

        clusters = (
            subset["linked_case_cluster"]
            .dropna()
            .unique()
            .tolist()
        )

        organized_groups.append({

            "suspect_group":
                row["suspect_group"],

            "total_cases":
                int(row["cases"]),

            "primary_crimes":
                crimes,

            "operating_locations":
                locations,

            "linked_clusters":
                clusters,

            "threat_level":
                "HIGH" if row["cases"] >= 15 else
                "MEDIUM" if row["cases"] >= 8 else
                "LOW",

            "confidence":
                confidence_from_frequency(row["cases"])

        })

    return organized_groups


# =====================================================
# LOCATION INTELLIGENCE
# =====================================================

def build_location_network(zone_df):

    hotspots = []

    grouped = (
        zone_df.groupby("place_of_offence")
        .size()
        .reset_index(name="cases")
        .sort_values("cases", ascending=False)
    )

    for _, row in grouped.head(5).iterrows():

        subset = zone_df[
            zone_df["place_of_offence"] == row["place_of_offence"]
        ]

        hotspots.append({

            "location":
                row["place_of_offence"],

            "cases":
                int(row["cases"]),

            "dominant_crime":
                safe_mode(subset["crime_head"]),

            "peak_period":
                safe_mode(subset["time_slot"]),

            "active_group":
                safe_mode(subset["suspect_group"]),

            "cluster":
                safe_mode(
                    subset["linked_case_cluster"],
                    "No Cluster"
                ),

            "risk":
                safe_mode(
                    subset["risk_level"],
                    "Medium"
                )

        })

    return hotspots


# =====================================================
# OPERATIONAL ALERT ENGINE
# =====================================================

def build_operational_alerts(profiles, gangs, hotspots):

    alerts = []

    for profile in profiles:

        if profile["confidence"] >= 90:

            alerts.append({

                "severity": "HIGH",

                "type": "Recurring Crime Pattern",

                "title":
                    profile["crime"],

                "description":
                    profile["operational_alert"],

                "recommended_action":
                    profile["recommended_action"]

            })

    for gang in gangs:

        if gang["threat_level"] == "HIGH":

            alerts.append({

                "severity": "CRITICAL",

                "type": "Organized Crime",

                "title":
                    gang["suspect_group"],

                "description":
                    f"{gang['suspect_group']} has been linked "
                    f"to {gang['total_cases']} cases across "
                    f"{len(gang['operating_locations'])} locations.",

                "recommended_action":
                    "Deploy surveillance, increase patrols, and coordinate with neighbouring stations."

            })

    for hotspot in hotspots:

        if hotspot["risk"] == "High":

            alerts.append({

                "severity": "HIGH",

                "type": "Hotspot",

                "title":
                    hotspot["location"],

                "description":
                    f"{hotspot['location']} is a recurring hotspot for "
                    f"{hotspot['dominant_crime']}.",

                "recommended_action":
                    "Increase police visibility and targeted patrolling."

            })

    return alerts

# =====================================================
# EXECUTIVE SUMMARY
# =====================================================

def build_executive_summary(profiles, gangs, hotspots, alerts):

    if profiles:
        dominant_crime = profiles[0]["crime"]
    else:
        dominant_crime = "Unknown"

    if hotspots:
        hotspot = hotspots[0]["location"]
    else:
        hotspot = "Unknown"

    high_alerts = len(
        [a for a in alerts if a["severity"] in ["HIGH", "CRITICAL"]]
    )

    organized = len(
        [g for g in gangs if g["threat_level"] == "HIGH"]
    )

    if organized > 0:
        threat = "HIGH"

    elif high_alerts >= 3:
        threat = "MEDIUM"

    else:
        threat = "LOW"

    return {

        "overall_threat": threat,

        "dominant_crime": dominant_crime,

        "primary_hotspot": hotspot,

        "organized_groups_detected": organized,

        "high_priority_alerts": high_alerts,

        "summary":
            f"{dominant_crime} is currently the dominant recurring crime. "
            f"The highest activity is concentrated around {hotspot}. "
            f"{organized} organized suspect groups were identified."

    }


# =====================================================
# EXPLAINABILITY
# =====================================================

def build_explainability(profiles, gangs, hotspots):

    reasons = []

    if profiles:

        reasons.append(
            f"{profiles[0]['crime']} is the most frequently recurring crime."
        )

    if hotspots:

        reasons.append(
            f"{hotspots[0]['location']} recorded the highest criminal activity."
        )

    if gangs:

        reasons.append(
            f"{len(gangs)} suspect groups were identified from historical records."
        )

    reasons.append(
        f"{len(profiles)} recurring behavioural profiles were discovered."
    )

    return reasons


# =====================================================
# MAIN API
# =====================================================

def get_patterns(df: pd.DataFrame, station: str):

    zone_df = prepare_station_dataframe(df, station)

    if zone_df is None:
        return None

    profiles = build_crime_profiles(zone_df)

    gangs = build_organized_crime_intelligence(zone_df)

    hotspots = build_location_network(zone_df)

    alerts = build_operational_alerts(
        profiles,
        gangs,
        hotspots
    )

    summary = build_executive_summary(
        profiles,
        gangs,
        hotspots,
        alerts
    )

    explainability = build_explainability(
        profiles,
        gangs,
        hotspots
    )

    return {

        # ======================================
        # BASIC INFO
        # ======================================

        "station": station,

        "total_cases": int(len(zone_df)),

        # ======================================
        # EXECUTIVE SUMMARY
        # ======================================

        "executive_summary": summary,

        # ======================================
        # CRIME BEHAVIOUR PROFILES
        # ======================================

        "crime_behaviour_profiles": profiles,

        # ======================================
        # ORGANIZED CRIME
        # ======================================

        "organized_crime": gangs,

        # ======================================
        # LOCATION NETWORK
        # ======================================

        "location_network": hotspots,

        # ======================================
        # OPERATIONAL ALERTS
        # ======================================

        "operational_alerts": alerts,

        # ======================================
        # EXPLAINABILITY
        # ======================================

        "explainability": explainability,

        # ======================================
        # METADATA
        # ======================================

        "metadata": {

            "profiles_detected": len(profiles),

            "organized_groups": len(gangs),

            "hotspots": len(hotspots),

            "alerts": len(alerts)

        }

    }