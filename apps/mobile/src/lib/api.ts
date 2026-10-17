import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'vexro_token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

type ApiError = { error: string; issues?: Array<{ path: string[]; message: string }> };

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export const api = {
  register: (email: string, username: string, password: string) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: { email, username, password },
    }),

  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  me: () => request<{ user: User }>('/auth/me', { auth: true }),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST', auth: true }),
};