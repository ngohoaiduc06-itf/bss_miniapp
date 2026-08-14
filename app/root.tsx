import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { AppProvider } from "@shopify/polaris";
import { Provider } from "react-redux";
import { store } from "./store";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [
  {
    rel: "stylesheet",
    href: polarisStyles,
  },
  {
    rel: "preconnect",
    href: "https://cdn.shopify.com/",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />

        <Meta />

        <Links />
      </head>

      <body>
        <Provider store={store}>

          <AppProvider i18n={{}}>
            <Outlet />
          </AppProvider>

          <ScrollRestoration />
          <Scripts />
          
        </Provider>
      </body>
    </html>
  );
}