# Focus Time — Backend API

Express + TypeScript + Prisma + SQLite backend for the Focus Time app.

## Setup

```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Server runs at: http://localhost:4000

## API Endpoints (Priority 1)

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login, returns JWT token
- `GET /api/health` — Health check

## Test with curl

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Dependencies

| Package | Purpose |
|---|---|
| express | Web framework |
| prisma | ORM |
| @prisma/client | Prisma runtime client |
| sqlite | Database |
| jsonwebtoken | JWT auth |
| bcrypt | Password hashing |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| typescript | Type safety |
| ts-node | Run TypeScript directly |
| nodemon | Auto-restart on file change |
