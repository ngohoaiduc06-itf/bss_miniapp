import type { Rule } from "../types/rule";

export const mockRules: Rule[] = [
  {
    id: "1",
    name: "VIP Customer",
    status: "enable",
    applyTo: "all",
    tags: [],
    pricingType: "percentage",
    value: 10,
    createdAt: "2026-08-07",
  },

  {
    id: "2",
    name: "Wholesale",
    status: "enable",
    applyTo: "tags",
    tags: ["wholesale", "b2b"],
    pricingType: "fixedDiscount",
    value: 15,
    createdAt: "2026-08-07",
  },

  {
    id: "3",
    name: "Black Friday",
    status: "disable",
    applyTo: "tags",
    tags: ["sale"],
    pricingType: "fixedPrice",
    value: 50,
    createdAt: "2026-08-07",
  },
];