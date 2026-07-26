from app.analytics.loader import CrimeDataLoader
from app.analytics.hotspot import get_hotspot_summary


loader = CrimeDataLoader(
    "dataset/crime_dataset_v2_7500.xlsx"
)

df = loader.load_data()

hotspots = get_hotspot_summary(df)

print("\nHotspot Summary\n")

for hotspot in hotspots[:5]:
    print(hotspot)