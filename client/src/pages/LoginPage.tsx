import { useNavigate } from 'react-router';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();

  return <LoginForm onSuccess={() => navigate('/', { replace: true })} />;
}
