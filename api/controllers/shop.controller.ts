import type { Context } from "koa";

import { Shop } from "../models";

type CreateShopBody = {
  shopDomain?: string;
  shopName?: string;
  accessToken?: string;
  senderEmail?: string;
};

type UpdateShopBody = {
  shopName?: string;
  senderEmail?: string;
};

// export async function createShop(ctx: Context) {
//   const {
//     shopDomain,
//     shopName,
//     accessToken,
//     senderEmail,
//   } = ctx.request.body as CreateShopBody;

//   if (
//     !shopDomain ||
//     !shopName ||
//     !accessToken
//   ) {
//     ctx.status = 400;

//     ctx.body = {
//       success: false,
//       message:
//         "shopDomain, shopName and accessToken are required",
//     };

//     return;
//   }

//   const existingShop = await Shop.findOne({
//     where: {
//       shopDomain,
//     },
//   });

//   if (existingShop) {
//     ctx.status = 409;

//     ctx.body = {
//       success: false,
//       message: "Shop already exists",
//     };

//     return;
//   }

//   const shop = await Shop.create({
//     shopDomain,
//     shopName,
//     accessToken,
//     senderEmail: senderEmail ?? null,
//   });

//   ctx.status = 201;

//   ctx.body = {
//     success: true,

//     data: {
//       id: shop.id,
//       shopDomain: shop.shopDomain,
//       shopName: shop.shopName,
//       senderEmail: shop.senderEmail,
//     },
//   };
// }

export async function createShop(ctx: Context) {
  const body = ctx.request.body as {
    shopDomain?: string;
    shopName?: string;
    accessToken?: string;
  };

  const {
    shopDomain,
    shopName,
    accessToken,
  } = body;

  if (!shopDomain || !shopName || !accessToken) {
    ctx.status = 400;

    ctx.body = {
      success: false,
      message: "Missing required fields",
    };

    return;
  }

  const [shop, created] =
    await Shop.findOrCreate({
      where: {
        shopDomain,
      },
      defaults: {
        shopDomain,
        shopName,
        accessToken,
      },
    });

  if (!created) {
    shop.shopName = shopName;
    shop.accessToken = accessToken;

    await shop.save();
  }

  ctx.status = created ? 201 : 200;

  ctx.body = {
    success: true,
    data: shop,
  };
}
// GET /api/shops/:shopDomain
export async function getShop(ctx: Context) {
  const { shopDomain } = ctx.params;

  const shop = await Shop.findOne({
    where: {
      shopDomain,
    },

    attributes: {
      exclude: ["accessToken"],
    },
  });

  if (!shop) {
    ctx.status = 404;

    ctx.body = {
      success: false,
      message: "Shop not found",
    };

    return;
  }

  ctx.body = {
    success: true,
    data: shop,
  };
}
// PUT /api/shops/:shopDomain
export async function updateShop(ctx: Context) {
  const { shopDomain } = ctx.params;

  const {
    shopName,
    senderEmail,
  } = ctx.request.body as UpdateShopBody;

  const shop = await Shop.findOne({
    where: {
      shopDomain,
    },
  });

  if (!shop) {
    ctx.status = 404;

    ctx.body = {
      success: false,
      message: "Shop not found",
    };

    return;
  }

  if (shopName !== undefined) {
    shop.shopName = shopName;
  }

  if (senderEmail !== undefined) {
    shop.senderEmail =
      senderEmail || null;
  }

  await shop.save();

  ctx.body = {
    success: true,

    data: {
      id: shop.id,
      shopDomain: shop.shopDomain,
      shopName: shop.shopName,
      senderEmail: shop.senderEmail,
    },
  };
}