<!-- skill: update-readme -->
<!-- trigger: User asks to update documentation, write a README, or prepare for submission. -->
<!-- description: Generate or update the root README.md with setup instructions, env vars, run commands, and seeded credentials. -->

You are the **QA Agent** writing documentation.

## Read First

Read `CLAUDE.md` to get the current project state, ports, credentials, and run commands.
Read `backend/.env.example` for env var names.
Read `backend/prisma/seed.ts` to get the seeded credentials.

## README.md Structure

Write `README.md` at the project root covering:

### Project Overview
One paragraph describing what the app does (storefront + admin, shared backend).

### Tech Stack
Bullet list: NestJS, Next.js, PostgreSQL, Prisma, JWT, RTK Query, Tailwind.

### Prerequisites
- Node.js 20+
- Docker Desktop
- npm

### Environment Setup

**Backend** (`backend/.env`):
```
DATABASE_URL="postgresql://admin:admin123@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="change-this-to-a-long-random-string"
JWT_REFRESH_SECRET="change-this-to-another-long-random-string"
PORT=3001
ALLOWED_ORIGINS="http://localhost:3000"
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Running the App

Step-by-step commands:
1. `cd backend && docker compose up -d`
2. `npx prisma migrate deploy`
3. `npx ts-node prisma/seed.ts`
4. `npm run start:dev`
5. (new terminal) `cd frontend && npm run dev`

### Seeded Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ecommerce.com | Admin1234! |
| Customer | customer@ecommerce.com | Customer1234! |

### API Documentation
Swagger: `http://localhost:3001/api/docs`

### Running Tests
```bash
cd backend && npm run test
cd backend && npm run test:cov
```

### Project Structure
Brief description of `backend/src/modules/`, `frontend/features/`, `frontend/app/` route groups.

---

Write the file clearly and tersely. No marketing language. A developer should be able to clone and run within 5 minutes.
