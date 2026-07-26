from app.analytics.loader import CrimeDataLoader
from app.analytics.zone import get_zone_summary
from app.analytics.risk import calculate_zone_risk

loader = CrimeDataLoader(
    "dataset/crime_dataset_v2_7500.xlsx"
)

df = loader.load_data()

zone_summary = get_zone_summary(
    df,
    "Whitefield PS"
)

risk = calculate_zone_risk(zone_summary)

print("\n====== RISK ANALYSIS ======\n")

print(risk)