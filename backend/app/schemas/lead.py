from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.lead import LeadStatus


class LeadBase(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    service_interest: str
    lead_source: str
    status: LeadStatus = LeadStatus.NEW
    notes: str | None = None


class LeadCreate(LeadBase):
    follow_up_date: str | None = None


class LeadUpdate(LeadBase):
    pass


class LeadResponse(LeadBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
