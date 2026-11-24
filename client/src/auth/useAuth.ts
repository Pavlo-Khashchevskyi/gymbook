import { use } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const context = use(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
