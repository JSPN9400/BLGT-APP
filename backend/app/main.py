from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, dashboard, followups, leads
from app.core.config import settings
from app.core.database import Base, engine
from app.models import FollowUp, Lead, Subscription, User


Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(leads.router, prefix=settings.api_prefix)
app.include_router(followups.router, prefix=settings.api_prefix)
app.include_router(dashboard.router, prefix=settings.api_prefix)


@app.get("/health")
def health():
    return {"status": "ok"}
