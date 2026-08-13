export type RuleStatus = "enable" | "disable";
export type RuleApplyTo = "all" | "tags";
export type RulePricingType = "fixedPrice" | "fixedDiscount" | "percentage";

// Type cho payload tạo mới Rule từ Request Body
export interface CreateRuleBody {
  shopId?: number;
  name?: string;
  status?: RuleStatus;
  applyTo?: RuleApplyTo;
  tags?: string[];
  pricingType?: RulePricingType;
  value?: number;
}

// Type cho payload cập nhật Rule (Partial của CreateRuleBody ngoại trừ shopId)
export type UpdateRuleBody = Partial<Omit<CreateRuleBody, "shopId">>;

// Type cho dữ liệu Rule sau khi serialize để đồng bộ lên Shopify Metafield
export interface SerializedRule {
  id: number;
  name: string;
  status: RuleStatus;
  priority: number;
  applyTo: RuleApplyTo;
  tags: string[];
  pricingType: RulePricingType;
  value: number;
}