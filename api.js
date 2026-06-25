// Placeholder API service.
// Part 2 has NO backend — every method returns a mock Promise.
// In a later part, swap the bodies for real axios calls against /api/*.
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // not used yet
  headers: { 'Content-Type': 'application/json' },
});

// ---- Mock data (in-memory seed) ----
const ADMIN_CREDS = { email: 'admin@assignhub.com', password: 'admin123' };

let students = [
  { id: 1, name: 'Arun Kumar', email: 'arun@mail.com', rollNo: 'CS001', password: 'pass123', status: 'approved' },
  { id: 2, name: 'Priya Nair', email: 'priya@mail.com', rollNo: 'CS002', password: 'pass123', status: 'pending' },
];

let assignments = [
  { id: 1, title: 'Data Structures Lab - Linked Lists', description: 'Implement singly and doubly linked list operations in C.', deadline: '2026-06-30', format: 'text', createdAt: '2026-06-20' },
  { id: 2, title: 'DBMS Assignment - ER Diagrams', description: 'Design an ER diagram for a hospital management system.', deadline: '2026-07-05', format: 'text', createdAt: '2026-06-22' },
];

let submissions = [
  { id: 1, studentId: 1, assignmentId: 1, content: 'Implemented using struct Node with head pointer.', submittedAt: '2026-06-24' },
];

const wait = (data, ms = 200) => new Promise(res => setTimeout(() => res(data), ms));
const fail = (msg, ms = 200) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

// ---- Auth ----
export const login = ({ email, password, role }) => {
  if (role === 'admin') {
    if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
      return wait({ user: { role: 'admin', name: 'Admin', email } });
    }
    return fail('Invalid admin credentials.');
  }
  const s = students.find(s => s.email === email && s.password === password);
  if (!s) return fail('Student not found.');
  if (s.status === 'pending') return fail('Your account is pending admin approval.');
  if (s.status === 'rejected') return fail('Your registration was rejected.');
  return wait({ user: { ...s, role: 'student' } });
};

export const register = ({ name, email, rollNo, password }) => {
  if (!name || !email || !rollNo || !password) return fail('All fields required.');
  if (students.find(s => s.email === email)) return fail('Email already registered.');
  const newStudent = { id: Date.now(), name, email, rollNo, password, status: 'pending' };
  students = [...students, newStudent];
  return wait({ student: newStudent });
};

// ---- Students ----
export const getStudents = () => wait([...students]);
export const updateStudentStatus = (id, status) => {
  students = students.map(s => (s.id === id ? { ...s, status } : s));
  return wait(students.find(s => s.id === id));
};

// ---- Assignments ----
export const getAssignments = () => wait([...assignments]);
export const uploadAssignment = (a) => {
  const created = { id: Date.now(), format: 'text', createdAt: new Date().toISOString().slice(0, 10), ...a };
  assignments = [...assignments, created];
  return wait(created);
};

// ---- Submissions ----
export const getSubmissions = () => wait([...submissions]);
export const submitAssignment = ({ studentId, assignmentId, content }) => {
  if (submissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId)) {
    return fail('Already submitted.');
  }
  const sub = { id: Date.now(), studentId, assignmentId, content, submittedAt: new Date().toISOString().slice(0, 10) };
  submissions = [...submissions, sub];
  return wait(sub);
};

export default api;
