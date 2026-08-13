export type RuleStatus = "enable" | "disable";

export type ApplyToType = "all" | "tags";

export type PricingType =
  | "fixedPrice"
  | "fixedDiscount"
  | "percentage";

export interface Rule {
  // shopId: number;
  id: string;
  name: string;
  status: RuleStatus;
  applyTo: ApplyToType;
  tags: string[];
  priority: number;
  pricingType: PricingType;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}