import type { Shop } from "api/models";
import { apiRequest } from "./apiClient";

export const createShop = (data: {
  shopDomain: string;
  shopName: string;
  accessToken: string;
}) =>
  apiRequest<Shop>("/api/shops", {
    method: "POST",
    body: JSON.stringify(data),
  });