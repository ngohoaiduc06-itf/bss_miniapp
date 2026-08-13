import Router from "@koa/router";
import {
  createShop,
  getShop,
  updateShop,
} from "../controllers/shop.controller";

const router = new Router({
  prefix: "/shops",
});

router.post("/", createShop);
router.get("/:shopDomain", getShop);
router.put("/:shopDomain", updateShop);

export default router;