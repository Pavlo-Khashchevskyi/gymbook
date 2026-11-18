import { useState } from 'react';
import { TOKEN_KEY } from './api/auth';
import { CurrentUser } from './components/CurrentUser';
import { LoginForm } from './components/LoginForm';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem(TOKEN_KEY) !== null,
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <CurrentUser onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginForm onSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}
