import type { Context } from "koa";
import { Op } from "sequelize";
import { Rule } from "../models";


// GET /api/rules?shopId=1&search=VIP
export async function getRules(
  ctx: Context,
) {
  const shopId = Number(
    ctx.query.shopId,
  );

  if (!shopId) {
    ctx.status = 400;

    ctx.body = {
      success: false,
      message: "shopId is required",
    };

    return;
  }

  const rules =
    await Rule.findAll({
      where: {
        shopId,
      },

      order: [
        ["priority", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

  ctx.body = {
    success: true,
    data: rules,
  };
}

export async function getRule(
  ctx: Context,
) {
  const id = Number(
    ctx.params.id,
  );

  const rule =
    await Rule.findByPk(id);

  if (!rule) {
    ctx.status = 404;

    ctx.body = {
      success: false,
      message: "Rule not found",
    };

    return;
  }

  ctx.body = {
    success: true,
    data: rule,
  };
}

export async function createRule(
  ctx: Context,
) {
  const body = ctx.request.body as {
    shopId?: number;
    name?: string;
    status?: "enable" | "disable";
    applyTo?: "all" | "tags";
    tags?: string[];
    pricingType?:
      | "fixedPrice"
      | "fixedDiscount"
      | "percentage";
    value?: number;
  };

  const {
    shopId,
    name,
    status = "enable",
    applyTo = "all",
    tags = [],
    pricingType,
    value,
  } = body;

  if (
    !shopId ||
    !name ||
    !pricingType ||
    value === undefined
  ) {
    ctx.status = 400;

    ctx.body = {
      success: false,
      message:
        "Missing required fields",
    };

    return;
  }

  const highestPriority =
    await Rule.max("priority", {
      where: {
        shopId,
      },
    });

  const priority =
    Number(highestPriority || 0) + 1;

  const rule =
    await Rule.create({
      shopId,
      name: name.trim(),
      status,
      priority,
      applyTo,
      tags,
      pricingType,
      value,
    });

  ctx.status = 201;

  ctx.body = {
    success: true,
    data: rule,
  };
}

export async function updateRule(
  ctx: Context,
) {
  const id = Number(
    ctx.params.id,
  );

  const rule =
    await Rule.findByPk(id);

  if (!rule) {
    ctx.status = 404;

    ctx.body = {
      success: false,
      message: "Rule not found",
    };

    return;
  }

  const body = ctx.request.body as Partial<{
    name: string;
    status:
      | "enable"
      | "disable";
    applyTo:
      | "all"
      | "tags";
    tags: string[];
    pricingType:
      | "fixedPrice"
      | "fixedDiscount"
      | "percentage";
    value: number;
  }>;

  if (body.name !== undefined) {
    rule.name = body.name.trim();
  }

  if (body.status !== undefined) {
    rule.status = body.status;
  }

  if (body.applyTo !== undefined) {
    rule.applyTo = body.applyTo;
  }

  if (body.tags !== undefined) {
    rule.tags = body.tags;
  }

  if (body.pricingType !== undefined) {
    rule.pricingType =
      body.pricingType;
  }

  if (body.value !== undefined) {
    rule.value = body.value;
  }

  await rule.save();

  ctx.body = {
    success: true,
    data: rule,
  };
}

export async function deleteRule(
  ctx: Context,
) {
  const id = Number(
    ctx.params.id,
  );

  const rule =
    await Rule.findByPk(id);

  if (!rule) {
    ctx.status = 404;

    ctx.body = {
      success: false,
      message: "Rule not found",
    };

    return;
  }

  await rule.destroy();

  ctx.status = 204;
}