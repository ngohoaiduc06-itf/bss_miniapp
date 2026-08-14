import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShopData {
  id: number | null;
  name: string;
  domain: string;
}

const initialState: ShopData = {
  id: null,
  name: "",
  domain: "",
};

const shopDataSlice = createSlice({
  name: "shopData",

  initialState,

  reducers: {
    updateShopData: (
      state,
      action: PayloadAction<Partial<ShopData>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  updateShopData,
} = shopDataSlice.actions;

export default shopDataSlice.reducer;