from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.lead import LeadPriority, LeadStatus
from app.models.lead_interaction import InteractionChannel, InteractionDirection, InteractionOutcome


class LeadInteractionCreate(BaseModel):
    channel: InteractionChannel
    direction: InteractionDirection = InteractionDirection.OUTBOUND
    outcome: InteractionOutcome
    message: str | None = None
    client_response: str | None = None
    contacted_at: datetime | None = None


class LeadInteractionResponse(LeadInteractionCreate):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class LeadBase(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    company_name: str | None = None
    city: str | None = None
    service_interest: str
    lead_source: str
    assigned_to: str | None = None
    priority: LeadPriority = LeadPriority.MEDIUM
    budget_amount: float | None = None
    status: LeadStatus = LeadStatus.NEW
    last_contacted_at: datetime | None = None
    last_contact_summary: str | None = None
    client_feedback: str | None = None
    next_step: str | None = None
    conversion_notes: str | None = None
    notes: str | None = None


class LeadCreate(LeadBase):
    follow_up_date: str | None = None


class LeadUpdate(LeadBase):
    pass


class LeadResponse(LeadBase):
    id: int
    created_at: datetime
    interactions: list[LeadInteractionResponse] = []

    model_config = {"from_attributes": True}
