# Quickstart: Hackathon Phase II

## Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL (Neon connection string)

## Setup

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
# Create .env with DATABASE_URL and BETTER_AUTH_SECRET
fastapi dev src/main.py
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
# Create .env.local with BETTER_AUTH_URL and API_URL
npm run dev
```

## Environment Variables

### Backend `.env`
```ini
DATABASE_URL="postgresql+asyncpg://user:pass@host/db"
BETTER_AUTH_SECRET="shared_secret_value"
```

### Frontend `.env.local`
```ini
BETTER_AUTH_SECRET="shared_secret_value"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```
