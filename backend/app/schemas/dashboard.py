from pydantic import BaseModel


class DashboardStats(BaseModel):
    leads_today: int
    total_leads: int
    followups_due_today: int
    contacted_leads: int
    converted_leads: int
    max_leads: int | None
    is_free_plan: bool
    show_ads: bool
    upgrade_required: bool
    company_logo_url: str | None
