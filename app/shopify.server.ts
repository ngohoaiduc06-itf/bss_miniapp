import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import "@shopify/shopify-app-react-router/adapters/node";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";


const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.July26,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),

  hooks: {
    afterAuth: async ({ admin, session, }) => {
      console.log(
        `[AfterAuth] Shop authenticated: ${session.shop}`,
      );

      if (!session.accessToken) {
        console.error(
          `[AfterAuth] Access token missing for ${session.shop}`,
        );
        return;
      }

      try {
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

        if (!shopResponse.ok || !shopResult.success) {
          throw new Error(
            `Failed to save shop: ${JSON.stringify(
              shopResult,
            )}`,
          );
        }
        console.log(
          `[AfterAuth] Shop saved successfully: ${session.shop}`,
        );
      } catch (error) {
        console.error(
          `[AfterAuth] Failed to save shop ${session.shop}:`,
          error,
        );
      }
    },
  },
});

export default shopify;
export const apiVersion = ApiVersion.July26;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
