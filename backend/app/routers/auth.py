import os
import secrets
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.reset_token import PasswordResetToken
from app.schemas.auth import (
    RegisterRequest, LoginRequest,
    ForgotPasswordRequest, ResetPasswordRequest,
    TokenResponse
)
from app.core.security import hash_password, verify_password, create_access_token
from app.services.email_service import send_reset_code_email

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password)
    )
    db.add(user)
    db.commit()

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        return {"message": "If the email exists, a reset code will be sent."}

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.is_used == False,
    ).delete(synchronize_session=False)

    token = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    rt = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at, is_used=False)

    try:
        db.add(rt)
        send_reset_code_email(user.email, token, user.full_name)
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(exc) if str(exc) else "Unable to send reset email right now",
        )

    return {
        "message": "If the email exists, a reset code has been sent.",
        "email_hint": user.email,
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    rt = db.query(PasswordResetToken).filter(PasswordResetToken.token == payload.token).first()
    if not rt or rt.is_used:
        raise HTTPException(status_code=400, detail="Invalid or used token")
    if rt.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(User).filter(User.id == rt.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    user.password_hash = hash_password(payload.new_password)
    rt.is_used = True
    db.commit()
    return {"message": "Password updated successfully"}
