from datetime import datetime

from pydantic import BaseModel

from app.models.subscription import PlanType


class SubscriptionResponse(BaseModel):
    plan: PlanType
    status: str
    started_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
