from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.auth import Token, UserLogin, UserProfile, UserSignup
from app.services.auth import login_user, register_user
from app.services.subscriptions import get_or_create_subscription


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    _, _, token = register_user(db, payload)
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    _, _, token = login_user(db, payload)
    return Token(access_token=token)


@router.get("/me", response_model=UserProfile)
def me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    subscription = get_or_create_subscription(db, current_user.id)
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        business_name=current_user.business_name,
        business_type=current_user.business_type,
        company_logo_url=current_user.company_logo_url,
        current_plan=subscription.plan.value,
    )
