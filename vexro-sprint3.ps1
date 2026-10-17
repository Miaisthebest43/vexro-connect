Set-Location $PSScriptRoot
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "`n  ============================================" -ForegroundColor Cyan
Write-Host "   VEXRO Connect - Sprint 3" -ForegroundColor Cyan
Write-Host "   Expo mobile client" -ForegroundColor Cyan
Write-Host "  ============================================`n" -ForegroundColor Cyan

# ---------- Detect LAN IP ----------
$ip = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' -and $_.PrefixOrigin -ne 'WellKnown' } |
    Select-Object -First 1).IPAddress

if (-not $ip) {
    Write-Host "  Could not detect LAN IP. Enter manually:" -ForegroundColor Yellow
    $ip = Read-Host "  IPv4 address"
}

$apiUrl = "http://${ip}:3001"
Write-Host "  Detected LAN IP: $ip" -ForegroundColor Green
Write-Host "  Mobile API URL:  $apiUrl`n" -ForegroundColor Green

# ---------- Helper ----------
function Write-Utf8File {
    param([string]$Path, [string]$Content)
    $full = Join-Path $PSScriptRoot $Path
    $dir = Split-Path -Parent $full
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.UTF8Encoding]::new($false))
}

# ==================================================================
# PART 1: PATCH THE API TO SUPPORT BEARER TOKENS
# ==================================================================
Write-Host "  [1/4] Patching API for bearer token support..." -ForegroundColor Cyan

Write-Utf8File 'apps\api\src\plugins\auth.ts' @'
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { findSessionByToken } from '../lib/sessions.js';
import { query } from '../lib/db.js';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
    sessionToken?: string;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest) => Promise<void>;
  }
}

function extractToken(req: FastifyRequest): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  const raw = req.cookies?.['vexro_session'];
  if (raw) {
    const unsigned = req.unsignCookie(raw);
    if (unsigned.valid && unsigned.value) return unsigned.value;
  }
  return null;
}

export default fp(async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('user', undefined);
  app.decorateRequest('sessionToken', undefined);

  app.decorate('requireAuth', async function (req: FastifyRequest) {
    const token = extractToken(req);
    if (!token) {
      const err: any = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    const session = await findSessionByToken(token);
    if (!session) {
      const err: any = new Error('Session expired');
      err.statusCode = 401;
      throw err;
    }

    const result = await query<{ id: string; email: string; username: string }>(
      `SELECT id, email, username FROM users WHERE id = $1`,
      [session.userId]
    );
    const user = result.rows[0];
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }

    req.user = user;
    req.sessionToken = token;
  });
});
'@

Write-Utf8File 'apps\api\src\routes\auth.ts' @'
import type { FastifyInstance, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '@vexro/shared';
import { query } from '../lib/db.js';
import { hashPassword, verifyPassword } from '../lib/passwords.js';
import { generateSessionToken, createSession, deleteSession } from '../lib/sessions.js';

const SESSION_COOKIE = 'vexro_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', {
    config: { rateLimit: { max: 5, timeWindow: '10 minutes' } },
  }, async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Validation Error',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }
    const { email, username, password } = parsed.data;

    const existing = await query<{ id: string }>(
      `SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1`,
      [email, username]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return reply.code(409).send({ error: 'Email or username already taken' });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await query<{ id: string; email: string; username: string }>(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, passwordHash]
    );
    const user = inserted.rows[0]!;

    const token = generateSessionToken();
    await createSession(user.id, token, { userAgent: req.headers['user-agent'] });
    setSessionCookie(reply, token);

    return reply.code(201).send({ user, token });
  });

  app.post('/auth/login', {
    config: { rateLimit: { max: 10, timeWindow: '10 minutes' } },
  }, async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation Error' });
    }
    const { email, password } = parsed.data;

    const result = await query<{
      id: string; email: string; username: string; password_hash: string;
    }>(`SELECT id, email, username, password_hash FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });
    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) return reply.code(401).send({ error: 'Invalid email or password' });

    const token = generateSessionToken();
    await createSession(user.id, token, { userAgent: req.headers['user-agent'] });
    setSessionCookie(reply, token);

    return reply.send({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  });

  app.post('/auth/logout', async (req, reply) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      await deleteSession(auth.slice(7).trim());
    }
    const raw = req.cookies[SESSION_COOKIE];
    if (raw) {
      const unsigned = req.unsignCookie(raw);
      if (unsigned.valid && unsigned.value) await deleteSession(unsigned.value);
    }
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    return reply.send({ ok: true });
  });

  app.get('/auth/me', { preHandler: [app.requireAuth] }, async (req, reply) => {
    return reply.send({ user: req.user });
  });
}
'@

Write-Host "        API patched.`n" -ForegroundColor Green

# ==================================================================
# PART 2: SCAFFOLD THE EXPO APP
# ==================================================================
Write-Host "  [2/4] Creating Expo mobile app..." -ForegroundColor Cyan

$mobileDir = Join-Path $PSScriptRoot 'apps\mobile'
New-Item -ItemType Directory -Force -Path $mobileDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $mobileDir 'src\screens') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $mobileDir 'src\lib') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $mobileDir 'src\context') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $mobileDir 'src\theme') | Out-Null

Write-Utf8File 'apps\mobile\package.json' @'
{
  "name": "@vexro/mobile",
  "version": "0.1.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.1.0",
    "react-native-safe-area-context": "4.12.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.0",
    "typescript": "^5.6.0"
  }
}
'@

