// Real backend API client.
// JWT is stored in localStorage and attached to every request.
import axios from 'axios';

const TOKEN_KEY = 'assignhub.token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Network error';
    const wrapped = new Error(message);
    wrapped.status = err?.response?.status;
    return Promise.reject(wrapped);
  }
);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const apiBase = () => api.defaults.baseURL;

// ---- Auth ----
export const login = async ({ email, password, role }) => {
  const { data } = await api.post('/auth/login', { email, password, role });
  if (data?.token) setToken(data.token);
  return data;
};
export const register = async ({ name, email, rollNo, rollNumber, password }) => {
  const { data } = await api.post('/auth/register', {
    name, email, rollNumber: rollNumber || rollNo, password,
  });
  return data;
};
export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data.user;
};
export const logout = () => setToken(null);

// ---- Students (admin) ----
export const getStudents = async () => {
  const { data } = await api.get('/students');
  return data.students;
};
export const getPendingStudents = async () => {
  const { data } = await api.get('/students/pending');
  return data.students;
};
export const updateStudentStatus = async (id, status) => {
  const action = status === 'approved' ? 'approve' : 'reject';
  const { data } = await api.put(`/students/${id}/${action}`);
  return data.student;
};

// ---- Assignments ----
export const getAssignments = async (params = {}) => {
  const { data } = await api.get('/assignments', { params });
  return data; // { assignments, pagination }
};
export const createAssignment = async (form) => {
  // form: { title, description, type, externalLink, deadline, attachment? (File) }
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') fd.append(k, v);
  });
  const { data } = await api.post('/assignments', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.assignment;
};
export const updateAssignment = async (id, form) => {
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') fd.append(k, v);
  });
  const { data } = await api.put(`/assignments/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.assignment;
};
export const deleteAssignment = async (id) => {
  const { data } = await api.delete(`/assignments/${id}`);
  return data;
};
export const downloadAssignmentAttachment = (id) =>
  `${apiBase()}/assignments/${id}/attachment`;

// ---- Submissions ----
export const submitAssignment = async (assignmentId, file, remarks = '') => {
  const fd = new FormData();
  fd.append('file', file);
  if (remarks) fd.append('remarks', remarks);
  const { data } = await api.post(`/submissions/${assignmentId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.submission;
};
export const getMySubmissions = async () => {
  const { data } = await api.get('/submissions/mine');
  return data.submissions;
};
export const getAllSubmissions = async (params = {}) => {
  const { data } = await api.get('/submissions', { params });
  return data; // { submissions, pagination }
};
export const downloadSubmissionUrl = (id) => `${apiBase()}/submissions/${id}/file`;

// ---- Dashboard ----
export const getAdminDashboard = async () => {
  const { data } = await api.get('/dashboard/admin');
  return data;
};
export const getStudentDashboard = async () => {
  const { data } = await api.get('/dashboard/student');
  return data;
};

export default api;
