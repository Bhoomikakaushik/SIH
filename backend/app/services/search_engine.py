import pandas as pd
import os
from pathlib import Path
from app.test import InternshipSearchEngine  # absolute import

CSV_FILE = os.path.join(os.path.dirname(__file__), "internship_database.csv")
print("Loading internship dataset...")

try:
    df = pd.read_csv(CSV_FILE).dropna(
        subset=['skills', 'domain', 'title', 'location', 'degree']
    )
except FileNotFoundError:
    print(f"WARNING: {CSV_FILE} not found. Search engine will not be available.")
    df = pd.DataFrame()

# Initialize search engine once
try:
    engine = InternshipSearchEngine(df) if not df.empty else None
except Exception as e:
    print(f"Failed to initialize search engine: {e}")
    engine = None
