import { useEffect, useState } from 'react';
import { getMe, TOKEN_KEY, type MeResponse } from '../api/auth';

type Props = {
  onLogout: () => void;
};

export function CurrentUser({ onLogout }: Props) {
  const [user, setUser] = useState<MeResponse | null>(null);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    onLogout();
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      handleLogout();
      return;
    }

    const controller = new AbortController();

    getMe(token, controller.signal)
      .then(setUser)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          handleLogout();
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shado">
      <span>
        Logged in as {user.email} ({user.role})
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
      >
        Log out
      </button>
    </div>
  );
}
