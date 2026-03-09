from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.subscription import PlanType, Subscription


FREE_PLAN_LIMIT = 50


def get_or_create_subscription(db: Session, user_id: int) -> Subscription:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .order_by(desc(Subscription.started_at))
        .first()
    )
    if subscription:
        return subscription

    subscription = Subscription(user_id=user_id, plan=PlanType.FREE, status="active")
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


def is_free_plan(subscription: Subscription) -> bool:
    return subscription.plan == PlanType.FREE
