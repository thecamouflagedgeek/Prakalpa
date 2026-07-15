from app.analytics.loader import CrimeDataLoader
from app.analytics.dashboard import get_dashboard_stats

loader = CrimeDataLoader(
    "dataset/crime_dataset_v2_7500.xlsx"
)

df = loader.load_data()

stats = get_dashboard_stats(df)

print(stats)