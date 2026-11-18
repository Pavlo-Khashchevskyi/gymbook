import { useEffect, useState } from 'react';
import { getMe, TOKEN_KEY, type MeResponse } from '../api/auth';

export function CurrentUser() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setError('Token not found');
      return;
    }

    const controller = new AbortController();

    getMe(token, controller.signal)
      .then(setUser)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(
            err instanceof Error
              ? err.message
              : 'Unauthorized, Server is unavailable',
          );
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <span>
      Logged in as {user.email} ({user.role})
    </span>
  );
}
