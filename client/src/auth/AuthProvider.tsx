import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getMe, TOKEN_KEY, type MeResponse } from '../api/auth';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<MeResponse | null>(null);

  const isLoading = token !== null && user === null;

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();

    getMe(token, controller.signal)
      .then(setUser)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          logout();
        }
      });

    return () => {
      controller.abort();
    };
  }, [token, logout]);

  return (
    <AuthContext value={{ token, login, logout, isLoading, user }}>
      {children}
    </AuthContext>
  );
}
