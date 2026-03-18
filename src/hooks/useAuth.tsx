'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { apiRequest } from '../lib/api';
import { AUTH_STORAGE_KEY } from '../lib/auth-storage';
import type { AuthUser } from '../types';

type AuthResponse = {
  token: string;
  user: AuthUser;
};

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    apiRequest<{ user: AuthUser }>('/api/auth/me', { token })
      .then((response) => {
        if (!isMounted) return;
        setUser(response.user);
      })
      .catch(() => {
        if (!isMounted) return;
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleAuth(path: '/api/auth/login' | '/api/auth/signup', payload: object) {
    const response = await apiRequest<AuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setToken(response.token);
    setUser(response.user);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: response.token }));
  }

  function logout() {
    setToken(null);
    setUser(null);
    setIsLoading(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login: (payload) => handleAuth('/api/auth/login', payload),
        signup: (payload) => handleAuth('/api/auth/signup', payload),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
