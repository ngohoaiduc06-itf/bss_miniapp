import Router from "@koa/router";
import { getProducts } from "../controllers/product.controller";

const router = new Router({
  prefix: "/products",
});

router.get("/", getProducts);

export default router;