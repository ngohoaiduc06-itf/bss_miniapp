import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  useAppDispatch,
} from "../store/hooks";

import {
  updateShopData,
} from "../store/slices/shopDataSlice";

import RuleList from "../components/rule-list/RuleList";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3001";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const { admin, session } =
    await authenticate.admin(request);

  const response =
    await admin.graphql(`
      query {
        shop {
          id
          name
        }
      }
    `);

  const result =
    await response.json();

  const shop =
    result.data.shop;

  if (!session.accessToken) {
    throw new Error(
      "Access token is missing",
    );
  }

  const shopResponse =
    await fetch(
      `${API_BASE_URL}/api/shops`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          shopDomain:
            session.shop,

          shopName:
            shop.name,

          accessToken:
            session.accessToken,
        }),
      },
    );

  const shopResult =
    await shopResponse.json();

  if (
    !shopResponse.ok ||
    !shopResult.success
  ) {
    throw new Error(
      `Failed to save shop: ${JSON.stringify(
        shopResult,
      )}`,
    );
  }

  return {
    shop: shopResult.data,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
            demoInfo: metafield(namespace: "$app", key: "demo_info") {
              jsonValue
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
          metafields: [
            {
              namespace: "$app",
              key: "demo_info",
              value: "Created by React Router Template",
            },
          ],
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  const metaobjectResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpsertMetaobject($handle: MetaobjectHandleInput!, $values: JSON!) {
      metaobjectUpsert(handle: $handle, values: $values) {
        metaobject {
          id
          handle
          values
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        handle: {
          type: "$app:example",
          handle: "demo-entry",
        },
        values: {
          title: "Demo Entry",
          description:
            "This metaobject was created by the Shopify app template to demonstrate the metaobject API.",
        },
      },
    },
  );

  const metaobjectResponseJson = await metaobjectResponse.json();

  return {
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
    metaobject: metaobjectResponseJson!.data!.metaobjectUpsert!.metaobject,
  };
};

export default function Index() {
  const { shop } =
    useLoaderData<typeof loader>();

  const dispatch =
    useAppDispatch();

  const fetcher =
    useFetcher<typeof action>();

  const shopify =
    useAppBridge();

  useEffect(() => {
    dispatch(
      updateShopData({
        id: shop.id,
        name: shop.shopName,
        domain: shop.shopDomain,
      }),
    );
  }, [
    shop,
    dispatch,
  ]);

  const isLoading =
    ["loading", "submitting"].includes(
      fetcher.state,
    ) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (
      fetcher.data?.product?.id
    ) {
      shopify.toast.show(
        "Product created",
      );
    }
  }, [
    fetcher.data?.product?.id,
    shopify,
  ]);

  return <RuleList />;
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
