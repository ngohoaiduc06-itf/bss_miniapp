import "dotenv/config";

import Koa from "koa";
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";

import {
  connectDatabase,
  sequelize,
} from "./config/database";

import shopRoutes from "./routes/shop.routes";
import ruleRoutes from "./routes/rule.routes";
import productRoutes from "./routes/product.routes";

const app = new Koa();

app.use(cors());

app.use(
  bodyParser({
    enableTypes: [
      "json",
      "form",
    ],
  }),
);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);

    ctx.status =
      (error as any).status ||
      500;

    ctx.body = {
      success: false,
      message:
        "Internal server error",
    };
  }
});

app.use(
  shopRoutes.routes(),
);

app.use(
  shopRoutes.allowedMethods(),
);

app.use(
  ruleRoutes.routes(),
);

app.use(
  ruleRoutes.allowedMethods(),
);

app.use(
  productRoutes.routes(),
);

app.use(
  productRoutes.allowedMethods(),
);


app.use((ctx) => {
  if (ctx.path === "/health") {
    ctx.body = {
      success: true,
      message: "API is running",
    };

    return;
  }

  ctx.status = 404;

  ctx.body = {
    success: false,
    message: "Route not found",
  };
});

const PORT = Number(
  process.env.API_PORT ?? 3001,
);

async function startServer() {
  await connectDatabase();

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(
      `API server running on http://localhost:${PORT}`,
    );
  });
}

startServer().catch(
  (error) => {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  },
);