# Focus Time — Backend API

Express + TypeScript + Prisma + SQLite backend for the Focus Time web app.

## Local Development

```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Server runs at: **http://localhost:4000**

Health check: http://localhost:4000/api/health

---

## Deploy to Railway (One-click)

### Step 1 — Create Railway project
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select `JordanMa0228/Figma-build-26`
4. Select branch: **`back-end`**

### Step 2 — Set Root Directory
In Railway project Settings → **Root Directory**:
```
server
```

### Step 3 — Set Environment Variables
In Railway → Settings → **Variables**, add:

| Variable | Value |
|---|---|
| `JWT_SECRET` | A long random string (see below to generate) |
| `DATABASE_URL` | `file:./dev.db` (SQLite) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Netlify/Vercel frontend URL |

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4 — Deploy
Railway will automatically:
1. Install dependencies (`npm install`)
2. Generate Prisma client (`prisma generate`)
3. Push database schema (`prisma db push`)
4. Run seed data (`npm run db:seed`)
5. Build TypeScript (`npm run build`)
6. Start server (`node dist/index.js`)

Your API will be live at:
```
https://your-project-name.railway.app
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Protected (requires `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get current user profile |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/sessions/:id/report` | Get session detail report |
| GET | `/api/analytics/overview` | Get analytics summary |

---

## Test with curl

```bash
# Health check
curl https://your-project.railway.app/api/health

# Register
curl -X POST https://your-project.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST https://your-project.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `prisma` + `@prisma/client` | ORM + database client |
| `jsonwebtoken` | JWT token generation & verification |
| `bcrypt` | Password hashing |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable loading |
| `typescript` | Type safety |
| `ts-node` | Run TypeScript directly (dev) |
| `nodemon` | Auto-restart on file change (dev) |

---

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Express entry point
│   ├── routes/auth.ts        # Auth routes
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic & DB queries
│   ├── middleware/auth.ts    # JWT middleware
│   └── lib/prisma.ts         # Prisma client singleton
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Test data seeder
├── railway.json              # Railway deployment config
├── nixpacks.toml             # Node.js version config
├── .env.example              # Environment variable template
└── package.json
```

