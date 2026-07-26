from app.analytics.loader import CrimeDataLoader
from app.analytics.zone import get_zone_summary

# Load dataset
loader = CrimeDataLoader("dataset/crime_dataset_v2_7500.xlsx")
df = loader.load_data()

# Test with one police station
summary = get_zone_summary(df, "Whitefield PS")

print("\n===== Zone Intelligence =====\n")

if summary:
    for key, value in summary.items():
        print(f"{key}: {value}")
else:
    print("Zone not found.")