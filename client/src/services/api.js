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
    return Promise.reject(new Error(message));
  }
);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// ---- Auth ----
export const login = async ({ email, password, role }) => {
  const { data } = await api.post('/auth/login', { email, password, role });
  if (data?.token) setToken(data.token);
  return data; // { token, user }
};

export const register = async ({ name, email, rollNo, rollNumber, password }) => {
  const { data } = await api.post('/auth/register', {
    name,
    email,
    rollNumber: rollNumber || rollNo,
    password,
  });
  return data; // { message, user }
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

export default api;
