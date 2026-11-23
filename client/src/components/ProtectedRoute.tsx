import { Navigate, Outlet } from 'react-router';
import { TOKEN_KEY } from '../api/auth';

export function ProtectedRoute() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
