import type { Rule } from "../types/rule";

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

/**
 * GET /api/rules?shopId=1
 */
export async function getRules(
  shopId: number,
): Promise<Rule[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/rules?shopId=${shopId}`,
  );

  return handleResponse<Rule[]>(response);
}

/**
 * POST /api/rules
 */
export async function createRule(
  data: Omit<
    Rule,
    "id" | "createdAt" | "updatedAt"
  > & {
    shopId: number;
  },
): Promise<Rule> {
  const response = await fetch(
    `${API_BASE_URL}/api/rules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Rule>(response);
}

/**
 * PUT /api/rules/:id
 */
export async function updateRule(
  id: string,
  data: Partial<Rule>,
): Promise<Rule> {
  const response = await fetch(
    `${API_BASE_URL}/api/rules/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Rule>(response);
}

/**
 * DELETE /api/rules/:id
 */
export async function deleteRule(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/rules/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const result = await response.json();

    throw new Error(
      result.message ||
        `Request failed: ${response.status}`,
    );
  }
}