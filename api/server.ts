import "dotenv/config";

import Koa from "koa";
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";

import { connectDatabase, sequelize } from "./config/database";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/error.middleware"

const app = new Koa();

app.use(cors());

app.use(
  bodyParser({
    enableTypes: ["json", "form"],
  }),
);

app.use(errorHandler)

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.use((ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: "Route not found",
  };
});

const PORT = Number(process.env.API_PORT ?? 3001);

async function startServer() {
  await connectDatabase();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});