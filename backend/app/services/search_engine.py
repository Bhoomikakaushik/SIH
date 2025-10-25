"""Light wrapper to lazily create and return the InternshipSearchEngine.

Avoid importing heavy ML libraries at module import time. The real
`InternshipSearchEngine` lives in `app.test` and loads sentence-transformers.
We only import and initialize it on first use.
"""
from typing import Optional

_engine = None


def get_engine():
    """Return a singleton InternshipSearchEngine instance, creating it lazily.

    Returns None if the CSV dataset is not available.
    """
    global _engine
    if _engine is not None:
        return _engine

    # Local imports to avoid heavy imports at module import time
    import pandas as pd
    import os
    from pathlib import Path

    CSV_FILE = os.path.join(os.path.dirname(__file__), "internship_database.csv")
    print("(search_engine) Loading internship dataset on demand...")

    try:
        df = pd.read_csv(CSV_FILE).dropna(
            subset=['skills', 'domain', 'title', 'location', 'degree']
        )
    except FileNotFoundError:
        print(f"WARNING: {CSV_FILE} not found. Search engine will not be available.")
        _engine = None
        return None

    try:
        # import the heavy class only now
        from app.test import InternshipSearchEngine  # absolute import
        _engine = InternshipSearchEngine(df) if not df.empty else None
    except Exception as e:
        print(f"Failed to initialize search engine: {e}")
        _engine = None

    return _engine
