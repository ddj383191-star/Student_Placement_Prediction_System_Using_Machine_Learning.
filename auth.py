from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import create_token, hash_password, verify_password
from app.models import StudentProfile, User
from app.schemas import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=body.email.lower()).first():
        raise HTTPException(400, "Email already registered")
    user = User(email=body.email.lower(), password_hash=hash_password(body.password),
                role="student", full_name=body.full_name)
    db.add(user)
    db.flush()
    db.add(StudentProfile(user_id=user.id))  # empty profile row
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_token(str(user.id), user.role),
                         role=user.role, full_name=user.full_name)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=body.email.lower()).first()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    return TokenResponse(access_token=create_token(str(user.id), user.role),
                         role=user.role, full_name=user.full_name)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "role": user.role,
            "full_name": user.full_name}
