from app.analytics.loader import CrimeDataLoader
from app.analytics.zone import get_zone_summary
from app.analytics.groq_input import build_groq_input

loader = CrimeDataLoader(
    "dataset/crime_dataset_v2_7500.xlsx"
)

df = loader.load_data()

summary = get_zone_summary(
    df,
    "Whitefield PS"
)

payload = build_groq_input(summary)

print(payload)