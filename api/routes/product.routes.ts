import Router from "@koa/router";
import {
  getProducts,
} from "../controllers/product.controller";

const router = new Router({
  prefix: "/api",
});

router.get(
  "/products",
  getProducts,
);

export default router;