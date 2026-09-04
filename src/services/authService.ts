import { User } from '../types/index.js';

const TOKEN_KEY = 'mplads_auth_token';
const USER_KEY = 'mplads_auth_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user))
};

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export const AuthService = {
  login: async (userId: string, password: string): Promise<LoginResponse> => {
    // Diagnostic logging requested to diagnose login process
    console.log('[AuthService] Incoming credentials:', { userId, password });

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
      console.log('[AuthService] API response status: Network Error (Server unreachable)', networkErr);
      throw new Error('Server unreachable. Please check network connection or verify that the server is online.');
    }

    // Diagnostic logging of the API response status
    console.log('[AuthService] API response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (response.status === 404 || response.status === 502 || response.status === 503) {
        throw new Error('Server unreachable');
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

    const res = await fetch('/api/auth/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        authStorage.removeToken();
        throw new Error('Session expired or invalid token');
      }
      throw new Error(`Failed to restore session (Status ${res.status})`);
    }

    return res.json();
  },

  logout: async (): Promise<void> => {
    const token = authStorage.getToken();
    try {
      if (token) {
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
      authStorage.removeToken();
    }
  }
};
