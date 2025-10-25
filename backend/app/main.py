from fastapi import FastAPI
from app.routers import items,auth,search
from app import models
from app.database import engine
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"],           
)

app.include_router(items.router)
app.include_router(auth.router)
app.include_router(search.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}


@app.on_event("startup")
async def startup_event():
    """
    Initialize database tables on startup with a short retry/backoff.
    This prevents the whole app process from crashing during deploy when the DB
    is temporarily unreachable (common on managed DBs during restarts).
    """
    # import locally to avoid circular imports at module load time
    from sqlalchemy.exc import OperationalError
    from time import sleep

    if engine is None:
        print("No database engine configured; skipping DB initialization.")
        return

    max_attempts = 5
    for attempt in range(1, max_attempts + 1):
        try:
            models.Base.metadata.create_all(bind=engine)
            print("Database tables ensured (startup).")
            break
        except OperationalError as e:
            print(f"Database not ready (attempt {attempt}/{max_attempts}): {e}")
            if attempt < max_attempts:
                sleep(2 ** attempt)
            else:
                print("Could not initialize DB after retries; proceeding without DB init.")