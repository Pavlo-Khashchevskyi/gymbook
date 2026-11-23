import { useNavigate } from 'react-router';
import { CurrentUser } from '../components/CurrentUser';

export function HomePage() {
  const navigate = useNavigate();

  return <CurrentUser onLogout={() => navigate('/login')} />;
}
