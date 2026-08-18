import type { Context } from "koa";

import { shopifyGraphql } from "../services/shopify.service";

import type {
  ShopifyProductsResponse,
  FormattedProduct,
} from "../types/shopify-product.type";

export async function getProducts(ctx: Context) {
  const shopId = Number(ctx.query.shopId);

  if (!shopId) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "shopId is required",
    };

    return;
  }

  const limit = Math.min(
    Math.max(
      Number(ctx.query.limit) || 50,
      1,
    ),
    250,
  );

  const cursor =
    typeof ctx.query.cursor === "string"
      ? ctx.query.cursor
      : null;

  const tags =
    typeof ctx.query.tags === "string"
      ? ctx.query.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      : [];

  const productQuery =
    tags.length > 0
      ? tags
        .map((tag) => `tag:${tag}`)
        .join(" OR ")
      : null;

  const query = `
    query GetProducts(
      $first: Int!
      $after: String
      $query: String
    ) {
      products(
        first: $first
        after: $after
        query: $query
      ) {
        nodes {
          id
          title
          handle
          status
          tags
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            nodes {
              id
              title
              price
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data =
    await shopifyGraphql<ShopifyProductsResponse>(
      shopId,
      query,
      {
        first: limit,
        after: cursor,
        query: productQuery,
      },
    );

  const products: FormattedProduct[] =
    data.products.nodes.map(
      (product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        status: product.status,
        tags: product.tags,
        image:
          product.featuredImage?.url ??
          null,
        imageAlt:
          product.featuredImage?.altText ??
          product.title,
        price: Number(
          product.variants.nodes[0]?.price ??
          0,
        ),
        variantId:
          product.variants.nodes[0]?.id ??
          null,
      }),
    );

  ctx.body = {
    success: true,
    data: {
      products,
      pagination: {
        hasNextPage:
          data.products.pageInfo.hasNextPage,
        endCursor:
          data.products.pageInfo.endCursor,
      },
    },
  };
}