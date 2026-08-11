import Router from "@koa/router";

import {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
} from "../controllers/rule.controller";

const router = new Router({
  prefix: "/api/rules",
});

router.get("/", getRules);

router.get(
  "/:id",
  getRule,
);

router.post(
  "/",
  createRule,
);

router.put(
  "/:id",
  updateRule,
);

router.delete(
  "/:id",
  deleteRule,
);

export default router;