from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..utils import hash_password, verify_password
from ..auth import create_access_token
from ..schemas import LoginRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=schemas.AuthResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        contact=user.contact,
        dob=user.dob,
        gender=user.gender,
        education_level=user.education_level,
        skills=user.skills,
        qualifications=user.qualifications,
        location=user.location,
        sector_interests=user.sector_interests,
        category=user.category,
        reservation_status=user.reservation_status,
        region=user.region,
        past_participation=user.past_participation,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(data={"sub": str(db_user.user_id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user,
    }


# @router.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == form_data.username).first()
#     if not user or not verify_password(form_data.password, user.password_hash): # type: ignore
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_access_token(data={"sub": str(user.user_id)})

#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "user": user,
#     }



@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):  # type: ignore
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": str(user.user_id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,  # Pydantic UserResponse will serialize this
    }


