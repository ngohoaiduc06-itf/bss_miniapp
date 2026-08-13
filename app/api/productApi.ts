import { apiRequest } from "./apiClient";
import type { Product } from "../types/product";

export const getProducts = (
  shopId: number,
): Promise<Product[]> =>
  apiRequest<Product[]>(
    `/api/products?shopId=${shopId}`,
  );