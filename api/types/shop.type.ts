export type ShopStatus = "active" | "uninstalled";

export interface CreateShopBody {
  shopDomain?: string;
  shopName?: string;
  accessToken?: string;
}

export interface UpdateShopBody {
  shopName?: string;
}