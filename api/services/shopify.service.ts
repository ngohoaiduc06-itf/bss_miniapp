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

async function getShopGid(
  shopId: number,
): Promise<string> {
  const data =
    await shopifyGraphql<{
      shop: {
        id: string;
      };
    }>(
      shopId,
      `
        query {
          shop {
            id
          }
        }
      `,
    );

  return data.shop.id;
}

export async function syncRulesToShopMetafield(
  shopId: number,
  rules: unknown[],
) {
  const mutation = `
    mutation SetShopRulesMetafield(
      $metafields: [MetafieldsSetInput!]!
    ) {
      metafieldsSet(
        metafields: $metafields
      ) {
        metafields {
          id
          namespace
          key
          type
          value
        }

        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const data =
    await shopifyGraphql<{
      metafieldsSet: {
        metafields: Array<{
          id: string;
          namespace: string;
          key: string;
          type: string;
          value: string;
        }>;
        userErrors: Array<{
          field: string[];
          message: string;
          code: string;
        }>;
      };
    }>(
      shopId,
      mutation,
      {
        metafields: [
          {
            ownerId: await getShopGid(
              shopId,
            ),
            namespace: "bss",
            key: "custom_pricing_rules",
            type: "json",
            value: JSON.stringify(
              rules,
            ),
          },
        ],
      },
    );

  if (
    data.metafieldsSet.userErrors
      .length > 0
  ) {
    throw new Error(
      JSON.stringify(
        data.metafieldsSet.userErrors,
      ),
    );
  }

  return data.metafieldsSet.metafields;
}

export async function getShopRulesMetafield(
  shopId: number,
) {
  const data =
    await shopifyGraphql<{
      shop: {
        id: string;
        metafield: {
          id: string;
          namespace: string;
          key: string;
          type: string;
          value: string;
          jsonValue: unknown;
        } | null;
      };
    }>(
      shopId,
      `
        query GetShopRulesMetafield {
          shop {
            id
            metafield(
              namespace: "bss"
              key: "custom_pricing_rules"
            ) {
              id
              namespace
              key
              type
              value
              jsonValue
            }
          }
        }
      `,
    );

  return data.shop.metafield;
}