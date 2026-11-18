export type Role = 'admin' | 'trainer' | 'client';
export const TOKEN_KEY = 'token-gymbook';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? 'Server is unavailable, try again later');
  }

  return data;
}

export type MeResponse = LoginResponse['user'];

export async function getMe(
  token: string,
  signal: AbortSignal,
): Promise<MeResponse> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? 'Server is unavailable, try again later');
  }

  return data;
}
