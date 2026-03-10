# BLGT-APP

Production-ready MVP for a local business lead management SaaS built with FastAPI, PostgreSQL, React, TailwindCSS, JWT auth, and Docker.

## Features

- User signup and login with JWT authentication
- Business profile fields for business name and type
- Dashboard stats for leads added today, total leads, and follow-ups due today
- Lead CRUD with status management
- Follow-up scheduling and reminder tracking
- Freemium plan with a 50-lead cap on Free
- Dashboard banner ad for Free users and company logo slot for Pro users
- Responsive interface for mobile, tablet, and desktop browsers

## Project structure

```text
backend/
  app/
    api/
    core/
    models/
    schemas/
    services/
frontend/
  src/
database/
docker-compose.yml
```

## Run locally with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API docs: `http://localhost:8000/docs`

## Run locally without Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Deploy frontend to GitHub Pages

The repo includes a GitHub Actions workflow at `.github/workflows/pages.yml` that publishes the Vite frontend from `frontend/`.

1. Push to `main`.
2. In GitHub, open `Settings > Pages` and set `Source` to `GitHub Actions`.
3. Optionally add a repository variable named `VITE_API_BASE_URL` if your backend is hosted elsewhere.

- GitHub Pages only hosts the frontend.
- The FastAPI backend will still need a separate host if you want login, leads, and follow-up actions to work.

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/stats`
- `GET /api/leads`
- `POST /api/leads`
- `GET /api/leads/{lead_id}`
- `PUT /api/leads/{lead_id}`
- `DELETE /api/leads/{lead_id}`
- `GET /api/followups`
- `POST /api/followups`
- `PUT /api/followups/{followup_id}`
- `DELETE /api/followups/{followup_id}`

## Notes

- The API enforces the Free plan lead limit, not just the frontend.
- Pro users have unlimited leads, no ads, and a company logo slot on the dashboard.
- Local development now defaults to SQLite in `backend/.env.example` so the API can run without PostgreSQL. Docker still uses PostgreSQL.
- `Base.metadata.create_all(...)` is used for MVP bootstrapping. Add Alembic migrations before a real production rollout.
