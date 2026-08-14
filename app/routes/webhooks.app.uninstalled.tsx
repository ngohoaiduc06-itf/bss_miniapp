import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const action = async ({
  request,
}: ActionFunctionArgs) => {

  const { shop, session, topic, } = await authenticate.webhook(request);

  const url =
    `${API_BASE_URL}/api/shops/${encodeURIComponent(shop,)}/uninstalled`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
    },
    );

    const responseText =
      await response.text();

    console.log(
      "API response body:",
      responseText,
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Failed to update shop status:",
        errorText,
      );
    } else {
      console.log(
        `Shop ${shop} status updated to uninstalled`,
      );
    }
  } catch (error) {
    console.error(
      "Failed to call shop uninstall API:",
      error,
    );
  }

  if (session) {
    await db.session.deleteMany({
      where: { shop },
    });
  }

  return new Response();
};
