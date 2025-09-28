from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# from .main import DATABASE_URL

# DATABASE_URL = "postgresql://pminternshipsih25_user:Il6s6utA4ApVYg888vWM9DtfLGcUTRhI@dpg-d34q21h5pdvs73b6e88g-a.oregon-postgres.render.com/pminternshipsih25"
DATABASE_URL="postgresql://pminternshipsih25_user:Il6s6utA4ApVYg888vWM9DtfLGcUTRhI@dpg-d34q21h5pdvs73b6e88g-a.oregon-postgres.render.com/pminternshipsih25"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

