from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.dashboard import DashboardStats
from app.services.dashboard import get_dashboard_stats


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_dashboard_stats(db, current_user)
