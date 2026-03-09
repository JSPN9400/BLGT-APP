from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.followup import FollowUp
from app.models.lead import Lead
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadUpdate
from app.services.subscriptions import FREE_PLAN_LIMIT, get_or_create_subscription, is_free_plan


def ensure_lead_limit(db: Session, user: User):
    subscription = get_or_create_subscription(db, user.id)
    total_leads = db.query(func.count(Lead.id)).filter(Lead.user_id == user.id).scalar() or 0
    if is_free_plan(subscription) and total_leads >= FREE_PLAN_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Free plan limit reached. Upgrade to Pro for unlimited leads.",
        )


def create_lead(db: Session, user: User, payload: LeadCreate) -> Lead:
    ensure_lead_limit(db, user)

    lead = Lead(
        user_id=user.id,
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        service_interest=payload.service_interest,
        lead_source=payload.lead_source,
        status=payload.status,
        notes=payload.notes,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    if payload.follow_up_date:
      followup = FollowUp(user_id=user.id, lead_id=lead.id, due_date=date.fromisoformat(payload.follow_up_date))
      db.add(followup)
      db.commit()

    return lead


def get_lead_or_404(db: Session, user: User, lead_id: int) -> Lead:
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == user.id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead


def update_lead(db: Session, user: User, lead_id: int, payload: LeadUpdate) -> Lead:
    lead = get_lead_or_404(db, user, lead_id)
    for field, value in payload.model_dump().items():
        setattr(lead, field, value)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, user: User, lead_id: int) -> None:
    lead = get_lead_or_404(db, user, lead_id)
    db.delete(lead)
    db.commit()


def list_leads(db: Session, user: User):
    return db.query(Lead).filter(Lead.user_id == user.id).order_by(Lead.created_at.desc()).all()
