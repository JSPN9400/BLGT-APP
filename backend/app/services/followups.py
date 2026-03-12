from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.followup import FollowUp
from app.models.lead import Lead
from app.models.user import User
from app.schemas.followup import FollowUpCreate, FollowUpUpdate


def get_followup_or_404(db: Session, user: User, followup_id: int) -> FollowUp:
    followup = (
        db.query(FollowUp)
        .options(selectinload(FollowUp.lead))
        .filter(FollowUp.id == followup_id, FollowUp.user_id == user.id)
        .first()
    )
    if not followup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow-up not found")
    return followup


from datetime import date


def list_followups(
    db: Session,
    user: User,
    *,
    overdue: bool | None = None,
    due_after: date | None = None,
    due_before: date | None = None,
    is_completed: bool | None = None,
) -> list[FollowUp]:
    """Return follow‑ups belonging to ``user`` with optional filters.

    - ``overdue``: if ``True`` only returns uncompleted items with due_date < today;
      if ``False`` only future or today items are returned.
    - ``due_after`` / ``due_before``: date range
    - ``is_completed``: filter by completion status
    """
    query = (
        db.query(FollowUp)
        .options(selectinload(FollowUp.lead))
        .filter(FollowUp.user_id == user.id)
    )

    if overdue is not None:
        today = date.today()
        if overdue:
            query = query.filter(FollowUp.due_date < today, FollowUp.is_completed.is_(False))
        else:
            query = query.filter(FollowUp.due_date >= today)

    if due_after:
        query = query.filter(FollowUp.due_date >= due_after)
    if due_before:
        query = query.filter(FollowUp.due_date <= due_before)
    if is_completed is not None:
        query = query.filter(FollowUp.is_completed.is_(is_completed))

    return query.order_by(FollowUp.due_date.asc()).all()


def create_followup(db: Session, user: User, payload: FollowUpCreate) -> FollowUp:
    # make sure the referenced lead belongs to the current user
    lead = db.query(Lead).filter(Lead.id == payload.lead_id, Lead.user_id == user.id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    followup = FollowUp(
        user_id=user.id,
        lead_id=payload.lead_id,
        due_date=payload.due_date,
        note=payload.note,
    )
    db.add(followup)
    db.commit()
    db.refresh(followup)
    # load relationship for lead_name property
    db.refresh(followup, attribute_names=["lead"])
    return followup


def update_followup(db: Session, user: User, followup_id: int, payload: FollowUpUpdate) -> FollowUp:
    followup = get_followup_or_404(db, user, followup_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(followup, field, value)
    db.commit()
    db.refresh(followup)
    return followup


def delete_followup(db: Session, user: User, followup_id: int) -> None:
    followup = get_followup_or_404(db, user, followup_id)
    db.delete(followup)
    db.commit()
