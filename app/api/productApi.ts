import { apiRequest } from "./apiClient";
import type { Product } from "../types/product";

export type ProductPagination = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type GetProductsResponse = {
  products: Product[];
  pagination: ProductPagination;
};

export const getProducts = (
  shopId: number,
  options?: {
    limit?: number;
    cursor?: string | null;
    tags?: string[];
  },
): Promise<GetProductsResponse> => {
  const params = new URLSearchParams();

  params.set(
    "shopId",
    String(shopId),
  );

  params.set(
    "limit",
    String(options?.limit ?? 50),
  );

  if (options?.cursor) {
    params.set(
      "cursor",
      options.cursor,
    );
  }

  if (
    options?.tags &&
    options.tags.length > 0
  ) {
    params.set(
      "tags",
      options.tags.join(","),
    );
  }

  return apiRequest<GetProductsResponse>(
    `/api/products?${params.toString()}`,
  );
};