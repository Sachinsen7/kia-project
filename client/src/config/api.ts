// src/config/api.ts

export const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://kia-project.onrender.com";

export async function apiFetch<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

