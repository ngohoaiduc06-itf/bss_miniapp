import type { PricingType } from "./rule";

export type Product = {
  id: string;
  title: string;
  handle: string;
  status: string;
  tags: string[];
  image: string | null;
  imageAlt: string;
  price: number;
  variantId: string | null;
};

export type ProductPricingTableProps = {
  products: Product[];
  pricingType: PricingType;
  amount: string;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  onLoadMore: () => void;
};