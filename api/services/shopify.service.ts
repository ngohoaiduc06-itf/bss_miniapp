import { Shop } from "../models";

const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION ??
  "2026-07";

export async function shopifyGraphql<
  T = unknown,
>(
  shopId: number,
  query: string,
  variables?: Record<
    string,
    unknown
  >,
): Promise<T> {
  const shop =
    await Shop.findByPk(shopId);

  if (!shop) {
    throw new Error(
      "Shop not found",
    );
  }

  const response =
    await fetch(
      `https://${shop.shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "X-Shopify-Access-Token":
            shop.accessToken,
        },

        body: JSON.stringify({
          query,
          variables,
        }),
      },
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      JSON.stringify(result),
    );
  }

  if (result.errors) {
    throw new Error(
      JSON.stringify(
        result.errors,
      ),
    );
  }

  return result.data;
}