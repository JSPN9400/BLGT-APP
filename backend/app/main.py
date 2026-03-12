from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.api.routes import auth, dashboard, followups, leads, subscriptions
from app.core.config import settings
from app.core.database import ensure_runtime_schema
from app.models import FollowUp, Lead, LeadInteraction, Subscription, User

ensure_runtime_schema()

app = FastAPI(title=settings.app_name)

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
allow_all_origins = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(leads.router, prefix=settings.api_prefix)
app.include_router(followups.router, prefix=settings.api_prefix)
app.include_router(dashboard.router, prefix=settings.api_prefix)
app.include_router(subscriptions.router, prefix=settings.api_prefix)


@app.get("/health")
def health():
    return {"status": "ok"}


frontend_dist = Path(__file__).resolve().parent / "static"
frontend_index = frontend_dist / "index.html"


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    if not frontend_index.exists():
        raise HTTPException(status_code=404, detail="Frontend not bundled")

    if full_path.startswith("api") or full_path in {"docs", "openapi.json", "redoc", "health"}:
        raise HTTPException(status_code=404, detail="Not found")

    asset_path = frontend_dist / full_path
    if full_path and asset_path.exists() and asset_path.is_file():
        return FileResponse(asset_path)

    return FileResponse(frontend_index)