Write-Utf8File 'apps\mobile\app.json' @'
{
  "expo": {
    "name": "VEXRO Connect",
    "slug": "vexro-connect",
    "version": "0.1.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "scheme": "vexro",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vexro.connect"
    },
    "android": {
      "package": "com.vexro.connect"
    }
  }
}
'@

Write-Utf8File 'apps\mobile\babel.config.js' @'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
'@

Write-Utf8File 'apps\mobile\tsconfig.json' @'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
'@

Write-Utf8File 'apps\mobile\index.js' @'
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
'@

Write-Utf8File 'apps\mobile\.env' "EXPO_PUBLIC_API_URL=$apiUrl`n"

Write-Utf8File 'apps\mobile\App.tsx' @'
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { colors } from './src/theme/colors';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.accent,
    border: colors.border,
  },
};

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
'@

Write-Utf8File 'apps\mobile\src\theme\colors.ts' @'
export const colors = {
  bg: '#0a0a0f',
  card: '#151520',
  border: '#232334',
  text: '#f0f0f5',
  textDim: '#8888a0',
  accent: '#7c5cff',
  accentDim: '#5a3fd6',
  danger: '#ff4466',
  success: '#44dd88',
};
'@

Write-Utf8File 'apps\mobile\src\lib\api.ts' @'
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
'@

Write-Utf8File 'apps\mobile\src\context\AuthContext.tsx' @'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken, clearToken, type User } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const { user } = await api.me();
        setUser(user);
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    await setToken(token);
    setUser(user);
  };

  const register = async (email: string, username: string, password: string) => {
    const { user, token } = await api.register(email, username, password);
    await setToken(token);
    setUser(user);
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    await clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
'@

Write-Utf8File 'apps\mobile\src\screens\LoginScreen.tsx' @'
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (!email || !password) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>VEXRO</Text>
        <Text style={styles.tagline}>Your people. Your space. Your rules.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textDim}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>No account? Create one</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 48, fontWeight: '800', color: colors.text, letterSpacing: 4, textAlign: 'center' },
  tagline: { color: colors.textDim, textAlign: 'center', marginTop: 8, marginBottom: 40 },
  input: {
    backgroundColor: colors.card, color: colors.text,
    padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent, padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { backgroundColor: colors.accentDim },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 24 },
});
'@

Write-Utf8File 'apps\mobile\src\screens\RegisterScreen.tsx' @'
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (!email || !username || !password) return;
    setBusy(true);
    try {
      await register(email.trim(), username.trim(), password);
    } catch (e: any) {
      Alert.alert('Registration failed', e.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Create account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (12+ chars, upper/lower/number)"
          placeholderTextColor={colors.textDim}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 32, textAlign: 'center' },
  input: {
    backgroundColor: colors.card, color: colors.text,
    padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  button: { backgroundColor: colors.accent, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: colors.accentDim },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 24 },
});
'@

Write-Utf8File 'apps\mobile\src\screens\DashboardScreen.tsx' @'
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>VEXRO</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sprint 3 complete</Text>
          <Text style={styles.cardText}>
            You're signed in from a real mobile client with a real session.
            Next up: channels, messaging, and communities.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  logout: { color: colors.danger, fontSize: 14 },
  body: { flex: 1, paddingHorizontal: 24 },
  welcome: { color: colors.textDim, fontSize: 16 },
  username: { color: colors.text, fontSize: 32, fontWeight: '700', marginTop: 4 },
  email: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: colors.card, padding: 20, borderRadius: 16,
    marginTop: 40, borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: { color: colors.success, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  cardText: { color: colors.text, lineHeight: 22 },
});
'@

Write-Host "        Expo app scaffolded.`n" -ForegroundColor Green

# ==================================================================
# PART 3: INSTALL
# ==================================================================
Write-Host "  [3/4] Installing dependencies (this takes a minute)..." -ForegroundColor Cyan

npm install
if ($LASTEXITCODE -ne 0) { throw "Root npm install failed" }

Push-Location $mobileDir
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Mobile npm install failed" }
Pop-Location

Write-Host "        Installed.`n" -ForegroundColor Green

# ==================================================================
# PART 4: SMOKE TEST
# ==================================================================
Write-Host "  [4/4] Running API tests to confirm nothing broke..." -ForegroundColor Cyan
npm test
if ($LASTEXITCODE -ne 0) { throw "API tests failed after patch" }

Write-Host "`n  ============================================" -ForegroundColor Green
Write-Host "   VEXRO Connect - Sprint 3 COMPLETE" -ForegroundColor Green
Write-Host "  ============================================`n" -ForegroundColor Green
Write-Host "  Mobile API URL: $apiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "  To run the app:" -ForegroundColor White
Write-Host "    1. Make sure the API is running:" -ForegroundColor DarkGray
Write-Host "       npm run dev:api" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    2. In another terminal, start Expo:" -ForegroundColor DarkGray
Write-Host "       cd apps\mobile" -ForegroundColor DarkGray
Write-Host "       npm start" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    3. Install Expo Go on your phone and scan the QR code." -ForegroundColor DarkGray
Write-Host "       Phone and PC must be on the same Wi-Fi." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  If Windows Firewall blocks the connection, allow Node.js:" -ForegroundColor Yellow
Write-Host "    netsh advfirewall firewall add rule name=`"VEXRO Dev`" dir=in action=allow protocol=TCP localport=3001" -ForegroundColor Yellow
Write-Host ""
Read-Host "  Press Enter to close"