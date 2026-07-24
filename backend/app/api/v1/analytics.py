from http.client import HTTPException

from fastapi import APIRouter
import requests

from app.analytics.data_store import df
from app.analytics.anomaly import get_anomalies
from app.analytics.patterns import get_patterns
from app.analytics.forecast import get_forecast
from app.analytics.dashboard import get_dashboard_stats
from app.analytics.hotspot import get_hotspot_summary
from app.analytics.zone import get_zone_summary
from app.analytics.groq_input import build_groq_input

router = APIRouter()


@router.get("/dashboard")
def dashboard():
    return get_dashboard_stats(df)


@router.get("/forecast/{station}")
def forecast(station: str):

    forecast_data = get_forecast(df, station)

    if forecast_data is None:
        raise HTTPException(
            status_code=404,
            detail="Police station not found"
        )

    return forecast_data

@router.get("/hotspots")
def hotspots():
    return get_hotspot_summary(df)


@router.get("/zone/{station}")
def zone(station: str):
    return get_zone_summary(df, station)

@router.get("/patterns/{station}")
def patterns(station: str):

    data = get_patterns(df, station)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Police station not found"
        )

    return data

@router.get("/anomalies/{station}")
def anomalies(station: str):

    data = get_anomalies(df, station)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Police station not found"
        )

    return data

@router.post("/ai-summary/{station}")
def ai_summary(station: str):

    payload = build_groq_input(
        df=df,
        station_name=station
    )

    response = requests.post(
        "http://localhost:8001/agent/crime/analyze",
        json=payload
    )

    return response.json()