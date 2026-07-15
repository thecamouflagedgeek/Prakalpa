from fastapi import APIRouter

from app.analytics.data_store import df

from app.analytics.dashboard import get_dashboard_stats
from app.analytics.hotspot import get_hotspot_summary
from app.analytics.zone import get_zone_summary
from app.analytics.groq_input import build_groq_input

router = APIRouter()


@router.get("/dashboard")
def dashboard():
    return get_dashboard_stats(df)


@router.get("/hotspots")
def hotspots():
    return get_hotspot_summary(df)


@router.get("/zone/{station}")
def zone(station: str):
    return get_zone_summary(df, station)


@router.post("/ai-summary/{station}")
def ai_summary(station: str):
    summary = get_zone_summary(df, station)
    return build_groq_input(summary)