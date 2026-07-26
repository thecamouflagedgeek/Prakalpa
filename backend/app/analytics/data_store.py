"""
data_store.py

Loads the crime dataset once when the backend starts.
Every API uses this same DataFrame.
"""

from app.analytics.loader import CrimeDataLoader

DATASET_PATH = "dataset/crime_dataset_v2_7500.xlsx"

loader = CrimeDataLoader(DATASET_PATH)

df = loader.load_data()