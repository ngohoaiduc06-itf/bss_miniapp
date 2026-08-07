export type RuleStatus = "enable" | "disable";

export type ApplyToType = "all" | "tags";

export type PricingType =
  | "fixedPrice"
  | "fixedDiscount"
  | "percentage";

export interface Rule {
  id: string;

  name: string;

  status: RuleStatus;

  applyTo: ApplyToType;

  tags: string[];

  pricingType: PricingType;

  value: number;

  createdAt?: string;

  updatedAt?: string;
}