"""
anomaly.py

Crime Anomaly Intelligence Engine

Detects unusual criminal activity,
emerging hotspots,
crime spikes,
gang expansion,
cluster expansion,
and operational anomalies.
"""

import pandas as pd
import numpy as np

TOP_ANOMALIES = 10

HIGH_SPIKE = 1.50
MEDIUM_SPIKE = 1.25


# ==========================================================
# UTILITIES
# ==========================================================

def safe_mode(series, default="Unknown"):

    series = series.dropna()

    if series.empty:
        return default

    return series.mode().iloc[0]


def calculate_change(current, previous):

    if previous == 0:

        if current == 0:
            return 0

        return 100

    return round(
        ((current - previous) / previous) * 100,
        1
    )


def anomaly_confidence(change):

    if change >= 100:
        return 95

    if change >= 70:
        return 90

    if change >= 50:
        return 85

    if change >= 30:
        return 80

    return 70


# ==========================================================
# DATA PREPARATION
# ==========================================================

def prepare_station_dataframe(df, station):

    zone_df = df[
        df["police_station"] == station
    ].copy()

    if zone_df.empty:
        return None

    zone_df["occurrence_datetime"] = pd.to_datetime(
        zone_df["occurrence_datetime"]
    )

    zone_df = zone_df.sort_values(
        "occurrence_datetime"
    )

    return zone_df


# ==========================================================
# SPLIT DATASET
# ==========================================================

def split_recent_history(zone_df):

    latest_date = zone_df["occurrence_datetime"].max()

    recent = zone_df[
        zone_df["occurrence_datetime"] >=
        latest_date - pd.Timedelta(days=30)
    ]

    history = zone_df[
        zone_df["occurrence_datetime"] <
        latest_date - pd.Timedelta(days=30)
    ]

    return recent, history

# ==========================================================
# CRIME SPIKE DETECTION
# ==========================================================

def detect_crime_spikes(recent_df, history_df):

    anomalies = []

    recent_counts = (
        recent_df["crime_head"]
        .value_counts()
    )

    history_counts = (
        history_df["crime_head"]
        .value_counts()
    )

    crimes = set(recent_counts.index).union(
        set(history_counts.index)
    )

    for crime in crimes:

        current = int(recent_counts.get(crime, 0))
        previous = int(history_counts.get(crime, 0))

        if previous == 0:

            if current >= 5:

                anomalies.append({

                    "severity": "CRITICAL",

                    "anomaly_type": "New Crime Trend",

                    "crime": crime,

                    "current_cases": current,

                    "previous_cases": previous,

                    "change_percent": 100,

                    "confidence": 95,

                    "reason":
                        f"{crime} has appeared for the first time in the recent monitoring period.",

                    "recommended_action":
                        "Investigate immediately and increase monitoring."

                })

            continue

        ratio = current / previous

        if ratio >= HIGH_SPIKE:

            severity = "CRITICAL"

        elif ratio >= MEDIUM_SPIKE:

            severity = "HIGH"

        else:
            continue

        anomalies.append({

            "severity": severity,

            "anomaly_type": "Crime Spike",

            "crime": crime,

            "current_cases": current,

            "previous_cases": previous,

            "change_percent":
                calculate_change(current, previous),

            "confidence":
                anomaly_confidence(
                    calculate_change(current, previous)
                ),

            "reason":
                f"{crime} has increased significantly compared to historical records.",

            "recommended_action":
                "Increase patrols and investigate contributing factors."

        })

    return anomalies


# ==========================================================
# HIGH-RISK CRIME SURGE
# ==========================================================

def detect_high_risk_surge(recent_df, history_df):

    anomalies = []

    recent_high = recent_df[
        recent_df["risk_level"] == "High"
    ]

    history_high = history_df[
        history_df["risk_level"] == "High"
    ]

    current = len(recent_high)
    previous = len(history_high)

    if previous == 0:

        if current >= 5:

            anomalies.append({

                "severity": "CRITICAL",

                "anomaly_type": "High Risk Surge",

                "current_cases": current,

                "previous_cases": previous,

                "change_percent": 100,

                "confidence": 95,

                "reason":
                    "A significant number of high-risk crimes have emerged recently.",

                "recommended_action":
                    "Deploy senior officers and strengthen preventive policing."

            })

        return anomalies

    ratio = current / previous

    if ratio >= MEDIUM_SPIKE:

        anomalies.append({

            "severity":
                "CRITICAL" if ratio >= HIGH_SPIKE else "HIGH",

            "anomaly_type":
                "High Risk Crime Surge",

            "current_cases":
                current,

            "previous_cases":
                previous,

            "change_percent":
                calculate_change(current, previous),

            "confidence":
                anomaly_confidence(
                    calculate_change(current, previous)
                ),

            "reason":
                "High-risk criminal activity has increased noticeably.",

            "recommended_action":
                "Increase preventive deployment and prioritize intelligence gathering."

        })

    return anomalies

# ==========================================================
# EMERGING HOTSPOT DETECTION
# ==========================================================

