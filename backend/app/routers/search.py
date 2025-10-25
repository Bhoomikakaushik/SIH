# app/routers/search.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..services.search_engine import get_engine
from ..auth import get_current_user  # JWT auth

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/internships")
def search_internships(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Fetch internships based on logged-in user details.
    """

    # ✅ Extract user details from DB
    query = {

        "title":" Software developer",  # Optional if you want to let user enter later
        "skills": current_user.skills,
        "domain": "Software Development",  # or domain column if you store separately
        "location": current_user.location,
        "degree": current_user.education_level,
    }

    r_index = current_user.r_index if hasattr(current_user, "r_index") else None

    try:
        # lazily obtain engine (may be None if no dataset / initialization failed)
        engine = get_engine()
        if engine is None:
            raise HTTPException(status_code=503, detail="Search engine not available")

        # Call the search method with user details
        results = engine.search(query, current_user, top_k=10)  # Pass current_user for details
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
