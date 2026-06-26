# AssignHub — Client (Part 2)

React + Vite frontend converted from the HTML prototype.

## Stack
React 18, Vite, React Router DOM, Axios, Context API, plain CSS.
No backend / auth / DB in this part — mock data only.

## Run
```
cd client
npm install
npm run dev
```

## Demo credentials
- Admin: `admin@assignhub.com` / `admin123`
- Student: `arun@mail.com` / `pass123` (approved)
- Student: `priya@mail.com` / `pass123` (pending — will be blocked)

## Routes
- `/` redirects based on session
- `/login`
- `/register`
- `/admin/dashboard` (protected: admin)
- `/student/dashboard` (protected: student)

## Structure
```
src/
  assets/
  components/
    Admin/        AdminOverview, AdminStudents, AdminAssignments, AdminSubmissions
    Student/      StudentAssignments, StudentSubmissions
    Common/       AssignmentCard, StudentCard, DashboardStats, ProtectedRoute
    Layout/       Navbar, Sidebar, Layout
  contexts/       AuthContext
  pages/          Login, Register, AdminDashboard, StudentDashboard
  services/       api.js (mock Promise-based axios placeholders)
  styles/         global.css (extracted from prototype)
```
