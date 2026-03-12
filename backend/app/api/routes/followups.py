from __future__ import annotations

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Response, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.followup import FollowUpCreate, FollowUpResponse, FollowUpUpdate
from app.services import followups as followup_service


router = APIRouter(prefix="/followups", tags=["followups"])


@router.get("", response_model=list[FollowUpResponse])
def list_followups(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    overdue: Annotated[bool | None, Query()] = None,
    due_after: Annotated[date | None, Query()] = None,
    due_before: Annotated[date | None, Query()] = None,
    is_completed: Annotated[bool | None, Query()] = None,
):
    """Return all follow‑ups belonging to the user, ordered by due date.

    Query parameters allow filtering by due date and completion.
    """
    return followup_service.list_followups(
        db,
        current_user,
        overdue=overdue,
        due_after=due_after,
        due_before=due_before,
        is_completed=is_completed,
    )


@router.post("", response_model=FollowUpResponse, status_code=status.HTTP_201_CREATED)
def create_followup(payload: FollowUpCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Create a new follow‑up tied to a lead owned by the current user."""
    return followup_service.create_followup(db, current_user, payload)


@router.put("/{followup_id}", response_model=FollowUpResponse)
def update_followup(
    followup_id: int,
    payload: FollowUpUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return followup_service.update_followup(db, current_user, followup_id, payload)


@router.delete("/{followup_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_followup(followup_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    followup_service.delete_followup(db, current_user, followup_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
