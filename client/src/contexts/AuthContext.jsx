import { createContext, useContext, useEffect, useState } from 'react';
import * as apiService from '../services/api.js';

const AuthContext = createContext(null);
const USER_KEY = 'assignhub.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  // Re-validate token on mount (if any).
  useEffect(() => {
    const token = apiService.getToken();
    if (!token || !user) return;
    apiService
      .getProfile()
      .then((u) => setUser(u))
      .catch(() => {
        apiService.logout();
        setUser(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password, role }) => {
    setLoading(true);
    try {
      const { user: u } = await apiService.login({ email, password, role });
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => apiService.register(form);

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role || null, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
