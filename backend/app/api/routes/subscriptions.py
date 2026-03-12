from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.subscription import SubscriptionResponse
from app.services.subscriptions import get_or_create_subscription, upgrade_to_pro

router = APIRouter(prefix="/subscription", tags=["subscription"])


@router.get("", response_model=SubscriptionResponse)
def get_subscription(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Return the user's most recent subscription, creating a free plan if none exists."""
    return get_or_create_subscription(db, current_user.id)


@router.post("/upgrade", status_code=status.HTTP_200_OK)
def upgrade_subscription(db: Session = Depends(get_db), current_user=Depends(get_current_user)) -> SubscriptionResponse:
    """Upgrade the user's plan to PRO.  Idempotent: if already PRO nothing changes."""
    return upgrade_to_pro(db, current_user.id)
