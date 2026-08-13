import Router from "@koa/router";
import shopRoutes from "./shop.routes";
import ruleRoutes from "./rule.routes";
import productRoutes from "./product.routes";

const apiRouter = new Router({
  prefix: "/api",
});

apiRouter.use(shopRoutes.routes(), shopRoutes.allowedMethods());
apiRouter.use(ruleRoutes.routes(), ruleRoutes.allowedMethods());
apiRouter.use(productRoutes.routes(), productRoutes.allowedMethods());

export default apiRouter;