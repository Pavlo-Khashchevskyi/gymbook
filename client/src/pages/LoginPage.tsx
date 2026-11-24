import { Navigate } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../auth/useAuth';

export function LoginPage() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
}
