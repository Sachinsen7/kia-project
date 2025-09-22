// src/config/api.ts

export const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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

  // If backend sends non-JSON error (like HTML), handle gracefully
  if (!res.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore if response is not JSON
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}
