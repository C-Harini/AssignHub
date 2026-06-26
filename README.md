# AssignHub — Role-Based Assignment Management System

A polished MERN application for managing classroom assignments with
role-based access (Admin / Student), file submissions, dashboards, and
in-app notifications.

> Stack: **MongoDB · Express · React (Vite) · Node.js · JWT · Multer · Recharts**

---

## Features

### Authentication & Authorization
- JWT authentication with `bcrypt`-hashed passwords
- Role-based middleware (`admin`, `student`)
- Student registration → admin approval workflow (pending / approved / rejected)
- Protected client routes, 401 / 403 pages

### Admin
- Dashboard cards: total / approved / pending / rejected students,
  assignments, submissions, late submissions, completion %
- Charts: submission status, completion (Recharts)
- Recent registrations, recent submissions, upcoming deadlines
- Assignments CRUD (create / edit / delete with confirmation)
  - Types: **Rich text**, **PDF attachment**, **External link**
  - Deadline (date + time), description, search, deadline filter, pagination
- Students management: search, filter by status, approve / reject, pagination
- Submissions: search, on-time/late filter, download any submission, pagination

### Student
- Dashboard cards: total / completed / pending / missed
- Upcoming deadlines, recent submissions
- Assignments list with status badges (Not started / Submitted / Late / Missed)
- File upload (PDF, DOCX, ZIP, PNG/JPG/WEBP), max 15 MB
- Edit / replace submission before deadline, with optional remarks
- Full submission history with downloads
- Profile page

### Platform
- In-app toast notifications via `react-hot-toast`
- Loading spinners, skeletons, empty states, 404 + Unauthorized pages
- Responsive (desktop / tablet / mobile)
- Confirmation dialog before destructive actions
- Frontend + backend validation (email, password, required, file type, file size)
- Input sanitisation, role middleware on every protected route
- Submission ownership enforced on file downloads
- Multer file storage in `server/uploads`

---

## Folder Structure

```
assignhub/
├── client/                       # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/            # AdminOverview, AdminAssignments, AdminStudents, AdminSubmissions
│   │   │   ├── Student/          # StudentOverview, StudentAssignments, StudentSubmissions
│   │   │   ├── Common/           # StatCard, Spinner, Skeleton, Pagination, SearchBar, ConfirmDialog, AssignmentCard, StudentCard, EmptyState, ProtectedRoute, DashboardStats
│   │   │   └── Layout/           # Navbar, Layout
│   │   ├── contexts/AuthContext.jsx
│   │   ├── pages/                # Login, Register, AdminDashboard, StudentDashboard, Profile, NotFound, Unauthorized
│   │   ├── services/api.js
│   │   ├── styles/global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                       # Express + MongoDB backend
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/          # authController, studentController, assignmentController, submissionController, dashboardController
│   │   ├── middleware/           # authMiddleware, roleMiddleware, upload (multer)
│   │   ├── models/               # User, Assignment, Submission
│   │   ├── routes/               # authRoutes, studentRoutes, assignmentRoutes, submissionRoutes, dashboardRoutes
│   │   ├── utils/                # generateToken, seedAdmin
│   │   └── server.js
│   ├── uploads/                  # User-uploaded files (created at runtime)
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string)

### 1. Server

```bash
cd server
cp .env.example .env       # then edit values
npm install
npm run dev                # http://localhost:5000
```

The first run seeds an admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 2. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

---

## Environment Variables

### `server/.env`

| Key | Description |
| --- | --- |
| `PORT` | Express port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_ORIGIN` | CORS origin, e.g. `http://localhost:5173` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin account |
| `MAX_UPLOAD_MB` | Max upload size in MB (default `15`) |

### `client/.env`

| Key | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL, e.g. `http://localhost:5000/api` |

---

## API Endpoints

### Auth
- `POST   /api/auth/register`           – Student self-registration
- `POST   /api/auth/login`              – Returns `{ token, user }`
- `GET    /api/auth/profile`            – Current user (auth)

### Students (admin)
- `GET    /api/students`                – List all students
- `GET    /api/students/pending`        – List pending students
- `PUT    /api/students/:id/approve`
- `PUT    /api/students/:id/reject`

### Assignments
- `GET    /api/assignments`             – `?search&from&to&page&limit`
- `POST   /api/assignments`             – (admin) multipart, optional `attachment`
- `PUT    /api/assignments/:id`         – (admin) multipart
- `DELETE /api/assignments/:id`         – (admin) cascades submissions + files
- `GET    /api/assignments/:id/attachment` – download admin attachment

### Submissions
- `POST   /api/submissions/:assignmentId` – (student) multipart `file`, `remarks`
- `GET    /api/submissions/mine`          – (student) own submissions
- `GET    /api/submissions`               – (admin) `?search&status&page&limit`
- `GET    /api/submissions/:id/file`      – download (owner or admin)

### Dashboards
- `GET    /api/dashboard/admin`
- `GET    /api/dashboard/student`

---

## Screenshots

> _Add your screenshots here_

- `docs/admin-dashboard.png`
- `docs/student-dashboard.png`
- `docs/assignments.png`
- `docs/submissions.png`

---

## Future Improvements

- Email notifications (SMTP) for approval, deadlines
- Calendar view of deadlines
- CSV export of students / submissions
- Plagiarism / duplicate file detection
- Bulk import students
- Multi-class / cohort support
- Dark mode

---

## License

MIT
