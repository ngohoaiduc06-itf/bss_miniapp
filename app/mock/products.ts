export type MockProduct = {
  id: string;
  title: string;
  image?: string;
  price: number;
};

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    title: "B2Bridge B2B Wholesale Pricing",
    price: 98,
  },
  {
    id: "2",
    title: "BSS B2B Lock, Login, Hide Price",
    price: 120,
  },
  {
    id: "3",
    title: "BSS B2B Quotes & Quick Order",
    price: 150,
  },
  {
    id: "4",
    title: "BSS B2B Wholesale Solution",
    price: 200,
  },
  {
    id: "5",
    title: "Test Product",
    price: 10,
  },
];