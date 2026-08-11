import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShopData {
  id: number;
  name: string;
  domain: string;
  senderEmail: string;
}

const initialState: ShopData = {
  id: 1,
  name: "SBC.B-TS - Duc NH",
  domain: "dev-duc-nh.myshopify.com",
  senderEmail: "duchn@bsscommerce.com",
};

const shopDataSlice = createSlice({
  name: "shopData",

  initialState,

  reducers: {
    updateSenderEmail: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.senderEmail = action.payload;
    },

    updateShopData: (
      state,
      action: PayloadAction<Partial<ShopData>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  updateSenderEmail,
  updateShopData,
} = shopDataSlice.actions;

export default shopDataSlice.reducer;