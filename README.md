# BLGT-APP

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JSPN9400/BLGT-APP)

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
3. The current workflow builds in demo mode, so it works without any backend or paid hosting.
4. Optionally add a repository variable named `VITE_API_BASE_URL` later if you host the backend elsewhere and want live API calls instead of demo data.

- GitHub Pages only hosts the frontend.
- The deployed Pages site currently uses browser `localStorage` as a temporary demo database.
- Each client sees and edits their own local demo data in their own browser.
- If you want shared real data, authentication, and multi-user access, the backend will still need a separate host.

## Deploy as a real web app

If you want one actual web app URL instead of a GitHub Pages demo, use the root `Dockerfile`.

- The container builds the React frontend and serves it from FastAPI.
- Clients open one URL and the API is available from the same host.
- `render.yaml` is included for a simple Render deploy.
- This setup uses SQLite by default, which is acceptable for temporary testing but not reliable permanent storage on free hosts because container filesystems are often ephemeral.

Typical free deploy path:

1. Push this repo to GitHub.
2. Create a new Web Service on Render.
3. Point it at this repository root.
4. Use the included `render.yaml` or select `Docker`.
5. After deploy, open the service URL.

For temporary client review, this is the closest option to a real web app without buying infrastructure.

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/stats`
- `GET /api/leads` (query parameters: `q`, `status`)
- `POST /api/leads`
- `GET /api/leads/{lead_id}`
- `PUT /api/leads/{lead_id}`
- `DELETE /api/leads/{lead_id}`
- `GET /api/followups` (query parameters: `overdue`, `due_after`, `due_before`, `is_completed`)
- `POST /api/followups`
- `PUT /api/followups/{followup_id}`
- `DELETE /api/followups/{followup_id}`
- `GET /api/subscription`
- `POST /api/subscription/upgrade`

## Notes

- The API enforces the Free plan lead limit, not just the frontend.
- Pro users have unlimited leads, no ads, and a company logo slot on the dashboard.
- Local development now defaults to SQLite in `backend/.env.example` so the API can run without PostgreSQL. Docker still uses PostgreSQL.
- `Base.metadata.create_all(...)` is used for MVP bootstrapping. Add Alembic migrations before a real production rollout.
