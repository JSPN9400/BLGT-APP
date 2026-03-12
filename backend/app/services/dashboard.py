from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.followup import FollowUp
from app.models.lead import Lead, LeadStatus
from app.models.user import User
from app.schemas.dashboard import DashboardStats
from app.services.subscriptions import FREE_PLAN_LIMIT, get_or_create_subscription, is_free_plan


def get_dashboard_stats(db: Session, user: User) -> DashboardStats:
    today = date.today()
    subscription = get_or_create_subscription(db, user.id)
    total_leads = db.query(func.count(Lead.id)).filter(Lead.user_id == user.id).scalar() or 0
    leads_today = (
        db.query(func.count(Lead.id))
        .filter(Lead.user_id == user.id, func.date(Lead.created_at) == today)
        .scalar()
        or 0
    )
    followups_due_today = (
        db.query(func.count(FollowUp.id))
        .filter(FollowUp.user_id == user.id, FollowUp.due_date == today, FollowUp.is_completed.is_(False))
        .scalar()
        or 0
    )
    overdue_followups = (
        db.query(func.count(FollowUp.id))
        .filter(
            FollowUp.user_id == user.id,
            FollowUp.due_date < today,
            FollowUp.is_completed.is_(False),
        )
        .scalar()
        or 0
    )
    contacted_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.user_id == user.id, Lead.status == LeadStatus.CONTACTED)
        .scalar()
        or 0
    )
    converted_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.user_id == user.id, Lead.status == LeadStatus.CONVERTED)
        .scalar()
        or 0
    )
    free = is_free_plan(subscription)
    return DashboardStats(
        leads_today=leads_today,
        total_leads=total_leads,
        followups_due_today=followups_due_today,
        overdue_followups=overdue_followups,
        contacted_leads=contacted_leads,
        converted_leads=converted_leads,
        max_leads=FREE_PLAN_LIMIT if free else None,
        is_free_plan=free,
        show_ads=free,
        upgrade_required=free and total_leads >= FREE_PLAN_LIMIT,
        company_logo_url=None if free else user.company_logo_url,
    )
