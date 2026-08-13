import type { Rule } from "../types/rule";
import { apiRequest } from "./apiClient";

export const getRules = (shopId: number) =>
  apiRequest<Rule[]>(`/api/rules?shopId=${shopId}`);

export const getRule = (id: string) =>
  apiRequest<Rule>(`/api/rules/${id}`);

export const createRule = (
  data: Omit<Rule, "id" | "createdAt" | "updatedAt"> & { shopId: number }
) =>
  apiRequest<Rule>("/api/rules", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRule = (id: string, data: Partial<Rule>) =>
  apiRequest<Rule>(`/api/rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteRule = (id: string) =>
  apiRequest<void>(`/api/rules/${id}`, { method: "DELETE" });