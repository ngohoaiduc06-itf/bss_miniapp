export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  status: string;
  tags: string[];
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    nodes: {
      id: string;
      price: string;
      title: string;
    }[];
  };
};

export type ShopifyProductsResponse = {
  products: {
    nodes: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

export type FormattedProduct = {
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