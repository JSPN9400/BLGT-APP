from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserLogin, UserSignup
from app.services.subscriptions import get_or_create_subscription


def register_user(db: Session, payload: UserSignup):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        business_name=payload.business_name,
        business_type=payload.business_type,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    subscription = get_or_create_subscription(db, user.id)
    return user, subscription, create_access_token(str(user.id))


def login_user(db: Session, payload: UserLogin):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    subscription = get_or_create_subscription(db, user.id)
    return user, subscription, create_access_token(str(user.id))
