# Blob App

AI-powered early-warning system for employee productivity, burnout, and attrition.

## Project Structure

```
app/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── core/     # Config, auth, dependencies
│   │   ├── models/   # SQLAlchemy / Pydantic models
│   │   ├── services/ # Business logic
│   │   └── main.py   # FastAPI app entrypoint
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # Next.js React frontend
│   ├── src/
│   │   ├── app/      # Next.js App Router pages
│   │   ├── components/
│   │   ├── lib/      # Supabase client, utils
│   │   └── types/    # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── database/         # Supabase SQL migrations
│   └── migrations/
└── docs/             # Additional documentation
```

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Python 3.12 + FastAPI
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (OAuth 2.0 / OIDC)
- **Storage:** Supabase Storage (file uploads)
- **AI/ML:** PyTorch, scikit-learn, LangChain + Anthropic Claude (Phase 3)

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
