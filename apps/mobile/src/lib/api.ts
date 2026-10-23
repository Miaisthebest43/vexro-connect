const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    // If it's a 401 on the /auth/me check, don't throw a loud error, just return empty
    if (res.status === 401 && path === '/auth/me') {
      return { user: null } as unknown as T;
    }
    throw new Error(data.error || 'Something went wrong');
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};