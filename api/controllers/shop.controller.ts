import type { Context } from "koa";
import { Shop } from "../models";
import type { CreateShopBody, UpdateShopBody } from "../types/shop.type";

// POST /api/shops
export async function createShop(ctx: Context) {
  const body = ctx.request.body as CreateShopBody;

  const { shopDomain, shopName, accessToken } = body;

  if (!shopDomain || !shopName || !accessToken) {
    ctx.status = 400;

    ctx.body = {
      success: false,
      message: "Missing required fields",
    };

    return;
  }

  const [shop, created] = await Shop.findOrCreate({
    where: {
      shopDomain,
    },
    defaults: {
      shopDomain,
      shopName,
      accessToken,
      status: "active",
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
  const { shopName } = ctx.request.body as UpdateShopBody;
  
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

  await shop.save();

  ctx.body = {
    success: true,
    data: {
      id: shop.id,
      shopDomain: shop.shopDomain,
      shopName: shop.shopName,
    },
  };
}