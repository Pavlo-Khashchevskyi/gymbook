import { useEffect, useState } from 'react';
import { getMe, type MeResponse } from '../api/auth';
import { useAuth } from '../auth/useAuth';

export function CurrentUser() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const { logout, token } = useAuth();

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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow">
      <span>
        Logged in as {user.email} ({user.role})
      </span>

      <button
        type="button"
        onClick={logout}
        className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
      >
        Log out
      </button>
    </div>
  );
}
