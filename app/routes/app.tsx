// import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
// import { Outlet, useLoaderData, useRouteError } from "react-router";
// import { boundary } from "@shopify/shopify-app-react-router/server";
// import { AppProvider } from "@shopify/shopify-app-react-router/react";

// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   await authenticate.admin(request);

//   // eslint-disable-next-line no-undef
//   return { apiKey: process.env.SHOPIFY_API_KEY || "" };
// };

// // export const loader = async ({ request }: LoaderFunctionArgs) => {
// //   const { session, admin } = await authenticate.admin(request);

// //   const response = await admin.graphql(`
// //     {
// //       shop {
// //         name
// //       }
// //     }
// //   `);

// //   const data = await response.json();

// //   const shopName = data.data.shop.name;

// //   await createOrUpdateShop({
// //     shopDomain: session.shop,
// //     accessToken: session.accessToken!,
// //     shopName,
// //   });

// //   return {
// //     apiKey: process.env.SHOPIFY_API_KEY || "",
// //   };
// // };


// export default function App() {
//   const { apiKey } = useLoaderData<typeof loader>();

//   return (
//     <AppProvider embedded apiKey={apiKey}>
//       <s-app-nav>
//         <s-link href="/app">Home</s-link>
//         <s-link href="/app/additional">Additional page</s-link>
//       </s-app-nav>
//       <Outlet />
//     </AppProvider>
//   );
// }

// // Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
// export function ErrorBoundary() {
//   return boundary.error(useRouteError());
// }

// export const headers: HeadersFunction = (headersArgs) => {
//   return boundary.headers(headersArgs);
// };


import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-react-router/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { NavMenu } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <ShopifyAppProvider embedded apiKey={apiKey}>
      <PolarisAppProvider i18n={polarisTranslations}>
        <NavMenu>
          <a href="/app" rel="home">
            Home
          </a>
          <a href="/app">Rules</a>
          <a href="/app/settings">Settings</a>
        </NavMenu>
        <Outlet />
      </PolarisAppProvider>
    </ShopifyAppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};