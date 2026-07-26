from app.analytics.loader import CrimeDataLoader

loader = CrimeDataLoader("dataset/crime_dataset_v2_7500.xlsx")

df = loader.load_data()

print(df.head())