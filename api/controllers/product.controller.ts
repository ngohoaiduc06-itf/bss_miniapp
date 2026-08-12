import type { Context } from "koa";
import { shopifyGraphql } from "../services/shopify.service";

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  status: string;
  tags: string[];
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    nodes: {
      id: string;
      price: string;
      title: string;
    }[];
  };
};

type ShopifyProductsResponse = {
  products: {
    nodes: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

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

  const query = `
    query GetProducts {
      products(first: 50) {
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
    );

  const products =
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
        price:
          Number(
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
    data: products,
  };
}