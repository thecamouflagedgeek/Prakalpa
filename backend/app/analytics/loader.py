"""
loader.py

Loads the FIR dataset and prepares it for analytics.
"""

import pandas as pd
from pathlib import Path


class CrimeDataLoader:

    def __init__(self, dataset_path):
        self.dataset_path = Path(dataset_path)
        self.df = None

    def load_data(self):
        """
        Load Excel dataset.
        """

        self.df = pd.read_excel(self.dataset_path)

        print(f"Dataset Loaded Successfully!")
        print(f"Rows : {len(self.df)}")
        print(f"Columns : {len(self.df.columns)}")

        return self.df