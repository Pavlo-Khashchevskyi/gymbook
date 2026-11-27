import { useAuth } from '../auth/useAuth';

export function CurrentUser() {
  const { logout, user } = useAuth();

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
