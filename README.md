# AssignHub

Role-Based Assignment Management System (MERN).

## Structure

```
assignhub/
  client/   # React + Vite frontend
  server/   # Node.js + Express + MongoDB backend
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string)

## Backend setup

```bash
cd server
cp .env.example .env       # then edit values
npm install
npm run dev                # http://localhost:5000
```

On first start, a default admin is seeded:

- Email: `admin@assignhub.com`
- Password: `admin123`

(Configurable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.)

## Frontend setup

```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`.

## API Endpoints

| Method | Path                          | Auth        | Description                |
| ------ | ----------------------------- | ----------- | -------------------------- |
| POST   | `/api/auth/register`          | public      | Register a new student     |
| POST   | `/api/auth/login`             | public      | Login (student or admin)   |
| GET    | `/api/auth/profile`           | bearer      | Current user profile       |
| GET    | `/api/students`               | admin       | List all students          |
| GET    | `/api/students/pending`       | admin       | List pending students      |
| PUT    | `/api/students/:id/approve`   | admin       | Approve a student          |
| PUT    | `/api/students/:id/reject`    | admin       | Reject a student           |

## Auth flow

- Passwords hashed with `bcryptjs`.
- Login returns a JWT (`JWT_EXPIRES_IN`, default `7d`).
- Frontend stores the token in `localStorage` and sends it as
  `Authorization: Bearer <token>` via an Axios interceptor.
- Students may login only when `status === 'approved'`.
  - `pending` → "Waiting for admin approval"
  - `rejected` → "Registration rejected"
