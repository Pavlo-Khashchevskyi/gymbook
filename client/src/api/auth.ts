export type Role = 'admin' | 'trainer' | 'client';

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
