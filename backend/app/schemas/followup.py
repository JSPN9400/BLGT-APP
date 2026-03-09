from datetime import date, datetime

from pydantic import BaseModel


class FollowUpCreate(BaseModel):
    lead_id: int
    due_date: date
    note: str | None = None


class FollowUpUpdate(BaseModel):
    due_date: date | None = None
    note: str | None = None
    is_completed: bool | None = None


class FollowUpResponse(BaseModel):
    id: int
    lead_id: int
    due_date: date
    note: str | None
    is_completed: bool
    created_at: datetime
    lead_name: str

    model_config = {"from_attributes": True}
