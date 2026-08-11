import { Shop } from "./Shop";
import { Rule } from "./Rule";

Shop.hasMany(Rule, {
  foreignKey: "shopId",
  as: "rules",
  onDelete: "CASCADE",
});

Rule.belongsTo(Shop, {
  foreignKey: "shopId",
  as: "shop",
});

export {
  Shop,
  Rule,
};