def detect_emerging_hotspots(recent_df, history_df):

    anomalies = []

    recent_counts = recent_df["place_of_offence"].value_counts()
    history_counts = history_df["place_of_offence"].value_counts()

    locations = set(recent_counts.index).union(
        history_counts.index
    )

    for location in locations:

        current = int(recent_counts.get(location, 0))
        previous = int(history_counts.get(location, 0))

        if previous == 0:

            if current >= 5:

                subset = recent_df[
                    recent_df["place_of_offence"] == location
                ]

                anomalies.append({

                    "severity": "CRITICAL",

                    "anomaly_type": "New Hotspot",

                    "location": location,

                    "dominant_crime":
                        safe_mode(subset["crime_head"]),

                    "current_cases": current,

                    "confidence": 95,

                    "reason":
                        f"{location} has emerged as a new crime hotspot.",

                    "recommended_action":
                        "Increase patrol presence and CCTV surveillance."

                })

            continue

        ratio = current / previous

        if ratio >= MEDIUM_SPIKE:

            subset = recent_df[
                recent_df["place_of_offence"] == location
            ]

            anomalies.append({

                "severity":
                    "CRITICAL" if ratio >= HIGH_SPIKE else "HIGH",

                "anomaly_type":
                    "Emerging Hotspot",

                "location":
                    location,

                "dominant_crime":
                    safe_mode(subset["crime_head"]),

                "current_cases":
                    current,

                "previous_cases":
                    previous,

                "change_percent":
                    calculate_change(current, previous),

                "confidence":
                    anomaly_confidence(
                        calculate_change(current, previous)
                    ),

                "reason":
                    f"Crime activity has increased sharply around {location}.",

                "recommended_action":
                    "Increase patrol coverage and monitor nearby areas."

            })

    return anomalies


# ==========================================================
# GANG EXPANSION DETECTION
# ==========================================================

def detect_gang_expansion(recent_df, history_df):

    anomalies = []

    recent = (
        recent_df["suspect_group"]
        .value_counts()
    )

    history = (
        history_df["suspect_group"]
        .value_counts()
    )

    gangs = set(recent.index).union(history.index)

    for gang in gangs:

        if pd.isna(gang):
            continue

        if gang in ["Unknown", "None", ""]:
            continue

        current = int(recent.get(gang, 0))
        previous = int(history.get(gang, 0))

        if previous == 0:

            if current >= 5:

                anomalies.append({

                    "severity": "CRITICAL",

                    "anomaly_type": "New Organized Group",

                    "suspect_group": gang,

                    "current_cases": current,

                    "confidence": 95,

                    "reason":
                        f"{gang} has recently appeared in multiple incidents.",

                    "recommended_action":
                        "Initiate organized crime surveillance."

                })

            continue

        ratio = current / previous

        if ratio >= MEDIUM_SPIKE:

            anomalies.append({

                "severity":
                    "CRITICAL" if ratio >= HIGH_SPIKE else "HIGH",

                "anomaly_type":
                    "Gang Expansion",

                "suspect_group":
                    gang,

                "current_cases":
                    current,

                "previous_cases":
                    previous,

                "change_percent":
                    calculate_change(current, previous),

                "confidence":
                    anomaly_confidence(
                        calculate_change(current, previous)
                    ),

                "reason":
                    f"{gang} is becoming increasingly active.",

                "recommended_action":
                    "Coordinate intelligence gathering and surveillance."

            })

    return anomalies


# ==========================================================
# CLUSTER EXPANSION DETECTION
# ==========================================================

def detect_cluster_expansion(recent_df, history_df):

    anomalies = []

    recent = (
        recent_df["linked_case_cluster"]
        .value_counts()
    )

    history = (
        history_df["linked_case_cluster"]
        .value_counts()
    )

    clusters = set(recent.index).union(history.index)

    for cluster in clusters:

        if pd.isna(cluster):
            continue

        if cluster in ["No Cluster", ""]:
            continue

        current = int(recent.get(cluster, 0))
        previous = int(history.get(cluster, 0))

        if previous == 0:

            if current >= 5:

                anomalies.append({

                    "severity": "HIGH",

                    "anomaly_type": "New Crime Cluster",

                    "cluster": cluster,

                    "current_cases": current,

                    "confidence": 90,

                    "reason":
                        f"{cluster} has recently emerged.",

                    "recommended_action":
                        "Investigate linked FIRs."

                })

            continue

        ratio = current / previous

        if ratio >= MEDIUM_SPIKE:

            anomalies.append({

                "severity":
                    "CRITICAL" if ratio >= HIGH_SPIKE else "HIGH",

                "anomaly_type":
                    "Cluster Expansion",

                "cluster":
                    cluster,

                "current_cases":
                    current,

                "previous_cases":
                    previous,

                "change_percent":
                    calculate_change(current, previous),

                "confidence":
                    anomaly_confidence(
                        calculate_change(current, previous)
                    ),

                "reason":
                    f"{cluster} has expanded significantly.",

                "recommended_action":
                    "Review linked investigations."

            })

    return anomalies


