import Router from "@koa/router";
import {
  createShop,
  getShop,
  updateShop,
  uninstallShop
} from "../controllers/shop.controller";

const router = new Router({
  prefix: "/shops",
});

router.post("/", createShop);
router.get("/:shopDomain", getShop);
router.put("/:shopDomain", updateShop);
router.patch("/:shopDomain/uninstalled", uninstallShop);

export default router;