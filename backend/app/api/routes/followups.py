from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.followup import FollowUp
from app.models.lead import Lead
from app.schemas.followup import FollowUpCreate, FollowUpResponse, FollowUpUpdate


router = APIRouter(prefix="/followups", tags=["followups"])


@router.get("", response_model=list[FollowUpResponse])
def list_followups(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    rows = (
        db.query(FollowUp, Lead.name.label("lead_name"))
        .join(Lead, Lead.id == FollowUp.lead_id)
        .filter(FollowUp.user_id == current_user.id)
        .order_by(FollowUp.due_date.asc())
        .all()
    )
    return [
        FollowUpResponse(
            id=followup.id,
            lead_id=followup.lead_id,
            due_date=followup.due_date,
            note=followup.note,
            is_completed=followup.is_completed,
            created_at=followup.created_at,
            lead_name=lead_name,
        )
        for followup, lead_name in rows
    ]


@router.post("", response_model=FollowUpResponse, status_code=status.HTTP_201_CREATED)
def create_followup(payload: FollowUpCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    lead = db.query(Lead).filter(Lead.id == payload.lead_id, Lead.user_id == current_user.id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    followup = FollowUp(user_id=current_user.id, lead_id=payload.lead_id, due_date=payload.due_date, note=payload.note)
    db.add(followup)
    db.commit()
    db.refresh(followup)
    return FollowUpResponse(
        id=followup.id,
        lead_id=followup.lead_id,
        due_date=followup.due_date,
        note=followup.note,
        is_completed=followup.is_completed,
        created_at=followup.created_at,
        lead_name=lead.name,
    )


@router.put("/{followup_id}", response_model=FollowUpResponse)
def update_followup(
    followup_id: int,
    payload: FollowUpUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    followup = db.query(FollowUp).filter(FollowUp.id == followup_id, FollowUp.user_id == current_user.id).first()
    if not followup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow-up not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(followup, field, value)
    db.commit()
    db.refresh(followup)

    lead = db.query(Lead).filter(Lead.id == followup.lead_id).first()
    return FollowUpResponse(
        id=followup.id,
        lead_id=followup.lead_id,
        due_date=followup.due_date,
        note=followup.note,
        is_completed=followup.is_completed,
        created_at=followup.created_at,
        lead_name=lead.name,
    )


@router.delete("/{followup_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_followup(followup_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    followup = db.query(FollowUp).filter(FollowUp.id == followup_id, FollowUp.user_id == current_user.id).first()
    if not followup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow-up not found")
    db.delete(followup)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
