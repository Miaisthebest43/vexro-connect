import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

type User = { id: string; email: string; username: string };
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserLocal: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On boot, just ask the backend if we have a valid cookie session
  useEffect(() => {
    api.get('/auth/me')
      .then((res: any) => setUser(res.user))
      .catch(() => setUser(null)) // 401 means no valid cookie
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ user: User }>('/auth/login', { email, password });
    setUser(res.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const res = await api.post<{ user: User }>('/auth/register', { email, username, password });
    setUser(res.user);
  };

  const logout = async () => {
    await api.post('/auth/logout', {});
    setUser(null);
  };

  const setUserLocal = (u: User) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}