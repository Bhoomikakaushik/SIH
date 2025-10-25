import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Read DATABASE_URL from environment for production deployments (Render).
# If not provided, fall back to a local sqlite DB to avoid crashing the app during startup.
DATABASE_URL = os.getenv("DATABASE_URL")

# pool sizing from env (small defaults for low-memory instances)
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "2"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "0"))

if DATABASE_URL:
    # For hosted Postgres (e.g. Render), enforce SSL
    connect_args = {}
    if DATABASE_URL.startswith("postgres"):
        connect_args = {"sslmode": "require"}

    # pass explicit pool_size/max_overflow to reduce per-process memory
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=DB_POOL_SIZE,
        max_overflow=DB_MAX_OVERFLOW,
    )
else:
    # Local dev fallback (file-based sqlite). This prevents startup crashes when no DB is configured.
    engine = create_engine("sqlite:///./dev.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

