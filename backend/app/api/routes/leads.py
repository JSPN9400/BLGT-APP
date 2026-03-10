from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.lead import LeadCreate, LeadInteractionCreate, LeadResponse, LeadUpdate
from app.services.leads import add_interaction, create_lead, delete_lead, get_lead_or_404, list_leads, update_lead


router = APIRouter(prefix="/leads", tags=["leads"])


@router.get("", response_model=list[LeadResponse])
def get_leads(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_leads(db, current_user)


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def add_lead(payload: LeadCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_lead(db, current_user, payload)


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_lead_or_404(db, current_user, lead_id)


@router.put("/{lead_id}", response_model=LeadResponse)
def edit_lead(lead_id: int, payload: LeadUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return update_lead(db, current_user, lead_id, payload)


@router.post("/{lead_id}/interactions", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead_interaction(lead_id: int, payload: LeadInteractionCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return add_interaction(db, current_user, lead_id, payload)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_lead(lead_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    delete_lead(db, current_user, lead_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
