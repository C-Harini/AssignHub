import { createContext, useContext, useEffect, useState } from 'react';
import * as apiService from '../services/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'assignhub.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Persist session (frontend-only convenience; not real auth).
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async ({ email, password, role }) => {
    const { user: u } = await apiService.login({ email, password, role });
    setUser(u);
    return u;
  };

  const register = async (form) => {
    return apiService.register(form);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