# ==========================================================
# NEW MODUS OPERANDI DETECTION
# ==========================================================

def detect_new_modus_operandi(recent_df, history_df):

    anomalies = []

    historical_mo = set(
        history_df["modus_operandi"]
        .dropna()
        .unique()
    )

    recent_mo = set(
        recent_df["modus_operandi"]
        .dropna()
        .unique()
    )

    new_mo = recent_mo - historical_mo

    for mo in new_mo:

        subset = recent_df[
            recent_df["modus_operandi"] == mo
        ]

        anomalies.append({

            "severity": "HIGH",

            "anomaly_type": "New Modus Operandi",

            "modus_operandi": mo,

            "crime":
                safe_mode(subset["crime_head"]),

            "cases":
                len(subset),

            "confidence": 90,

            "reason":
                f"A previously unseen criminal method ({mo}) has appeared.",

            "recommended_action":
                "Notify investigators and update operational briefings."

        })

    return anomalies

# ==========================================================
# EXECUTIVE SUMMARY
# ==========================================================

def build_executive_summary(all_anomalies):

    critical = len([
        a for a in all_anomalies
        if a["severity"] == "CRITICAL"
    ])

    high = len([
        a for a in all_anomalies
        if a["severity"] == "HIGH"
    ])

    if critical >= 3:
        threat = "CRITICAL"

    elif critical >= 1 or high >= 3:
        threat = "HIGH"

    elif high >= 1:
        threat = "MEDIUM"

    else:
        threat = "LOW"

    return {

        "overall_threat": threat,

        "critical_alerts": critical,

        "high_alerts": high,

        "total_anomalies": len(all_anomalies),

        "summary":
            f"{len(all_anomalies)} operational anomalies were detected. "
            f"{critical} are classified as CRITICAL and {high} as HIGH priority."

    }


# ==========================================================
# EXPLAINABILITY
# ==========================================================

def build_explainability(all_anomalies):

    explanations = []

    for anomaly in all_anomalies[:5]:

        if anomaly["anomaly_type"] == "Crime Spike":

            explanations.append(
                f"{anomaly['crime']} has increased significantly compared to historical records."
            )

        elif anomaly["anomaly_type"] == "Emerging Hotspot":

            explanations.append(
                f"{anomaly['location']} has shown a significant increase in criminal activity."
            )

        elif anomaly["anomaly_type"] == "Gang Expansion":

            explanations.append(
                f"{anomaly['suspect_group']} is becoming increasingly active."
            )

        elif anomaly["anomaly_type"] == "Cluster Expansion":

            explanations.append(
                f"{anomaly['cluster']} is expanding and requires investigation."
            )

        elif anomaly["anomaly_type"] == "New Modus Operandi":

            explanations.append(
                f"A new criminal method ({anomaly['modus_operandi']}) has been detected."
            )

        else:

            explanations.append(
                anomaly["reason"]
            )

    return explanations


# ==========================================================
# MAIN API
# ==========================================================

def get_anomalies(df, station):

    zone_df = prepare_station_dataframe(df, station)

    if zone_df is None:
        return None

    recent_df, history_df = split_recent_history(zone_df)

    anomalies = []

    anomalies.extend(
        detect_crime_spikes(
            recent_df,
            history_df
        )
    )

    anomalies.extend(
        detect_high_risk_surge(
            recent_df,
            history_df
        )
    )

    anomalies.extend(
        detect_emerging_hotspots(
            recent_df,
            history_df
        )
    )

    anomalies.extend(
        detect_gang_expansion(
            recent_df,
            history_df
        )
    )

    anomalies.extend(
        detect_cluster_expansion(
            recent_df,
            history_df
        )
    )

    anomalies.extend(
        detect_new_modus_operandi(
            recent_df,
            history_df
        )
    )

    anomalies = sorted(
        anomalies,
        key=lambda x: (
            0 if x["severity"] == "CRITICAL"
            else 1,
            -x["confidence"]
        )
    )

    anomalies = anomalies[:TOP_ANOMALIES]

    summary = build_executive_summary(
        anomalies
    )

    explainability = build_explainability(
        anomalies
    )

    return {

        # ==========================================
        # STATION
        # ==========================================

        "station": station,

        "analysis_window": "Last 30 Days vs Historical Data",

        # ==========================================
        # EXECUTIVE SUMMARY
        # ==========================================

        "executive_summary":
            summary,

        # ==========================================
        # DETECTED ANOMALIES
        # ==========================================

        "anomalies":
            anomalies,

        # ==========================================
        # EXPLAINABILITY
        # ==========================================

        "explainability":
            explainability,

        # ==========================================
        # METADATA
        # ==========================================

        "metadata": {

            "recent_cases":
                len(recent_df),

            "historical_cases":
                len(history_df),

            "total_cases":
                len(zone_df),

            "anomalies_detected":
                len(anomalies)

        }

    }