import { Shop } from "api/models";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3001";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const result =
    (await response.json()) as
      | ApiResponse<T>
      | {
          success: false;
          message?: string;
        };

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        `Request failed: ${response.status}`,
    );
  }

  return (result as ApiResponse<T>).data;
}

export async function createShop(
  data: {
    shopDomain: string;
    shopName: string;
    accessToken: string;
  },
): Promise<Shop> {
  const response = await fetch(
    `${API_BASE_URL}/api/shops`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Shop>(response);
}