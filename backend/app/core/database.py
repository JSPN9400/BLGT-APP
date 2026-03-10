from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


engine_kwargs = {"future": True}
if settings.database_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.database_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_runtime_schema():
    Base.metadata.create_all(bind=engine)

    if engine.dialect.name != "sqlite":
        return

    lead_columns = {column["name"] for column in inspect(engine).get_columns("leads")}
    lead_alters = {
        "company_name": "ALTER TABLE leads ADD COLUMN company_name VARCHAR(255)",
        "city": "ALTER TABLE leads ADD COLUMN city VARCHAR(120)",
        "assigned_to": "ALTER TABLE leads ADD COLUMN assigned_to VARCHAR(120)",
        "priority": "ALTER TABLE leads ADD COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'Medium'",
        "budget_amount": "ALTER TABLE leads ADD COLUMN budget_amount NUMERIC(12,2)",
        "last_contacted_at": "ALTER TABLE leads ADD COLUMN last_contacted_at DATETIME",
        "last_contact_summary": "ALTER TABLE leads ADD COLUMN last_contact_summary TEXT",
        "client_feedback": "ALTER TABLE leads ADD COLUMN client_feedback TEXT",
        "next_step": "ALTER TABLE leads ADD COLUMN next_step TEXT",
        "conversion_notes": "ALTER TABLE leads ADD COLUMN conversion_notes TEXT",
    }

    with engine.begin() as connection:
        for column_name, statement in lead_alters.items():
            if column_name not in lead_columns:
                connection.execute(text(statement))
