const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
        console.log(errorMessage)
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  const result = JSON.parse(text) as ApiResponse<T>;

  if (result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
}