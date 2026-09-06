import { User } from '../types/index.js';
import { clientMockDb } from './clientMockDb.js';

const TOKEN_KEY = 'mplads_auth_token';
const USER_KEY = 'mplads_auth_user';

// In-memory fallback if sessionStorage is blocked
let inMemoryToken: string | null = null;
let inMemoryUser: User | null = null;

// Clean up any legacy persistent localStorage tokens to mitigate XSS persistence
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        return sessionStorage.getItem(TOKEN_KEY) || inMemoryToken;
      } catch {
        return inMemoryToken;
      }
    }
    return inMemoryToken;
  },
  setToken: (token: string) => {
    inMemoryToken = token;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(TOKEN_KEY, token);
      } catch {}
    }
  },
  removeToken: () => {
    inMemoryToken = null;
    inMemoryUser = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      } catch {}
    }
  },
  getUser: (): User | null => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : inMemoryUser;
      } catch {
        return inMemoryUser;
      }
    }
    return inMemoryUser;
  },
  setUser: (user: User) => {
    inMemoryUser = user;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {}
    }
  }
};

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

const isStaticDeployment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.endsWith('github.io') ||
    window.location.hostname.includes('githubpreview.dev') ||
    window.location.protocol === 'file:'
  );
};

export const AuthService = {
  login: async (userId: string, password: string): Promise<LoginResponse> => {
    // Diagnostic logging requested to diagnose login process
    console.log('[AuthService] Incoming credentials:', { userId, password });

    // On GitHub Pages or static host, directly authenticate via clientMockDb
    if (isStaticDeployment()) {
      console.log('[AuthService] Operating on static deployment (GitHub Pages). Authenticating via local mock data store.');
      return clientMockDb.login(userId, password);
    }

    let response: Response;
    try {
      response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, password })
      });
    } catch (networkErr) {
      console.log('[AuthService] API response status: Network Error (Falling back to client mock store)', networkErr);
      try {
        return await clientMockDb.login(userId, password);
      } catch {
        throw new Error('Server unreachable. Please check network connection or verify that the server is online.');
      }
    }

    // Diagnostic logging of the API response status
    console.log('[AuthService] API response status:', response.status);

    if (!response.ok) {
      // If 404 on GitHub Pages or custom static server, attempt client mock fallback
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        try {
          console.log('[AuthService] Server returned', response.status, '- attempting local mock store fallback.');
          return await clientMockDb.login(userId, password);
        } catch (fallbackErr: any) {
          if (fallbackErr.message === 'Invalid credentials') {
            throw fallbackErr;
          }
          throw new Error('Server unreachable');
        }
      }

      if (response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (response.status >= 500) {
        throw new Error('Server unreachable (Internal server error)');
      }

      const errorPayload = await response.json().catch(() => ({ error: 'Authentication failed' }));
      throw new Error(errorPayload.error || `Authentication failed (Status ${response.status})`);
    }

    const data: LoginResponse = await response.json();
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const token = authStorage.getToken();
    if (!token) throw new Error('No authentication token found');

    if (isStaticDeployment() || token.includes('static')) {
      return clientMockDb.getMe();
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        return res.json();
      }

      if (res.status === 401) {
        authStorage.removeToken();
        throw new Error('Session expired or invalid token');
      }

      // If 404, fall back to cached user in mock store
      return clientMockDb.getMe();
    } catch {
      return clientMockDb.getMe();
    }
  },

  logout: async (): Promise<void> => {
    const token = authStorage.getToken();
    try {
      if (token && !isStaticDeployment()) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.warn('[AuthService] Logout network error ignored:', err);
    } finally {
      await clientMockDb.logout();
      authStorage.removeToken();
    }
  }
};
