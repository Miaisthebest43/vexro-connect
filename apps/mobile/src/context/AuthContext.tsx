import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken, clearToken, type User } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserLocal: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) { setLoading(false); return; }
        const { user } = await api.me();
        setUser(user);
      } catch { await clearToken(); }
      finally { setLoading(false); }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    await setToken(token); setUser(user);
  };
  const register = async (email: string, username: string, password: string) => {
    const { user, token } = await api.register(email, username, password);
    await setToken(token); setUser(user);
  };
  const logout = async () => {
    try { await api.logout(); } catch {}
    await clearToken(); setUser(null);
  };
  const refreshUser = useCallback(async () => {
    try { const { user } = await api.me(); setUser(user); } catch {}
  }, []);
  const setUserLocal = useCallback((u: User) => setUser(u), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}