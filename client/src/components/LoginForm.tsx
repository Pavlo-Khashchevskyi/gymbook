import { useActionState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../auth/useAuth';

type State = {
  error: string | null;
  email: string;
};

const initialState: State = { error: null, email: '' };

const labelClass = 'flex flex-col gap-1 text-sm font-medium text-gray-700';
const inputClass =
  'rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900';

export function LoginForm() {
  const { login: saveToken } = useAuth();

  async function loginAction(
    _prevState: State,
    formData: FormData,
  ): Promise<State> {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    try {
      const result = await login(email, password);

      saveToken(result.token);

      return {
        error: null,
        email,
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Login error',
        email,
      };
    }
  }
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold text-gray-900">Log in to GymBook</h1>
      <label className={labelClass}>
        Email
        <input
          type="email"
          name="email"
          required
          defaultValue={state.email}
          autoComplete="email"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-gray-900 py-2 text-white font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Logging in...' : 'Log in'}
      </button>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
