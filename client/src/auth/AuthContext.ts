import { createContext } from 'react';
import type { MeResponse } from '../api/auth';

export type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: MeResponse | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
