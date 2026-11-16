import { useActionState } from "react";
import { login, type LoginResponse } from "../api/auth";

type State = {
  error: string | null;
  user: LoginResponse["user"] | null;
  email: string;
};

const initialState: State = { error: null, user: null, email: '' };

async function loginAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  try {
    const result = await login(email, password);

    return {
      error: null,
      user: result.user,
      email,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Login error",
      user: null,
      email,
    };
  }
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  if (state.user) {
    return (
      <span>
        Hi, {state.user.email} ({state.user.role})
      </span>
    );
  }

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <label>
        Email
        <input
          type="email"
          name="email"
          required
          defaultValue={state.email}
          autoComplete="email"
        />
      </label>
      
      <label>
        Password
        <input type="password" name="password" required autoComplete="current-password" />
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </button>

      {state.error && (
        <p role="alert" style={{ color: "red" }}>{state.error}</p>
      )}
    </form>
  );
}
