"""
hotspot.py

Generates hotspot summaries for the Crime Intelligence Map.
Each police station is treated as a hotspot zone.
"""

import pandas as pd


def get_hotspot_summary(df: pd.DataFrame):
    """
    Returns hotspot information for each police station.

    Output:
    [
        {
            "zone": "Whitefield PS",
            "district": "Bengaluru",
            "lat": 12.9698,
            "lng": 77.7499,
            "crime_count": 82,
            "risk": "High"
        },
        ...
    ]
    """

    hotspot_df = (
        df.groupby("police_station")
        .agg(
            district=("district", "first"),
            lat=("latitude", "mean"),
            lng=("longitude", "mean"),
            crime_count=("crime_id", "count"),
            risk=("risk_level", lambda x: x.mode()[0]),
        )
        .reset_index()
    )

    hotspot_df.rename(
        columns={
            "police_station": "zone"
        },
        inplace=True,
    )

    return hotspot_df.to_dict(orient="records")