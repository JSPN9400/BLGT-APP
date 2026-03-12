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


def upgrade_to_pro(db: Session, user_id: int) -> Subscription:
    """Switch the user's active subscription to PRO.  Creates a new record if
    the current plan is free.

    The returned object is the new or updated subscription; callers may
    serialize it directly using the Pydantic schema.
    """
    sub = get_or_create_subscription(db, user_id)
    if sub.plan == PlanType.PRO:
        return sub
    # we keep the old record for audit but also create a new one so callers
    # can observe a changed ``started_at`` timestamp.
    new_sub = Subscription(user_id=user_id, plan=PlanType.PRO, status="active")
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub


def is_free_plan(subscription: Subscription) -> bool:
    return subscription.plan == PlanType.FREE
