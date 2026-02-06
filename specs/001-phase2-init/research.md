# Research & Decisions: Phase II Initialization

**Date**: 2026-01-06
**Status**: Completed

## Decisions

### 1. Authentication Architecture
- **Decision**: "Better Auth" (TypeScript) will run in the Next.js Frontend. FastAPI Backend will verify JWTs.
- **Rationale**: Better Auth is native to the JS ecosystem. Reimplementing its logic in Python is redundant.
- **Implementation**:
  - Next.js handles `/api/auth/*` routes.
  - Better Auth configured to issue JWTs.
  - Shared Secret (or JWKS) used for signature verification.
  - FastAPI uses `PyJWT` to verify the `Authorization: Bearer <token>` header.

### 2. Database Connection
- **Decision**: Use `SQLModel` with `asyncpg` for FastAPI.
- **Rationale**: Best-in-class async support for Python/PostgreSQL. SQLModel bridges Pydantic and SQLAlchemy.
- **Connection Pooling**: Use standard SQLAlchemy pooling configuration suitable for serverless (Neon).

### 3. Monorepo Structure
- **Decision**: Split root into `/frontend` and `/backend`.
- **Rationale**: Clear separation of concerns while keeping code in one repo.
- **Tooling**:
  - Frontend: `npm` / `bun` (Next.js)
  - Backend: `uv` / `poetry` (Python) - *Constitution says standard Python, assume `uv` or `pip` + `requirements.txt` for simplicity unless specified.* (Using standard `requirements.txt` / `venv`).

## Alternatives Considered

- **Python-only Auth**: Using `FastAPI Users`. Rejected because "Better Auth" was explicitly requested in Constitution.
- **Single App**: Serving Next.js static export from FastAPI. Rejected because App Router features (SSR/RSC) require Node.js server.
